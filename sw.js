const CACHE_NAME = 'period-tracker-v3';  // ← 記得每次改內容也要 bump 版本

const urlsToCache = [
  '/period-tracker-pwa/',
  '/period-tracker-pwa/index.html',
  '/period-tracker-pwa/main.css',
  '/period-tracker-pwa/main.js',
  '/period-tracker-pwa/manifest.json',
  '/period-tracker-pwa/icons/icon-192.png',
  '/period-tracker-pwa/icons/icon-512.png',
];
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request)
      .then(resp => resp || fetch(evt.request))
  );
});
