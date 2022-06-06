export default ({ $axios, redirect, store }) => {
  $axios.onRequest((config) => {
    const token = store.state.auth.token;
    if (token) {
      config.headers.common.Authorization = token;
    }
    console.log('Making request to ' + config.url);
  });

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status);
    if (code === 400) {
      redirect('/400');
    }
  });
};
