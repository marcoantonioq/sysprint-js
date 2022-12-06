import logging from '../../libs/logging';
import formData from '../../libs/formdata';

export default function ({ $axios, redirect }, inject) {
  // eslint-disable-next-line import/no-named-as-default-member
  logging.setPrefix('SYSPrint');
  inject('logging', logging);
  inject('formData', formData);
}
