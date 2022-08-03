import logging from '../plugins/logging.components';
import formData from '../plugins/formdata.components';

export default function ({ $axios, redirect }, inject) {
  // eslint-disable-next-line import/no-named-as-default-member
  logging.setPrefix('SYSPrint');
  inject('logging', logging);
  inject('formData', formData);
}
