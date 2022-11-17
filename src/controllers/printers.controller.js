/* eslint-disable no-throw-literal */
import axios from 'axios';
import * as ipps from '../components/ipp/ipp';
import { response } from '../mock/response';

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

export function job(req, res) {
  const { print, id } = req.params;
  return ipps.execJob(
    print,
    id,
    (err, result) => {
      console.log('Return:: ', result, err);
      return res.json(result || err);
    },
    (err) => {
      return res.json(err);
    }
  );
}

export function print({ files, body }, res) {
  const resp = ipps.execPrint(body, files);
  return res.json(resp);
}
