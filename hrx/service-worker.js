// Basic service worker to pass PWA installation requirements
const CACHE_NAME = 'hrx-pwa-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.map((key) => {
      if (key !== CACHE_NAME) return caches.delete(key);
    })
  )));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // A fetch handler is strictly required by Chrome to trigger beforeinstallprompt.
  // We simply pass the request through.
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});