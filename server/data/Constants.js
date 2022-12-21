/**
 * Events emitted Spool
 * @readonly
 * @enum {string}
 */

export const EventsSpool = {
  SEND: 'send',
  STOP: 'stop',
  FINISHED: 'finished',
  UPDATE: 'update',
};

/**
 * Events emitted Printer
 * @readonly
 * @enum {string}
 */
export const EventsPrinter = {
  UPDATE: 'update',
  CREATE: 'create',
  READY: 'ready',
  PRINT: 'print',
  SPOOL_UPDATE: 'spool_update',
  SPOOL_FINISHED: 'spool_finished',
  DISCONNECTED: 'disconnected',
  STATE_CHANGED: 'change_state',
};

/**
 * Events emitted Sysprint
 * @readonly
 * @enum {string}
 */
export const EventsSys = {
  UPDATE: 'update',
  UPDATE_PRINTER: 'update_printer',
  READY: 'ready',
  MESSAGE_RECEIVED: 'message',
  DISCONNECTED: 'disconnected',
  STATE_CHANGED: 'change_state',
};
