import { LoggingService } from './logging.service';

export default function ({ $axios, redirect }, inject) {
  const logging = new LoggingService('SysPrint:');

  inject('logging', logging);
}
