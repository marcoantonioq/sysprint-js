import colors from 'vuetify/es5/util/colors';

export default {
  srcDir: 'client/',
  dev: process.env.NODE_ENV !== 'production',
  head: {
    titleTemplate: '%s - sysprint-js',
    title: 'sysprint-js',
    htmlAttrs: {
      lang: 'pt-BR',
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi',
      },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  server: {
    port: process.env.PORT || 80,
  },
  serverMiddleware: [
    {
      path: '/api',
      handler: '../server/index.js',
    },
  ],
  plugins: [
    { src: '@/plugins/axios' },
    { src: '@/plugins/dayjs' },
    { src: '@/plugins/services' },
    { src: '@/plugins/global' },
    { src: '@/plugins/socket' },
  ],

  components: true,

  buildModules: ['@nuxtjs/vuetify', '@nuxtjs/eslint-module'],

  modules: ['@nuxtjs/axios', 'cookie-universal-nuxt', 'nuxt-highcharts'],

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  build: {
    extend(config, { isDev, isClient }) {
      config.node = {
        fs: 'empty',
      };
    },
  },
  axios: {
    proxy: true,
    retry: { retries: 3 },
  },
};
