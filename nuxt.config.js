module.exports = {
  mode: 'spa',
  modules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/axios',
    '@nuxtjs/auth',
  ],
  plugins: [
    '~plugins/vee-validate.js',
  ],
  env: {
    FOURSQUARE_CLIENT_ID: process.env.FOURSQUARE_CLIENT_ID,
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    REPOSITORY_URL: process.env.FOURSWEEP_NEXT_REPOSITORY_URL || 'https://github.com/af12066/4sweep-next',
  },
  build: {
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
    },
  },
  auth: {
    redirect: {
      login: '/',
      logout: '/',
      callback: '/login',
      home: '/dashboard',
    },
    strategies: {
      social: {
        _scheme: 'oauth2',
        authorization_endpoint: 'https://foursquare.com/oauth2/authenticate',
        userinfo_endpoint: false,
        response_type: 'token',
        scope: [],
        token_type: 'Authorization',
        redirect_uri: `${process.env.BASE_URL || 'http://localhost:3000'}/login`,
        client_id: process.env.FOURSQUARE_CLIENT_ID,
      },
    },
  },
  head: {
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      {'http-equiv': 'X-UA-Compatible', 'content': 'IE=edge'},
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
    ],
  },
};
