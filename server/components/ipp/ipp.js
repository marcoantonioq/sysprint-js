import { exec } from 'child_process';
import ipp from '@sealsystems/ipp';
import { log, error } from '../../../libs/logging';
import { response } from '../../mock/response';
// import { states } from './ipp.states';
const { v4: uuidv4 } = require('uuid');

export const options = {
  user: '-U ',
  print: '-d ',
  copies: '-n ',
  pages: '-o page-ranges=',
  double_sided: '-o sides=',
  page_set: '-o page-set=',
  media: '-o media=',
  orientation: '-o orientation-requested=',
};

export function getSettings(config) {
  console.log(config);

  return config.printers.split(',').map((print) => {
    return {
      // <<erro: impressora com espaço!>>
      print,
      ...config,
      printer: ipp.Printer(`http://127.0.0.1:631/printers/${print.print}`),
      params:
        `-d ${print} ` +
        Object.entries(config)
          .filter(([key, val]) => options[key] && val)
          .map(([key, val]) => `${options[key]}${val}`)
          .join(' '),
    };
  });
}

/**
 * Function promises getJob
 * @param {String} print Name
 * @param {Decimal} id impressora
 * @param {function} callback
 * @returns promises
 */
// eslint-disable-next-line require-await
export function execJob(print, id, callback, error) {
  const printer = ipp.Printer(`http://127.0.0.1:631/printers/${print}`);
  if (!id || !print) {
    // eslint-disable-next-line no-throw-literal
    return error({ msg: `Erro exec job: ${print}, ${id}` });
  }
  return printer.execute(
    'Get-Job-Attributes',
    {
      'operation-attributes-tag': {
        'which-jobs': 'completed',
        'job-id': id,
        'requested-attributes': [
          'job-id',
          'job-media-sheets-completed',
          'job-state',
        ],
      },
    },
    callback
  );
}

// eslint-disable-next-line require-await
export async function execPrint(config, files) {
  const resp = response();
  const settings = getSettings(config);
  settings.forEach((setting) => {
    getFiles(files).forEach((file) => {
      const command = `lp -t "${file.name}" ${setting.params} ${file.path}`;
      log(`Command: ${command}`);
      exec(command, (err, stdout, stderr) => {
        try {
          settings.job = stdout.match(/[a-z]+-\d+/gi)[0].match(/\d+/gi)[0];
          // eslint-disable-next-line no-throw-literal
          if (err) throw `Erro exec lp: ${err.message}`;
          // eslint-disable-next-line no-throw-literal
          if (stderr) throw `Erro stderr lp: ${stderr}`;
          // eslint-disable-next-line no-throw-literal
          if (!settings.job) throw `JOB ${stdout} não identificado!`;

          // const status = setInterval(function () {
          //   setting.printer.execute(
          //     'Get-Job-Attributes',
          //     { 'operation-attributes-tag': { 'job-id': settings.job } },
          //     // eslint-disable-next-line node/handle-callback-err
          //     function (_err, res) {
          //       try {
          //         const job = res['job-attributes-tag'];
          //         states[job['job-state']](job);
          //         if (['completed', 'canceled'].includes(job['job-state'])) {
          //           exec(`rm ${file.path}`);
          //           clearInterval(status);
          //         }
          //       } catch (e) {
          //         error(`Erro ao processar: ${e}`);
          //       }
          //     }
          //   );
          // }, 5000);
        } catch (e) {
          resp.msg = 'SendPrint: ' + e;
          error(resp.msg);
        }
      });
    });
  });
  return resp;
}

export function getFiles(upload) {
  return Object.entries(upload).map(([key, file]) => {
    const filename = uuidv4(file.name);
    const ext = file.mimetype.split('/')[1];
    const path = `out/${filename}.${ext}`;
    file.mv(path, function (err) {
      if (err) log(`Erro ao mover arquivo ${file.name}: ${err}`);
    });
    return {
      ...file,
      path,
    };
  });
}
