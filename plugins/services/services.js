import logging from './logging';
import formData from './formdata';

export default function ({ $axios, redirect }, inject) {
  inject('logging', logging);
  inject('formData', formData);
}
