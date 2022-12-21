/* eslint-disable no-console */
/* eslint-disable no-throw-literal */
import Events from 'events';
import ipp from '@sealsystems/ipp';
import { EventsPrinter, EventsSpool, EventsSys } from '../data/Constants';
import { Util, Shell } from '../../util';
import db from '../data';

class Spool extends Events {
  constructor(settings = {}) {
    super();
    this.settings = {
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
    };
    this.setSettings(settings);
    this.initialize();
  }

  setSettings(settings) {
    this.settings = Util.mergeDefault(this.settings, settings);
    this.emit(EventsSpool.UPDATE, this);
  }

  syncJobStatus() {
    const interval = setInterval(() => {
      try {
        if (this.settings.jobid) {
          const printer = ipp.Printer(
            `http:/localhost:631/ipp/${this.settings.printer}`
          );
          printer.execute(
            'Get-Job-Attributes',
            {
              'operation-attributes-tag': {
                'which-jobs': 'completed',
                'job-id': this.settings.jobid,
              },
            },
            (err, res) => {
              if (err) return;
              const tag = res['job-attributes-tag'];
              this.settings.status = tag['job-state'];
              this.settings.description = tag['job-printer-state-message'];
              this.settings.pages = +tag['job-impressions-completed'] || 0;
              console.log('Update job::: ', this);
              if (['completed', 'canceled'].includes(this.settings.status)) {
                this.settings.complete = true;
                this.emit(EventsSpool.FINISHED, this);
                clearInterval(interval);
                this.save();
              }
            }
          );
        }
      } catch (e) {
        console.log('Erro sync job:: ', e);
      }
    }, 3000);
  }

  async save() {
    const sp = this.settings;
    const data = Util.removeUndefined({
      id: sp.id,
      jobid: sp.jobid,
      user: sp.user,
      printer: sp.printer,
      pages: sp.pages,
      host: sp.host,
      filename: sp.filename,
      size: sp.size,
      encoding: sp.encoding,
      path: sp.path,
      mimetype: sp.mimetype,
      md5: sp.md5,
      params: sp.params,
      status: sp.status,
      complete: sp.complete,
      description: sp.description,
    });
    console.log('Data save spool:: ', data);
    this.settings = Util.mergeDefault(
      this.settings,
      await db.spool.upsert({
        where: { jobid: sp.jobid },
        update: data,
        create: data,
      })
    );
  }

  async print() {
    if (!this.settings?.jobid) {
      this.settings.params =
        `-d ${this.settings.printer} ` +
        Object.entries(this.settings)
          .filter(([key, val]) => this.settings.options[key] && val)
          .map(([key, val]) => `${this.settings.options[key]}${val}`)
          .join(' ');
      const command = `lp -t "${this.settings.filename}" ${this.settings.params} ${this.settings.path}`;
      const stdout = await Shell.exec(command);
      this.settings.jobid = +stdout.match(/[a-z]+-\d+/gi)[0].match(/\d+/gi)[0];
      if (!this.settings.jobid) throw `JOB ${stdout} não identificado!`;
      console.log('Before save this: ', this);
      this.save();
      this.emit(EventsSpool.SEND, this);
    }
  }

  initialize() {
    this.print();
    this.syncJobStatus();
    this.on(EventsSpool.UPDATE, this.save);
    this.on(EventsPrinter.SPOOL_FINISHED, (sp) => {
      console.log('Spool finalizado:', sp);
    });

    this.on(EventsPrinter.SPOOL_UPDATE, (sp) => {
      console.log('Lista de spool atualizada:', sp);
    });
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
class Printer extends Events {
  constructor(settings = {}) {
    super();
    this.settings = {
      icon: 'mdi-printer',
      name: '',
      path: '',
      spools: [],
    };
    this.setSettings(settings);
    this.initialize();
  }

  setSettings(settings) {
    this.settings = Util.mergeDefault(this.settings, settings);
    this.emit(EventsPrinter.UPDATE, this);
  }

  get spools() {
    return this.settings.spools;
  }

  set spools(spool) {
    const sp = new Spool({ printer: this.settings.name, ...spool });
    this.settings.spools.push(spool);
    this.emit(EventsPrinter.SPOOL_UPDATE, sp);
    sp.on(EventsSpool.FINISHED, (spool) => {
      this.settings.spools = this.settings.spools.filter((sp) => sp !== spool);
      this.emit(EventsPrinter.SPOOL_FINISHED, spool);
    });
  }

  async save() {
    const p = this.settings;
    const data = Util.removeUndefined({
      id: p.id,
      allow: p.allow,
      name: p.name,
      path: p.path,
      description: p.description,
      localization: p.localization,
      connection: p.connection,
      definitions: p.definitions,
      driver: p.driver,
      groups: p.groups,
      icon: p.icon,
      default: p.default,
      status: p.status,
      selected: p.selected,
      month_count: p.month_count,
      quota_period: p.quota_period,
      page_limite: p.page_limite,
      k_limit: p.k_limit,
    });
    this.settings = Util.mergeDefault(
      this.settings,
      await db.printer.upsert({
        where: { path: p.path },
        create: data,
        update: data,
      })
    );
  }

  async initialize() {
    try {
      // Recuperar fila de impressão
      const spools = await db.spool.findMany({
        where: {
          status: 'pending',
          printer: this.settings.path,
        },
      });
      console.log('Iniciando spool antigos: ', spools);
      if (!spools) throw 'Nenhum spool na fila!';
      spools.forEach((spool) => {
        console.log('Spool na fila: ', spool);
        this.spools = spool;
      });
    } catch (e) {
      console.log('Erro ao iniciar impressora: ', e);
    }
    // this.on(EventsPrinter.SPOOL_UPDATE, this);
    // this.on(EventsPrinter.SPOOL_FINISHED, this);
    this.on(EventsPrinter.UPDATE, this.save);
    this.emit(EventsPrinter.READY, this);
  }
}

export class Controller extends Events {
  constructor(settings = {}) {
    super();
    this.settings = Util.mergeDefault(
      {
        printers: [],
      },
      settings
    );
    this.syncPrints();
    this.emit(EventsSys.READY, this.printers);
    // this.emit(EventsSys.UPDATE_PRINTER, printers);
  }

  async syncPrints() {
    const stdout = await Shell.exec('lpstat -e -l');
    this.settings.printers.forEach((el) => {
      el.settings.status = false;
    });
    const datas = await Promise.all(
      stdout
        .split('\n')
        .map((el) => {
          return {
            name: el.replace(/(-|_)/gi, ' ').trim(),
            path: el.trim(),
            status: true,
          };
        })
        .map(async (printer) => {
          try {
            const cmd = `curl --silent "http://localhost:631/printers/${printer.path}" | pandoc --from html --to plain | \
            egrep "Descrição:|Localização:|Driver:|Conexão:|Padrões:" | awk '{$1=""; print $0}'`;
            const [description, localization, driver, connection, definitions] =
              (await Shell.exec(cmd)).split('\n').map((el) => el.trim());
            printer = {
              ...printer,
              description,
              localization,
              driver,
              connection,
              definitions,
            };
          } catch (e) {
            console.error('Erro update printer: ', e);
          }
          return printer;
        })
    );
    const printers = datas.map((printer) => {
      let print = this.settings.printers.find(
        ({ settings }) => settings.path === printer.path
      );
      if (print) {
        print.settings.status = true;
      } else {
        print = new Printer(printer);
      }
      return print;
    });
    this.printers = printers;
    return printers;
  }
}

export const app = new Controller();

export default app;
