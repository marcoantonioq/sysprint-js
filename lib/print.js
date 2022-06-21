import axios from 'axios';
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
  console.log(config);
  const msgs = Object.entries(files).map(([key, file]) => {
    const { name, mimetype, data } = file;
    return {
      'operation-attributes-tag': {
        'requesting-user-name': config?.user || 'anonymous',
        'job-name': name,
        'document-format': mimetype,
        'page-ranges-supported': true,
      },
      'job-attributes-tag': {
        // https://istopwg.github.io/ipp/ippguide.html
        copies: 1,
        'page-ranges': '2-3',
      },
      data,
    };
  });

  const printer = ipp.Printer('http://localhost:631/printers/ADM');
  msgs.forEach((msg) => {
    // eslint-disable-next-line node/handle-callback-err
    printer.execute('Print-Job', msg, function (err, res) {
      console.log('Retorno::', res);
      try {
        if (err || res.statusCode !== 'successful-ok')
          throw new Error(
            `Erro: ${res['operation-attributes-tag']['status-message'] || err}`
          );
        const spool = setInterval(function () {
          printer.execute(
            'Get-Job-Attributes',
            {
              'operation-attributes-tag': {
                'which-jobs': 'completed',
                'job-id': res['job-attributes-tag']['job-id'],
                'requested-attributes': [
                  'job-id',
                  'job-media-sheets-completed',
                  'job-name',
                  'job-originating-user-name',
                  'job-state-reasons',
                  'job-state',
                  'job-uri',
                ],
              },
            },
            function (err, res) {
              if (res['job-attributes-tag']['job-state'] === 'completed') {
                console.log('Resp:::', res || err);
                clearInterval(spool);
              }
            }
          );
        }, 3000);
      } catch (e) {
        console.log(e);
        return { msg: e };
      }
    });
  });

  return msgs;
}
