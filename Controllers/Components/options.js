import { log } from './logging';

const { v4: uuidv4 } = require('uuid');
const ipp = require('@sealsystems/ipp');

export const options = {
  user: '-U ',
  print: '-d ',
  copies: '-n ',
  pages: '-o page-ranges=',
  double_sided: '-o sides=',
  page_set: '-o page-set=',
  media: '-o media=',
  orientation: '-o orientation-requested=',
};

export function getSettings(config) {
  return config.printers.split(',').map((print) => {
    return {
      print,
      ...config,
      printer: ipp.Printer(`http://localhost:631/printers/${print.print}`),
      params:
        `-d ${print} ` +
        Object.entries(config)
          .filter(([key, val]) => options[key] && val)
          .map(([key, val]) => `${options[key]}${val}`)
          .join(' '),
    };
  });
}

export function getFiles(upload) {
  return Object.entries(upload).map(([key, file]) => {
    const filename = uuidv4(file.name);
    const ext = file.mimetype.split('/')[1];
    const path = `out/${filename}.${ext}`;
    file.mv(path, function (err) {
      if (err) log(`Erro ao mover arquivo ${file.name}: ${err}`);
    });
    return {
      ...file,
      path,
    };
  });
}
