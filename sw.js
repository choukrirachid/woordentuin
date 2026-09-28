const CACHE = 'woordentuin-tablet-v3';
const ROOT = new URL('./', self.location).href;
const FILES = ["index.html", "app.js", "data.js", "bayna-images.js", "ahibb.js", "ahibb-images-01.js", "ahibb-images-02.js", "ahibb-images-03.js", "ahibb-images-04.js", "ahibb-images-05.js", "ahibb-images-06.js", "ahibb-images-07.js", "ahibb-images-08.js", "ahibb-images-09.js", "ahibb-images-10.js", "ahibb-images-11.js", "ahibb-images-12.js", "ahibb-images-13.js", "ahibb-images-14.js", "ahibb-images-15.js", "ahibb-images-16.js", "style.css", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png"];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES.map(path => new URL(path, ROOT).href))));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('woordentuin-tablet-') && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data === 'ACTIVATE_UPDATE') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(ROOT)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const key = event.request.mode === 'navigate' ? new URL('index.html', ROOT).href : event.request;
    const cached = await cache.match(key);
    return cached || fetch(event.request);
  })());
});
