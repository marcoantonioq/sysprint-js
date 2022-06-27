export const states = {
  completed(job) {
    console.log('Complete:::', job);
    return true;
  },
  canceled(job) {
    console.log('Cancelado::', job);
    return true;
  },
  processing() {
    return true;
  },
};
