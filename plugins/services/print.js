import axios from 'axios';
const ipp = require('@sealsystems/ipp');
const PDFDocument = require('pdfkit');

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
  const result = getResponse();
  if (id) {
    const url = `${CUPS_URL}/printers/${print}?WHICH_JOBS=all&QUERY=${id}`;

    const { status, data } = await axios.get(url);

    result.status = status;

    try {
      result.data = data
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

  const printer = ipp.Printer('http://localhost:631/printers/PDF');
  const data = Buffer.from('Ok');
  const msg = {
    'operation-attributes-tag': {
      'requesting-user-name': 'William',
      'job-name': 'My Test Job',
      'document-format': 'application/pdf',
    },
    data,
  };
  // eslint-disable-next-line node/handle-callback-err
  printer.execute('Print-Job', msg, function (err, res) {
    // eslint-disable-next-line no-console
    console.log(res);
  });

  return { msg: 'impressão ok' };
}
