import db from '../Models';
import { log, error } from './logging.components';

export const states = {
  completed: (job, setting) => {
    log('Print: ' + JSON.stringify(job));
    new db.Spool({
      job: job['job-id'],
      username: setting.user,
      printer: setting.print,
      copies: job.copies, // job-media-sheets-completed
      params: setting.params,
      file: job['document-name-supplied'],
      status: job['job-state'],
      media: job.media,
      message: job['job-printer-state-message'],
    })
      .save()
      .catch((err) => {
        error('Erro save: ', err);
      });
  },
  canceled(job) {
    log('Cancelado: ' + JSON.stringify(job));
    return true;
  },
  processing(job) {
    const res = Object.fromEntries(
      [
        'copies',
        'job-id',
        'job-impressions-completed',
        'job-media-progress',
        'job-media-sheets-completed',
        'job-name',
        'job-originating-user-name',
        'job-printer-state-message',
        'job-printer-state-reasons',
        'job-state',
        'number-of-documents',
        'number-up',
      ].map((key) => {
        try {
          return [key, job[key]];
        } catch (e) {
          return null;
        }
      })
    );
    // eslint-disable-next-line no-console
    // console.log('Spool processing: ', res);
    return JSON.stringify(res);
  },
};
