import logging from '../src/Controllers/Components/logging';
import formData from '../src/Controllers/Components/formdata';

export default function ({ $axios, redirect }, inject) {
  inject('logging', logging);
  inject('formData', formData);
}
