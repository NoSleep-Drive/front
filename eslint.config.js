import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['vite.config.js'], // 👈 Node 환경 지정
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);
