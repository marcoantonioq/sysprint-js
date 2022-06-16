export default ({ $axios, redirect, store }) => {
  $axios.onRequest((config) => {
    const token = store.state.auth.token;
    if (token) {
      config.headers.common.Authorization = token;
    }
    // eslint-disable-next-line no-console
    console.log('Making request to ' + config.url);
  });

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status);
    if (code === 400) {
      redirect('/400');
    }
  });
};
