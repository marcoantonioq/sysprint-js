import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line no-unused-vars
const db = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// eslint-disable-next-line require-await
async function init() {
  // eslint-disable-next-line no-console
  console.log(`Aplicação inicializada ${new Date().toISOString()}`);
  // await db.loggers.create({
  //   data: {
  //     title: 'Info',
  //     description: `Aplicação inicializada!`,
  //     level: 0,
  //   },
  // });
}

init();

export default db;
