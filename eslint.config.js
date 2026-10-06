const js = require('@eslint/js');
const globals = require('globals');
const ts = require('typescript-eslint');

module.exports = [
  { ignores: ['node_modules'] },
  js.configs.recommended,
  ...ts.configs.recommended, // ponytail: covers .ts too, no extra config until TS files exist
  { languageOptions: { sourceType: 'commonjs', globals: globals.node } },
  { files: ['**/*.js'], rules: { '@typescript-eslint/no-require-imports': 'off' } },
];
