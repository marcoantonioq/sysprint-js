import { LoggingService } from './logging.service';
import { PrintersService } from './printers.service';

export default function ({ $axios, redirect }, inject) {
  const logging = new LoggingService('SysPrint:');
  const printers = new PrintersService($axios);

  inject('logging', logging);
  inject('printers', printers);
}
