/** @type {import('jest').Config} */
module.exports = {
  rootDir: __dirname,
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', '/\\.testbin/'],
  // Point env at the binaries and a per-worker upload dir before each file.
  setupFiles: ['<rootDir>/__tests__/setup/setup-env.js'],
  // Download wabt + write the stellar stub once for the whole run.
  globalSetup: '<rootDir>/__tests__/setup/ensure-binaries.js',
  // Pure CommonJS - no transpilation needed.
  transform: {},
  verbose: true,
}
