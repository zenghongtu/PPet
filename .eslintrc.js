module.exports = {
  /* your base configuration of choice */
  extends: ['eslint:recommended', 'plugin:react/recommended'],

  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es2020: true
  },
  globals: {
    __static: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'no-unused-vars': 1
  }
};
