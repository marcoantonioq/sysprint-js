/* eslint-disable no-throw-literal */
import { Shell } from '../../util';
const { app } = require('./Printer');

export const PrinterController = {
  /**
   * Lista de impressoras
   * @param {*} param0
   * @param {*} res
   * @returns
   */
  index(_req, res) {
    const data = app.printers.map((el) => el.settings);
    return res.json({ data });
  },

  /**
   * Iniciar impressão
   * @param {*} param0
   * @param {*} res
   * @returns response
   */
  print({ files, body, connection }, res) {
    const resp = {
      msg: '',
      error: '',
      data: [],
    };
    try {
      if (files === null || files.length < 1) throw 'Nenhum arquivo enviado!';
      if (!body.user) throw 'Informe um usuário!';
      const printer = app.printers.find(
        ({ settings }) => settings.path === body.path
      );
      if (!printer) throw 'Informe uma impressora válida!';
      const arquivos = Object.entries(files).map(([key, fileUpload]) => {
        return Shell.mvFile(fileUpload);
      });
      for (const file of arquivos) {
        printer.spools = {
          host: connection.remoteAddress,
          ...body,
          ...file,
        };
        resp.data = printer.spools;
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
    app.printers.forEach((el) => {
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
    const data = (await app.syncPrints()).map((el) => el.settings);
    return res.json(data);
  },
};

export default PrinterController;
