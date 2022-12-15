/**
 * Events emitted Spool
 * @readonly
 * @enum {string}
 */

export const EventsSpool = {
  SEND: 'send',
  STOP: 'stop',
  OK: 'ok',
};

/**
 * Events emitted Printer
 * @readonly
 * @enum {string}
 */
export const EventsPrinter = {
  UPDATE: 'update',
  READY: 'ready',
  PRINT: 'print',
  MESSAGE_RECEIVED: 'message',
  DISCONNECTED: 'disconnected',
  STATE_CHANGED: 'change_state',
};
