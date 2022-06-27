/* eslint-disable no-throw-literal */
import axios from 'axios';
import { getSettings, getFiles } from './enum/options';
import { states } from './enum/states';
const { exec } = require('child_process');
const ipp = require('@sealsystems/ipp');

const CUPS_URL = process.env.CUPS_URL || 'http://localhost:631';
export const SPOOL = [];

function getResponse(response) {
  return {
    ...{
      msg: '',
      data: [],
      status: 1,
    },
    ...response,
  };
}

export async function getPrinters() {
  const response = getResponse();
  const result = await axios.get(`${CUPS_URL}/printers`);
  response.data = result.data
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
  return response;
}

// eslint-disable-next-line require-await
export async function getJob(print = '', id = '') {
  const printer = ipp.Printer('http://localhost:631/printers/ADM');
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
    function (err, res) {
      // eslint-disable-next-line no-console
      console.log('Resp:::', res || err);
      return res || err;
    }
  );
}

// eslint-disable-next-line require-await
export async function sendPrint(upload, config) {
  const response = getResponse();
  const settings = getSettings(config);
  settings.forEach((setting) => {
    getFiles(upload).forEach((file) => {
      exec(`lp ${setting.params} ${file.path}`, (error, stdout, stderr) => {
        try {
          console.log('run:: ', `lp ${setting.params} ${file.path}\n`, stdout);
          settings.job = stdout.match(/[a-z]+-\d+/gi)[0].match(/\d+/gi)[0];
          if (error) throw `Erro exec lp: ${error.message}`;
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
                  states[job['job-state']](job);
                  if (['completed', 'canceled'].includes(job['job-state'])) {
                    clearInterval(status);
                  }
                } catch (e) {
                  console.log(`Erro ao processar: ${e}`);
                }
              }
            );
          }, 5000);
        } catch (e) {
          response.msg = 'SendPrint: ' + e;
        }
      });
    });
  });

  return response;
}
