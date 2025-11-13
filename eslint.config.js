import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginPrettier from 'eslint-plugin-prettier';
import prettier from 'eslint-config-prettier';

export default [
    {
        ignores: [
            'node_modules/**',
            'build/**',
            'public/build/**',
            '.cache/**',
            'coverage/**',
            '*.min.js',
            'api/node_modules/**',
            'dist/**',
            '.git/**',
            'public/clipboard.svg',
            'public/favicon.ico',
            'public/*.png',
            'public/*.jpg',
            'public/*.xml',
            'public/*.txt',
            'public/*.ico',
            'public/img/**'
        ],
    },
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        languageOptions: {
            globals: globals.browser,
            ecmaVersion: 2020,
            sourceType: 'module',
        },
        plugins: {
            prettier: pluginPrettier,
        },
        rules: {
            'prettier/prettier': 'error',
            'comma-dangle': ['warn', 'always-multiline'],
            quotes: ['warn', 'single'],
            semi: ['warn', 'never'],
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
];