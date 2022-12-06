import db from '../../prisma/db';
const { v4: uuidv4 } = require('uuid');

const JobModel = {
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
  async create(data) {
    console.log(`Model Job add form: `, { data });
    return await db.job.create({ data });
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
  async add({ files, body, connection }, res) {
    const jobs = [];
    try {
      const user = await db.user.findUniqueOrThrow({ where: { id: 1 } });
      const printer = await db.printer.findUniqueOrThrow({ where: { id: 1 } });
      const arquivos = Object.entries(files).map(([key, fileUpload]) => {
        return JobModel.mvFile(fileUpload);
      });
      const params = JobModel.createParams(body);
      for (const file of arquivos) {
        const job = await JobModel.create({
          userid: user.id,
          printerid: printer.id,
          params,
          ...file,
        });
        jobs.push(job);
      }
    } catch (e) {
      console.log(`Erro ao add jobs: ${e}`);
      return res.json({ msg: 'Erro ao salvar jobs', error: e });
    }
    return res.json({ msg: 'ok', data: { jobs } });
  },
};

export default JobController;
