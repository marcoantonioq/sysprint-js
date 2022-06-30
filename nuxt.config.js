import colors from 'vuetify/es5/util/colors';

export default {
  head: {
    titleTemplate: '%s - sysprint-js',
    title: 'sysprint-js',
    htmlAttrs: {
      lang: 'pt-BR',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  serverMiddleware: [
    {
      path: '/api',
      handler: '~/api/index.js',
    },
  ],
  css: [],
  plugins: [
    { src: '@/plugins/axios' },
    { src: '@/plugins/dayjs' },
    { src: '@/plugins/services' },
    { src: '@/plugins/global' },
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

  build: {},
};
