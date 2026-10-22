import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import { plugins, rules } from 'eslint-config-airbnb-extended';
import prettier from 'eslint-config-prettier/flat';

const { base } = rules;

// Reglas de Airbnb (base) sin las de formato: de eso se encarga Prettier
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
  // Back-end, configuración de Vite
  {
    files: ['server/**/*.{js,mjs}'],
    languageOptions: { globals: { ...globals.node } },
  },
  // Front-end
  {
    files: ['src/**/*.{js,mjs}', 'public/**/*.{js,mjs}'],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    rules: {
      'no-underscore-dangle': ['error', { allow: ['__filename', '__dirname'] }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Los alias "#server/*" y devDependencies de configuración
      // ESM en Node exige la extensión .js en imports relativos
      'import-x/extensions': ['error', 'ignorePackages'],
      'import-x/no-unresolved': ['error', { ignore: ['^#'] }],
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: [] }],
    },
  },
  // Siempre al final: desactiva reglas que chocan con Prettier
  prettier,
]);
