module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    "google",
    "plugin:vue/recommended",
  ],
  plugins: [
    'vue'
  ],
  rules: {
    'vue/valid-v-on': 1,
    'require-jsdoc': 0,
    'max-len': [
      'error',
      {
        'code': 120,
        'tabWidth': 2
      },
    ],
  },
};
