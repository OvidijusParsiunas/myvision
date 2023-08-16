module.exports = {
  extends: 'airbnb-base',
  rules: {
    'linebreak-style': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'import/no-unresolved': [2, { ignore: ['fabric'] }],
    'prefer-destructuring': ['error', { object: true, array: false }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'function-paren-newline': ['off'],
    'function-call-argument-newline': ['off'],
    'no-restricted-exports': ['off'],
  },
  env: {
    browser: true,
  },
};
