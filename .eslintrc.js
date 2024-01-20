module.exports = {
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/jest-testing-library',
    'react-app',
    'prettier',
  ],
  plugins: ['prettier'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', 'json'],
      parser: '@typescript-eslint/parser',
    },
    {
      files: ['e2e/*.spec.ts'],
      rules: {
        // NOTE: testing-library and playwright have the same functions (e.g. getByRole), so disable rules for testing-library.
        'testing-library/prefer-screen-queries': 'off',
      },
    },
  ],
  rules: {
    'react/jsx-wrap-multilines': 'off',
    'jsx-a11y/anchor-has-content': 'off',
    'comma-dangle': ['warn', 'always-multiline'],
    quotes: ['warn', 'single'],
    semi: ['warn', 'never'],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
      },
    ],
  },
}
