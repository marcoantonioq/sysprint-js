/* eslint-disable no-throw-literal */
import * as ipps from '../components/ipp/ipp';
import { response } from '../mock/response';
const util = require('util');
const exec = util.promisify(require('child_process').exec);

export const SPOOL = [];

export async function getPrinters(_req, res) {
  const resp = response();
  const { stdout } = await exec('lpstat -e -l');
  resp.data = stdout
    .trim()
    .split('\n')
    .map((printer) => {
      return {
        icon: '/img/print.png',
        name: printer.replace(/(-|_)/gi, ' '),
        path: printer,
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

export async function print({ files, body }, res) {
  const resp = await ipps.execPrint(body, files);
  console.log('Response print: ', resp);
  return res.json(resp);
}
