let prefix = '';
const fs = require('fs');

export function appendFile(msg, file = 'log') {
  if (
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null
  ) {
    try {
      const date = new Date().toISOString().split('T')[0];
      // eslint-disable-next-line no-undef
      fs.appendFile(`out/${file}-${date}.txt`, `\n${msg}`, (err) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.log('Error write file: ', err);
          return err;
        }
      });
    } catch (error) {}
  }
}
/**
 * Informar prefixo
 * @param {String} prefixo Prefixo
 */
export function setPrefix(prefixo = false) {
  prefix = prefixo ? `[${prefixo}] ` : '';
}

/**
 * Log
 * @param {String} message Mensagem
 */
export function log(message) {
  const msg = `${prefix}${message}`;
  // eslint-disable-next-line no-console
  console.log(msg);
  appendFile(msg);
}

/**
 * Info
 * @param {String} message Mensagem
 */
export function info(message) {
  const msg = `Info: ${prefix}${message}`;
  // eslint-disable-next-line no-console
  console.info(msg);
  appendFile(msg);
}

export function debug(message) {
  const msg = `Debug: ${prefix}${message}`;
  // eslint-disable-next-line no-console
  console.debug(msg);
  appendFile(msg);
}

export function warn(message) {
  const msg = `Warn: ${prefix}${message}`;
  // eslint-disable-next-line no-console
  console.warn(msg);
  appendFile(msg);
}

export function error(message) {
  const msg = `Error: ${prefix}${message}`;
  // eslint-disable-next-line no-console
  console.error(msg);
  appendFile(msg);
}

export default { log, info, debug, warn, error, setPrefix };