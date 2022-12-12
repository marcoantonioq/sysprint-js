import db from '../../prisma/db';
import { Printer } from './Printer';
import { User } from './User';
const { v4: uuidv4 } = require('uuid');

export const Job = {
  options: {
    user: '-U ',
    print: '-d ',
    copies: '-n ',
    pages: '-o page-ranges=',
    double_sided: '-o sides=',
    page_set: '-o page-set=',
    media: '-o media=',
    orientation: '-o orientation-requested=',
  },
  /**
   * Sava no banco de dados Prisma um JOB
   * @param {Object} data Data Prisma
   * @returns
   */
  async save(data) {
    if (data.id) {
      const query = { data, where: { id: data.id } };
      return await db.job.update(query);
    } else {
      data.status = 'Salvo....';
      return await db.job.create({ data });
    }
  },
  async findUnique(query) {
    return await db.job.findUnique(query);
  },
  async findMany(query) {
    return await db.job.findMany(query);
  },
  async updateMany(query) {
    return await db.job.updateMany(query);
  },
  /**
   * Move arquivo e retorna objeto com o caminho da arquivo!
   * @param {Object} fileUpload Objeto File enviado payload form data
   * @returns Object
   */
  mvFile(fileUpload) {
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
  },
  /**
   * Cria parâmetro para o comando lp
   * @param {Object} bodyForm Dados do formulário { printers, pages, ...}
   * @returns String
   */
  createParams(bodyForm) {
    // eslint-disable-next-line no-throw-literal
    if (!bodyForm.printers) throw 'Impressora invalida!!!';
    return (
      `-d ${bodyForm.printers} ` +
      Object.entries(bodyForm)
        .filter(([key, val]) => this.options[key] && val)
        .map(([key, val]) => `${this.options[key]}${val}`)
        .join(' ')
    );
  },
};

export const JobController = {
  /**
   * Adiciona um novo JOB enviado via post (body)
   * @param {Objeto} param0 Parâmetros da requisição
   * @param {Object} res Request
   * @returns Promises<res.JSON>
   */
  // eslint-disable-next-line require-await
  async add({ files, body, connection }) {
    const resp = {
      msg: '',
      error: '',
      data: [],
    };
    try {
      const user = await User.save({ username: body.user });
      const printer = await Printer.save({ path: body.printers });
      const arquivos = Object.entries(files).map(([key, fileUpload]) => {
        return Job.mvFile(fileUpload);
      });
      const params = Job.createParams(body);
      for (const file of arquivos) {
        const job = await Job.save({
          userid: user.id,
          printerid: printer.id,
          host: connection.remoteAddress,
          params,
          ...file,
        });
        resp.data.push(job);
      }
    } catch (e) {
      const msg = `Erro ao add jobs: ${e}`;
      console.log(msg);
      resp.msg = msg;
      resp.error = e.message;
    }
    return resp;
  },
};

export default JobController;
