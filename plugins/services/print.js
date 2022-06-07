import axios from 'axios';

const CUPS_URL = process.env.CUPS_URL || 'http://localhost:631';
export const SPOOL = [];

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

export function sendPrint(files, config) {
  console.log('Imprimir::: ', files);
  console.log('Config::: ', config);
  return { msg: 'impressão ok' };
}
