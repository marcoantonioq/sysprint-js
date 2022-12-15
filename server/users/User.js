import db from '../data';

export const User = {
  state: {
    users: [],
  },
  get printers() {
    return this.state.users;
  },
  set printers(printers) {
    this.state.users = printers;
  },
  /**
   * Sava no banco de dados Prisma um JOB
   * @param {Object} data Data Prisma {path: ADM}
   * @returns
   */
  async save(data) {
    const { id, username } = data;
    try {
      const val = await db.user.findUniqueOrThrow({
        where: { id, username },
      });
      const where = { id: val.id };
      return await db.user.update({ data, where });
    } catch (e) {
      data.password = data.password || 'default';
      data.groups = data.groups || 'user';
      return await db.user.create({ data });
    }
  },
  async findUnique(query) {
    return await db.user.findUnique(query);
  },
  async findUniqueOrThrow(query) {
    return await db.user.findFirstOrThrow(query);
  },
  async findMany(query) {
    return await db.user.findMany(query);
  },
  async updateMany(query) {
    return await db.user.updateMany(query);
  },
  async update() {
    this.printers = await db.user.findMany({
      where: {
        status: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  },
};

User.update();
setInterval(() => {
  try {
    User.update();
  } catch (e) {}
}, 60 * 1000);

export const PrinterController = {
  index({ files, body }, res) {
    return res.json({ data: User.printers });
  },
};

export default PrinterController;
