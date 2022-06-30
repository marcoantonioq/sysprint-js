import db from '../../Models';

function saveJob(job, setting) {
  console.log('Complete::', job);
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
    .then(() => {
      console.log('Spool criado com sucesso!');
    })
    .catch((err) => {
      console.log('Erro ao salvar: ', err);
    });
}
export const states = {
  completed: saveJob,
  canceled(job) {
    console.log('Cancelado::', job);
    return true;
  },
  processing() {
    return true;
  },
};
