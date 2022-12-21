/* eslint-disable no-throw-literal */
'use strict';
import Events from 'events';
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { v4: uuidv4 } = require('uuid');

const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

export class Util {
  constructor() {
    throw new Error(
      `The ${this.constructor.name} class may not be instantiated.`
    );
  }

  static mergeDefault(def, given) {
    if (!given) return def;
    for (const key in def) {
      if (!has(given, key) || given[key] === undefined) {
        given[key] = def[key];
      } else if (given[key] === Object(given[key])) {
        given[key] = Util.mergeDefault(def[key], given[key]);
      }
    }

    return given;
  }

  static removeUndefined(obj) {
    const newObj = Object.assign({}, obj);
    Object.entries(newObj)
      .filter(([_key, val]) => val === undefined)
      .forEach(([key]) => delete newObj[key]);
    return newObj;
  }
}

export class Shell extends Events {
  static async exec(cmd) {
    const { err, stdout, stderr } = await exec(cmd);
    if (err) throw `Erro shell exec: ${err.message}`;
    if (stderr) throw `Erro shell stderr: ${stderr}`;
    return stdout.trim();
  }

  static mvFile(fileUpload) {
    const { encoding, name, size, mimetype, md5, mv } = fileUpload;
    const filename = uuidv4(name);
    const ext = mimetype.split('/')[1];
    const path = `out/${filename}.${ext}`;
    mv(path, function (err) {
      if (err) console.log(`Erro ao mover arquivo ${fileUpload.name}: ${err}`);
    });
    return {
      filename: name,
      path,
      size,
      mimetype,
      md5,
      encoding,
    };
  }
}
module.exports = { Util, Shell };
