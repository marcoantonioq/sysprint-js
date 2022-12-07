/**
 *  TypeScript
 *  @typedef {import("./index").ParamsServices } services
 */
import { Printer } from '../controllers/Printer';
import { Job } from '../controllers/Job';
import { sleep } from './utils';
const util = require('util');
const exec = util.promisify(require('child_process').exec);

/**
 * Star services
 * @param {services} services
 * @returns
 */
// eslint-disable-next-line require-await
export default async function init() {
  let stdoutPrinters = '';

  /**
   * Atualiza JOBS criados recentemente no banco de dados
   */
  async function updateJobs() {
    while (true) {
      try {
        let { stdout } = await exec('lpstat -o -u root');
        stdout = stdout.trim();
      } catch (e) {
        console.log('Service lp: ', e);
      }
      await sleep(10 * 1000);
    }
  }

  /**
   * Executa trabalhos de impressão criados
   */
  async function execJobs() {
    while (true) {
      try {
        const jobs = await Job.findMany({
          where: { complete: false, status: 'Salvo....' },
        });
        for (const job of jobs) {
          const command = `lp -t "${job.filename}" ${job.params} ${job.path}`;
          const { err, stdout, stderr } = await exec(command);
          job.jobid = +stdout.match(/[a-z]+-\d+/gi)[0].match(/\d+/gi)[0];
          try {
            // eslint-disable-next-line no-throw-literal
            if (err) throw `Erro exec lp: ${err.message}`;
            // eslint-disable-next-line no-throw-literal
            if (stderr) throw `Erro stderr lp: ${stderr}`;
            // eslint-disable-next-line no-throw-literal
            if (!job.jobid) throw `JOB ${stdout} não identificado!`;
            job.status = 'Enviado...';
          } catch (err) {
            job.status = err;
          }
          Job.save(job);
        }
      } catch (e) {
        console.log('Error service execJobs lp: ', e);
      }
      await sleep(2000);
    }
  }

  /**
   * Atualiza lista de impressoras no banco de dados
   */
  async function updatePrinters() {
    while (true) {
      try {
        let { stdout } = await exec('lpstat -e -l');
        stdout = stdout.trim();
        if (!stdoutPrinters || stdout !== stdoutPrinters) {
          stdoutPrinters = stdout;
          const printers = stdout.split('\n').map((printer) => {
            return {
              icon: 'mdi-printer',
              name: printer.replace(/(-|_)/gi, ' ').trim(),
              path: printer.trim(),
            };
          });
          // disable all
          await Printer.updateMany({
            data: { status: false },
          });
          printers.map(async (print) => {
            try {
              // search existents
              const data = await Printer.findUnique({
                where: { path: print.path },
              });
              await Printer.save({
                name: print.name,
                path: print.path,
                icon: print.icon,
                ...data,
                status: true,
              });
            } catch (e) {
              console.log('Erro ao salvar::::', e);
            }
          });
        }
      } catch (e) {
        console.log('Service lp: ', e);
      }
      await sleep(10 * 1000);
    }
  }
  updateJobs();
  updatePrinters();
  execJobs();
}
