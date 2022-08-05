/* eslint-disable no-throw-literal */
import { exec } from 'child_process';
import axios from 'axios';
import ipp from '@sealsystems/ipp';
import { getSettings, getFiles } from '../components/ipp/ipp';
import { states } from '../components/ipp/ipp.states';
import { response } from '../mock/response';
import { log, error } from '../components/logging';

const CUPS_URL = process.env.CUPS_URL || 'http://localhost:631';
export const SPOOL = [];

export async function getPrinters(_req, res) {
  const resp = response();
  const result = await axios.get(`${CUPS_URL}/printers`);
  resp.data = result.data
    .match(/<TR><TD><A HREF="\/printers\/([a-zA-Z0-9-^"]+)">/gm)
    .map((printer) => {
      return /"\/printers\/([a-zA-Z0-9-^"]+)"/.exec(printer);
    })
    .map((printer) => {
      return {
        icon: '/img/print.png',
        name: printer[1],
        path: printer[0],
        selected: false,
      };
    });
  return res.json(resp);
}

export function getJob(req, res) {
  const { print, id } = req.params;
  const printer = ipp.Printer(`http://localhost:631/printers/${print}`);
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
    function (err, result) {
      res.json(result || err);
    }
  );
}

export function sendPrint({ files, body }, res) {
  const resp = response();
  const settings = getSettings(body);
  settings.forEach((setting) => {
    getFiles(files).forEach((file) => {
      const command = `lp -t "${file.name}" ${setting.params} ${file.path}`;
      log(`Command: ${command}`);
      exec(command, (err, stdout, stderr) => {
        try {
          settings.job = stdout.match(/[a-z]+-\d+/gi)[0].match(/\d+/gi)[0];
          if (err) throw `Erro exec lp: ${err.message}`;
          if (stderr) throw `Erro stderr lp: ${stderr}`;
          if (!settings.job) throw `JOB ${stdout} não identificado!`;

          const status = setInterval(function () {
            setting.printer.execute(
              'Get-Job-Attributes',
              { 'operation-attributes-tag': { 'job-id': settings.job } },
              // eslint-disable-next-line node/handle-callback-err
              function (_err, res) {
                try {
                  const job = res['job-attributes-tag'];
                  states[job['job-state']](job, setting);
                  if (['completed', 'canceled'].includes(job['job-state'])) {
                    exec(`rm ${file.path}`);
                    clearInterval(status);
                  }
                } catch (e) {
                  error(`Erro ao processar: ${e}`);
                }
              }
            );
          }, 5000);
        } catch (e) {
          resp.msg = 'SendPrint: ' + e;
          error(resp.msg);
        }
      });
    });
  });

  return res.json(resp);
}
