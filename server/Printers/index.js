/* eslint-disable no-console */
/* eslint-disable no-throw-literal */
import Events from 'events';
import db from '../data';
import { EventsPrinter, EventsSpool } from '../data/Constants';
import Util from '../../util';
const util = require('util');
const ipp = require('@sealsystems/ipp');
const exec = util.promisify(require('child_process').exec);
const { v4: uuidv4 } = require('uuid');

export class Shell extends Events {
  static async exec(cmd) {
    const { err, stdout, stderr } = await exec(cmd);
    if (err) throw `Erro shell exec: ${err.message}`;
    if (stderr) throw `Erro shell stderr: ${stderr}`;
    return stdout.trim();
  }

  static mvFile(fileUpload) {
    const { encoding, name, size, mimetype, md5, mv } = fileUpload;
    const filename = uuidv4(name);
    const ext = mimetype.split('/')[1];
    const path = `out/${filename}.${ext}`;
    mv(path, function (err) {
      if (err) console.log(`Erro ao mover arquivo ${fileUpload.name}: ${err}`);
    });
    return {
      filename: name,
      path,
      size,
      mimetype,
      md5,
      encoding,
    };
  }
}

export class Spool extends Events {
  constructor(settings = {}) {
    super();
    this.settings = Util.mergeDefault(
      {
        options: {
          user: '-U ',
          printers: '-d ',
          copies: '-n ',
          pages: '-o page-ranges=',
          double_sided: '-o sides=',
          page_set: '-o page-set=',
          media: '-o media=',
          orientation: '-o orientation-requested=',
        },
      },
      settings
    );
  }

  /**
   * Restaura um job do banco de dados
   * @param {data} data Dados do Spool
   */
  restore(data) {
    this.data = data;
    this.syncJob();
    return this;
  }

  async print(data) {
    data.printer = data.printers;
    data.params =
      `-d ${data.printer} ` +
      Object.entries(data)
        .filter(([key, val]) => this.settings.options[key] && val)
        .map(([key, val]) => `${this.settings.options[key]}${val}`)
        .join(' ');
    const command = `lp -t "${data.filename}" ${data.params} ${data.path}`;
    const stdout = await Shell.exec(command);
    data.jobid = +stdout.match(/[a-z]+-\d+/gi)[0].match(/\d+/gi)[0];
    if (!data.jobid) throw `JOB ${stdout} não identificado!`;
    delete data.printers;
    delete data.pages;
    delete data.copies;
    delete data.double_sided;
    delete data.page_set;
    delete data.media;
    delete data.orientation;
    this.data = await db.spool.create({ data });
    this.syncJob();
  }

  syncJob() {
    const interval = setInterval(() => {
      const printer = ipp.Printer(
        `http:/localhost:631/ipp/${this.data.printer}`
      );
      printer.execute(
        'Get-Job-Attributes',
        {
          'operation-attributes-tag': {
            'which-jobs': 'completed',
            'job-id': this.data.jobid,
          },
        },
        async (err, res) => {
          if (err) return;
          const tag = res['job-attributes-tag'];
          this.data.status = tag['job-state'];
          this.data.description = tag['job-printer-state-message'];
          this.data.pages = +tag['job-impressions-completed'] || 0;
          if (['completed', 'canceled'].includes(this.data.status)) {
            this.data.complete = true;
            this.emit(EventsSpool.OK, this);
            clearInterval(interval);
          }
          delete this.data.modified;
          this.data = await db.spool.update({
            where: { id: this.data.id },
            data: this.data,
          });
        }
      );
    }, 2000);
  }
}
/**
 * Starting
 * @extends {Events}
 * @param {object} options - Client options
 * @param {object} options.session -
 *
 * @fires Printer#print
 */
export class Printer extends Events {
  constructor(
    { settings, data } = { settings: {}, data: { name: '', path: '' } }
  ) {
    super();
    this.settings = { icon: 'mdi-printer', ...settings };
    this.data = data;
    this.spools = [];
    this.initialize();
  }

  initialize() {
    this.on(EventsPrinter.UPDATE, async (print) => {
      try {
        await db.printer.findFirstOrThrow({ where: { path: print.data.path } });
        await db.printer.update({
          data: print.data,
          where: {
            path: print.data.path,
          },
        });
      } catch (e) {
        await db.printer.create({ data: print.data });
      }
    });
  }

  /**
   * Adiciona spool na fila de impressão
   * @param {Spool} spool Spool de impressão
   * @returns Array<spools>
   */
  addSpool(spool) {
    this.spools.push(spool);
    this.emit(EventsPrinter.PRINT, spool);
    spool.on(EventsSpool.OK, (spool) => {
      const id = this.spools.indexOf(spool);
      this.spools.splice(id, 1);
    });
    return this.spools;
  }
}

class Sysprint extends Events {
  constructor(settings = {}) {
    super();
    this.settings = settings;
    this.printers = [];
    this.syncPrints();
    this.initialize();
  }

  async initialize() {
    // restore spools
    try {
      const spools = await db.spool.findMany({
        where: {
          status: 'pending',
        },
      });
      if (!spools) throw 'Nenhum spool na fila!';
      spools.forEach((el) => {
        const printer = this.printers.find(
          (printer) => printer.data.path === el.printer
        );
        const spool = new Spool();
        spool.restore(el);
        printer.spools.push(spool);
        spool.on(EventsSpool.OK, (spool) => {
          const id = printer.spools.indexOf(spool);
          printer.spools.splice(id, 1);
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  async syncPrints() {
    const stdout = await Shell.exec('lpstat -e -l');
    this.printers.forEach((el) => {
      el.data.status = false;
    });
    return stdout
      .split('\n')
      .map((el) => {
        return {
          data: {
            name: el.replace(/(-|_)/gi, ' ').trim(),
            path: el.trim(),
            status: true,
          },
        };
      })
      .map((printStdout) => {
        let print = this.printers.find(
          ({ data }) => data.path === printStdout.data.path
        );
        if (print) {
          print.data.status = true;
        } else {
          print = new Printer(printStdout);
          this.printers.push(print);
        }
        return print;
      })
      .map(async (printer) => {
        try {
          const cmd = `curl --silent "http://localhost:631/printers/${printer.data.path}" | pandoc --from html --to plain | \
            egrep "Descrição:|Localização:|Driver:|Conexão:|Padrões:" | awk '{$1=""; print $0}'`;
          const [description, localization, driver, connection, definitions] = (
            await Shell.exec(cmd)
          )
            .split('\n')
            .map((el) => el.trim());
          printer.data = {
            ...printer.data,
            description,
            localization,
            driver,
            connection,
            definitions,
          };
          printer.emit(EventsPrinter.UPDATE, printer);
        } catch (e) {
          console.error('Erro update printer: ', e);
        }
        return printer;
      });
  }
}

export const app = {
  sysprint: new Sysprint(),
};

export const PrinterController = {
  /**
   * Lista de impressoras
   * @param {*} param0
   * @param {*} res
   * @returns
   */
  index({ files, body }, res) {
    return res.json({ data: app.sysprint.printers });
  },

  /**
   * Iniciar impressão
   * @param {*} param0
   * @param {*} res
   * @returns response
   */
  async print({ files, body, connection }, res) {
    const resp = {
      msg: '',
      error: '',
      data: [],
    };
    try {
      if (files === null || files.length < 1) throw 'Nenhum arquivo enviado!';
      if (!body.user) throw 'Informe um usuário!';
      const printer = app.sysprint.printers.find(
        (print) => print.data.path === body.printers
      );
      if (!printer) throw 'Informe uma impressora!';
      const arquivos = Object.entries(files).map(([key, fileUpload]) => {
        return Shell.mvFile(fileUpload);
      });
      for (const file of arquivos) {
        const spool = new Spool();
        await spool.print({
          host: connection.remoteAddress,
          ...body,
          ...file,
        });
        resp.data = printer.addSpool(spool);
      }
    } catch (e) {
      const msg = `Erro ao criar trabalho: ${e}`;
      resp.msg = msg;
      resp.error = e.message;
      console.error(msg);
    }
    return res.json(resp);
  },

  /**
   * Spools de impressão
   * @param {body} param0
   * @param {res} res
   * @returns response
   */
  spools({ body }, res) {
    const spools = [];
    app.sysprint.printers.forEach((el) => {
      el.spools.forEach((spool) => {
        spools.push(spool);
      });
    });
    return res.json({ data: spools });
  },

  /**
   * Atualizar lista de impressora com base no cups
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async updateListPrinters(req, res) {
    await app.sysprint.syncPrints();
    return res.json(app.sysprint.printers);
  },
};

export default PrinterController;
