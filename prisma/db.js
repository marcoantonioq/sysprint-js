import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line no-unused-vars
const db = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// eslint-disable-next-line no-console
console.log(`Aplicação inicializada ${new Date().toISOString()}`);
db.loggers.create({
  data: {
    title: 'Info',
    description: `Aplicação inicializada ${new Date().toISOString()}`,
    level: 0,
  },
});

db.loggers.findFirst().then((result) => {
  console.log(`Retorno: ${result}`);
});

export default db;
