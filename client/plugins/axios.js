export default (app) => {
  const { $axios, store, error: nuxtError } = app;
  const { state } = store;

  $axios.onRequest((req) => {
    const token = state.auth.token;
    if (token) {
      req.headers.common.Authorization = token;
    }
  });

  $axios.onResponse((req) => {});

  $axios.onError((error) => {
    // eslint-disable-next-line no-console
    console.log('Erro requisição axios: ', error);
    nuxtError({
      statusCode: error.response.status,
      message: error.message,
    });
    return Promise.resolve(false);
  });
};
