import fs from 'fs'

export const LogLevel = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
}

const LogIcons = {
  INFO: 'ℹ️',
  WARN: '⚠️',
  ERROR: '❌',
  DEBUG: '🐛',
}

function appendLogToFile(message) {
  try {
    fs.appendFileSync('/data/log', message + '\n')
  } catch (error) {
    console.error('Falha ao escrever no arquivo de log: ', error)
  }
}

function getFormattedTimestamp() {
  const now = new Date()
  return now.toISOString().slice(2, 19).replace('T', ' ')
}

export const logger = {
  logLevel: LogLevel.INFO,

  setLogLevel(logLevel) {
    this.logLevel = logLevel
  },

  log(message, logLevel = LogLevel.INFO) {
    const timestamp = getFormattedTimestamp()
    const logIcon = LogIcons[logLevel] || ''
    const logMessage = `[${timestamp}] [${logLevel}] ${logIcon} ${message}`
    console.log(logMessage)
    appendLogToFile(logMessage)
  },

  error(message) {
    this.log(message, LogLevel.ERROR)
  },

  warn(message) {
    this.log(message, LogLevel.WARN)
  },

  info(message) {
    this.log(message, LogLevel.INFO)
  },

  debug(message) {
    this.log(message, LogLevel.DEBUG)
  },
}
