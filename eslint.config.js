/* eslint-env node */
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*', 'supabase/*', 'editor-web/*', 'experiments/*'],
  },
  {
    rules: {
      'react/display-name': 'off',
    },
  },
]);
