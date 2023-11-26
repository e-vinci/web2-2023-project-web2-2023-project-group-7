module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'/* , 'plugin:react/recommended' */],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    /* ecmaFeatures: {
      jsx: true,
    }, */
  },
  /* plugins: ['react'], */
  rules: {
    'linebreak-style': 0,
    'no-use-before-define': ['error', 'nofunc'],
    // Ajoutez vos règles personnalisées ici
  },
};
