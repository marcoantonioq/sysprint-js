import logging from '../lib/logging';
import formData from '../lib/formdata';

export default function ({ $axios, redirect }, inject) {
  inject('logging', logging);
  inject('formData', formData);
}
