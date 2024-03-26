/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

const { configure } = require('quasar/wrappers');

module.exports = configure(function (/* ctx */) {
  return {
    eslint: {
      warnings: true,
      errors: true,
    },

    boot: ['socket'],

    css: ['app.scss'],

    extras: [
      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node16',
      },

      vueRouterMode: 'hash', // available values: 'hash', 'history'
    },

    devServer: {
      open: false,
      proxy: {
        '/socket.io': {
          target: 'http://localhost:3000',
          ws: true,
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: 'http://localhost:3000',
          ws: true,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    framework: {
      config: {},
      lang: 'pt-BR',
      plugins: ['Notify', 'Loading'],
    },

    animations: [],

    ssr: {
      pwa: false,

      prodPort: 3000, // The default port that the production server should use

      middlewares: [
        'render', // keep this as last one
      ],
    },

    pwa: {
      workboxMode: 'generateSW',
      injectPwaMetaTags: true,
      swFilename: 'service-worker.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true,
    },

    electron: {
      inspectPort: 5858,

      bundler: 'packager', // 'packager' or 'builder'

      packager: {},

      builder: {
        appId: 'sysprints',
      },
    },

    bex: {
      contentScripts: ['my-content-script'],
    },
  };
});
