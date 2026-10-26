import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import { plugins, rules } from 'eslint-config-airbnb-extended';
import prettier from 'eslint-config-prettier/flat';

const { base } = rules;

const airbnbBase = [
  base.bestPractices,
  base.errors,
  base.es6,
  base.imports,
  base.strict,
  base.style,
  base.variables,
].map((ruleSet) => ({ name: ruleSet.name, rules: ruleSet.rules }));

export default defineConfig([
  globalIgnores([
    'dist/**',
    'node_modules/**',
    '.devcontainer/**',
    '.vscode/**',
    '.github/**',
    '*.config.js',
  ]),
  {
    files: ['**/*.{js,mjs}'],
    plugins: { js, ...plugins.importX.plugins },
    extends: ['js/recommended'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    settings: {
      'import-x/resolver-next': [plugins.importX.plugins['import-x'].createNodeResolver()],
    },
  },
  ...airbnbBase,
  {
    files: ['server/**/*.{js,mjs}'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['src/**/*.{js,mjs}', 'public/**/*.{js,mjs}'],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    rules: {
      'no-underscore-dangle': ['error', { allow: ['__filename', '__dirname'] }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'import-x/extensions': ['error', 'ignorePackages'],
      'import-x/no-unresolved': ['error', { ignore: ['^#'] }],
      'import-x/no-extraneous-dependencies': [
        'error',
        { devDependencies: [] },
      ],
    },
  },
  prettier,
]);