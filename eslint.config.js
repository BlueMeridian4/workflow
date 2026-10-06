const js = require('@eslint/js');
const ts = require('typescript-eslint');

module.exports = [
  { ignores: ['node_modules'] },
  js.configs.recommended,
  ...ts.configs.recommended, // ponytail: covers .ts too, no extra config until TS files exist
  { languageOptions: { sourceType: 'commonjs', globals: { console: 'readonly', process: 'readonly', __dirname: 'readonly', __filename: 'readonly' } } },
  { files: ['**/*.js'], rules: { '@typescript-eslint/no-require-imports': 'off' } },
];
