export default (app) => {
  const { $axios, store, error: nuxtError } = app;
  const { state } = store;

  $axios.onRequest((req) => {
    const token = state.auth.token;
    if (token) {
      req.headers.common.Authorization = token;
    }
    console.log('On request!!!');
  });

  $axios.onResponse((req) => {});

  $axios.onError((error) => {
    // eslint-disable-next-line no-console
    console.log('Erro requisição axios!');
    nuxtError({
      statusCode: error.response.status,
      message: error.message,
    });
    return Promise.resolve(false);
  });
};
