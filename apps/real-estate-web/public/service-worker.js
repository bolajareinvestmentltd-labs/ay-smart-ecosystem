self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('aysmart-static-v1').then((cache) => {
      return cache.addAll(['/','/manifest.webmanifest','/assets/ay-smart-logo.png']);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== 'aysmart-static-v1') {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
