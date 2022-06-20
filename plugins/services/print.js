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
  const printer = ipp.Printer('http://localhost:631/printers/PDF');
  return printer.execute(
    'Get-Job-Attributes',
    {
      'operation-attributes-tag': {
        'which-jobs': 'completed',
        'job-id': id,
        'requested-attributes': [
          'job-id',
          'job-uri',
          'job-state',
          'job-state-reasons',
          'job-name',
          'job-originating-user-name',
          'job-media-sheets-completed',
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
export async function sendPrint(files, config) {
  // eslint-disable-next-line no-console
  // console.log('Imprimir::: ', files);
  // eslint-disable-next-line no-console
  // console.log('Config::: ', config);

  const printer = ipp.Printer('http://localhost:631/printers/PDF');
  // const data = Buffer.from('Ok');
  // const msg = {
  //   'operation-attributes-tag': {
  //     'requesting-user-name': 'William',
  //     'job-name': 'My Test Job',
  //     'document-format': 'application/pdf',
  //   },
  //   data,
  // };
  // // eslint-disable-next-line node/handle-callback-err
  // printer.execute('Print-Job', msg, function (err, res) {
  //   // eslint-disable-next-line no-console
  //   console.log('Resp:::', res);
  //   // eslint-disable-next-line no-console
  //   console.log('Err:::', err);

  // });

  return printer.execute(
    'Get-Jobs',
    {
      'operation-attributes-tag': {
        'which-jobs': 'completed',
        'job-id': 2,
        'requested-attributes': [
          'job-id',
          'job-uri',
          'job-state',
          'job-state-reasons',
          'job-name',
          'job-originating-user-name',
          'job-media-sheets-completed',
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
