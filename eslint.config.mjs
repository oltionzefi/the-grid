import { defineConfig, globalIgnores } from 'eslint/config';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores(['build/*', '!build/index.js', 'src/serviceWorker.ts', '**/public', '**/.eslint*']),
  {
    extends: compat.extends(
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
      'eslint-config-airbnb',
    ),

    plugins: {
      '@typescript-eslint': typescriptEslintEslintPlugin,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
    },

    settings: {
      'import/ignore': [
        'node_modules',
        'src/react-app-env.d.ts',
        'src/serviceWorker.ts',
        '\\.gif$',
        '\\.jpeg$',
        '\\.jpg$',
        '\\.mp4$',
        '\\.png$',
        '\\.scss$',
        '\\.svg$',
        '\\.webm$',
      ],

      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },

    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
        },
      ],

      'padded-blocks': 'off',
      'no-unused-expressions': 'off',
      'react/jsx-filename-extension': [0],
      'import/prefer-default-export': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'react/jsx-props-no-spreading': 'off',
      'no-use-before-define': 'off',
      'import/extensions': 'off',
      'object-curly-newline': 'off',
      'no-undef': 'off',
      'react/button-has-type': 'off',
      'react/require-default-props': 'off',
      'react/no-unescaped-entities': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'no-console': 'warn',
      // Let Prettier own all formatting
      'indent': 'off',
      'react/jsx-indent': 'off',
      'react/jsx-indent-props': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-curly-newline': 'off',
      'max-len': ['warn', { code: 120, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreUrls: true }],
      // Let Prettier handle arrow/function formatting
      'implicit-arrow-linebreak': 'off',
      'function-paren-newline': 'off',
      'operator-linebreak': 'off',
      'no-confusing-arrow': 'off',
      'no-nested-ternary': 'off',
      // HeroUI / React patterns
      'jsx-a11y/no-autofocus': 'off',
      'react/jsx-no-useless-fragment': 'off',
      // Handled in code or not applicable
      'no-promise-executor-return': 'off',
    },
  },
]);
