/* TODO: this file could be pretty much be removed now.
         it was created for the transitionf from the old version of 
         the app that used React and a service worker. This one just
         removed the old for those that had it cached. But most users
         will now be on the new version with no service worker needed. */
/* eslint-disable no-restricted-globals */
self.addEventListener('install', function (e) {
  self.skipWaiting()
})

self.addEventListener('activate', function (e) {
  self.registration
    .unregister()
    .then(function () {
      return self.clients.matchAll()
    })
    .then(function (clients) {
      clients.forEach((client) => client.navigate(client.url))
    })
})
