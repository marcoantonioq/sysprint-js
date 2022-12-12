import db from '../../prisma/db';

export const Printer = {
  state: {
    printers: [],
  },
  get printers() {
    return this.state.printers;
  },
  set printers(printers) {
    this.state.printers = printers;
  },
  /**
   * Sava no banco de dados Prisma um JOB
   * @param {Object} data Data Prisma {path: ADM}
   * @returns
   */
  async save(data) {
    const { id, path } = data;
    try {
      const val = await db.printer.findUniqueOrThrow({
        where: {
          id,
          path,
        },
      });
      const where = { id: val.id };
      return await db.printer.update({ data, where });
    } catch (e) {
      data.name = data.name || data.path;
      return await db.printer.create({ data });
    }
  },
  async findUnique(query) {
    return await db.printer.findUnique(query);
  },
  async findMany(query) {
    return await db.printer.findMany(query);
  },
  async updateMany(query) {
    return await db.printer.updateMany(query);
  },
  async update() {
    this.printers = await db.printer.findMany({
      where: {
        status: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  },
};

Printer.update();
setInterval(() => {
  try {
    Printer.update();
  } catch (e) {}
}, 60 * 1000);

export const PrinterController = {
  index({ files, body }, res) {
    return res.json({ data: Printer.printers });
  },
};

export default PrinterController;
