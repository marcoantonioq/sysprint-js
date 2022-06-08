import axios from 'axios';
const fs = require('fs');
const Printer = require('ipp-printer');

const CUPS_URL = process.env.CUPS_URL || 'http://localhost:631';
export const SPOOL = [];

function getResponse(response) {
  return {
    ...{
      msg: '',
      values: [],
      status: 1,
    },
    ...response,
  };
}

export async function getPrinters() {
  const response = await axios.get(`${CUPS_URL}/printers`);
  const printers = response.data
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
  return { printers };
}

// eslint-disable-next-line require-await
export async function getJob(print = '', id = '') {
  const result = getResponse();
  if (id) {
    const url = `${CUPS_URL}/printers/${print}?WHICH_JOBS=all&QUERY=${id}`;

    const { status, data } = await axios.get(url);

    result.status = status;

    try {
      result.values = data
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/&nbsp;/g, '')
        .match(/<table.*?\/table>/gim)
        .find((el, id) => id === 1)
        .match(/<tr.*?\/tr>/gim)
        .map((job) => {
          return job.match(/<td.*?\/td>/gim);
        })
        .filter((el) => !!el)
        .map((job) => {
          return job.map((el) => {
            return el.replace(/<\/?[^>]+(>|$)/gim, '');
          });
        })
        .find((job) => {
          return `${job[0]}`.toUpperCase() === `${print}-${id}`.toUpperCase();
        });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Error find jobs print!', e);
      result.status = 400;
    }
  }

  return result;
}

// eslint-disable-next-line require-await
export async function sendPrint(files, config) {
  // eslint-disable-next-line no-console
  // console.log('Imprimir::: ', files);
  // eslint-disable-next-line no-console
  // console.log('Config::: ', config);

  const printer = new Printer('ADM');

  const filename = 'job-id.ps'; // .ps = PostScript
  fs.open(filename, 'w', function (err, file) {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log('File is opened in write mode.');
  });
  fs.writeFile(filename, 'Ok', (err) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log('File is created successfully.');
  });

  const file = fs.createWriteStream(filename);

  printer.on('job', function (job) {
    // eslint-disable-next-line no-console
    console.log('[job %d] Printing document: %s', job.id, job.name);
    job.on('end', function () {
      // eslint-disable-next-line no-console
      console.log('[job %d] Document saved as %s', job.id, filename);
    });
    job.pipe(file);
  });
  return { msg: 'impressão ok' };
}
