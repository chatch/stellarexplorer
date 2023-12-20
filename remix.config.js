/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  serverModuleFormat: 'cjs',
  browserNodeBuiltinsPolyfill: {
    modules: {
      url: true,
      http: true,
      https: true,
      events: true,
      os: true,
      path: true,
      util: true,
    },
  },
}
