/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  serverModuleFormat: 'cjs',
  browserNodeBuiltinsPolyfill: {
    modules: {
      buffer: true,
      events: true,
      http: true,
      https: true,
      url: true,
      util: true,
    },
  },
}
