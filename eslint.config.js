import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginPrettier from 'eslint-plugin-prettier'
import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: [
      'node_modules/**',
      'build/**',
      'public/build/**',
      '.cache/**',
      'coverage/**',
      '*.min.js',
      'api/**', // CommonJS backend - ignore
      'dist/**',
      '.git/**',
      'public/clipboard.svg',
      'public/favicon.ico',
      'public/*.png',
      'public/*.jpg',
      'public/*.xml',
      'public/*.txt',
      'public/*.ico',
      'public/img/**',
      'stellar-explorer-vite/**',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    linterOptions: {
      reportUnusedDisableDirectives: false,
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
  // Custom rule overrides - relaxing overly strict defaults
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // Relax any usage - too many to fix at once, warn for now
      '@typescript-eslint/no-explicit-any': 'warn',
      // Allow unused vars that start with underscore
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // Relax ts-comment requirements
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': 'allow-with-description',
          minimumDescriptionLength: 1,
        },
      ],
      // Allow require() in specific contexts
      '@typescript-eslint/no-require-imports': 'off',
      // Relax Function type
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      // Relax empty object type
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  // Service worker and e2e files
  {
    files: ['public/**/*.js', 'e2e/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
]
