'use strict';

import axios from 'axios';

export default function ({ params, store }) {
  return axios.get(`${process.env.CUPS_URL}/printers`).then((response) => {
    let printers = response.data
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
    store.commit('updatePrinters', printers);
  });
}
