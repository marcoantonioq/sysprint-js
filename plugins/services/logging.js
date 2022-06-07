/**
 * Informar prefixo
 * @param {String} prefix Prefixo
 */
export function setPrefix(prefix) {
  this.prefix = prefix;
}
/**
 * Log
 * @param {String} message Mensagem
 */
export function log(message) {
  // eslint-disable-next-line no-console
  console.log(`[${this.prefix}] ${message}`);
}

export function debug(message) {
  // eslint-disable-next-line no-console
  console.debug(`[${this.prefix}] ${message}`);
}

export function warn(message) {
  // eslint-disable-next-line no-console
  console.warn(`[${this.prefix}] ${message}`);
}

export default { log, debug, warn };
