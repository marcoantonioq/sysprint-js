/* eslint-disable no-throw-literal */
import { Printer } from '../controllers/Printer';
import { Job } from '../controllers/Job';
const util = require('util');
const exec = util.promisify(require('child_process').exec);

export const lp = {
  /**
   * Atualiza JOBS criados recentemente no banco de dados
   */
  async updateJobs() {
    try {
      let { stdout } = await exec('lpstat -o -u root');
      stdout = stdout.trim();
      // console.log('Jobs update::::', stdout);
    } catch (e) {
      console.log('Service lp: ', e);
    }
  },

  /**
   * Executa trabalhos de impressão criados
   */
  async execJobs() {
    try {
      const jobs = await Job.findMany({
        where: { complete: false, status: 'Salvo....' },
      });
      for (const job of jobs) {
        const command = `lp -t "${job.filename}" ${job.params} ${job.path}`;
        const { err, stdout, stderr } = await exec(command);
        job.jobid = +stdout.match(/[a-z]+-\d+/gi)[0].match(/\d+/gi)[0];
        try {
          if (err) throw `Erro exec lp: ${err.message}`;
          if (stderr) throw `Erro stderr lp: ${stderr}`;
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
  },

  /**
   * Atualiza lista de impressoras no banco de dados
   */
  async updatePrinters() {
    try {
      let { stdout } = await exec('lpstat -e -l');
      stdout = stdout.trim();
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
          const { name, path, icon } = print;
          const cmd = `curl --silent "http://localhost:631/printers/${name}" | pandoc --from html --to plain | \
            egrep "Descrição:|Localização:|Driver:|Conexão:|Padrões:" | awk '{$1=""; print $0}'`;
          const [description, localization, driver, connection, definitions] = (
            await exec(cmd)
          ).stdout
            .split('\n')
            .map((el) => el.trim());
          await Printer.save({
            name,
            icon,
            description,
            status: true,
            path,
            localization,
            driver,
            connection,
            definitions,
          });
        } catch (e) {
          console.log('Erro ao salvar::::', e);
        }
      });
    } catch (e) {
      console.log('Service lp: ', e);
    }
  },
};

export default lp;
