import logging from '../Controllers/Components/logging';
import formData from '../Controllers/Components/formdata';

export default function ({ $axios, redirect }, inject) {
  // eslint-disable-next-line import/no-named-as-default-member
  logging.setPrefix('SYSPrint');
  inject('logging', logging);
  inject('formData', formData);
}
