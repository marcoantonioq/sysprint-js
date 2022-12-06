import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line no-unused-vars
const db = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// eslint-disable-next-line require-await
async function init() {
  // eslint-disable-next-line no-console
  console.log(`Aplicação inicializada ${new Date().toISOString()}`);
  // create user default
  try {
    await db.user.create({
      data: {
        id: 1,
        name: 'User',
        username: 'user',
        password: 'password',
        groups: 'user',
      },
    });
  } catch (e) {}
  try {
    await db.printer.create({
      data: {
        id: 1,
        name: 'ADM',
        groups: 'user',
      },
    });
  } catch (e) {}
}

init();

export default db;
