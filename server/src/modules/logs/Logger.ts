export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

export class Logger {
  private static logLevel: LogLevel = LogLevel.INFO;

  static setLogLevel(logLevel: LogLevel) {
    this.logLevel = logLevel;
  }

  static log(message: string, logLevel: LogLevel = LogLevel.INFO) {
    if (this.shouldLog(logLevel)) {
      console.log(`[${logLevel}] ${message}`);
    }
  }

  private static shouldLog(logLevel: LogLevel): boolean {
    switch (this.logLevel) {
      case LogLevel.INFO:
        return true;
      case LogLevel.DEBUG:
        return logLevel !== LogLevel.INFO;
      case LogLevel.WARN:
        return logLevel === LogLevel.WARN || logLevel === LogLevel.ERROR;
      case LogLevel.ERROR:
        return logLevel === LogLevel.ERROR;
      default:
        return true;
    }
  }

  static error(message: string) {
    this.log(message, LogLevel.ERROR);
  }

  static warn(message: string) {
    this.log(message, LogLevel.WARN);
  }

  static info(message: string) {
    this.log(message, LogLevel.INFO);
  }

  static debug(message: string) {
    this.log(message, LogLevel.DEBUG);
  }
}

