const CACHE_NAME = 'golf-pro-tracker-v2';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn-icons-png.flaticon.com/192/1099/1099680.png',
  'https://cdn-icons-png.flaticon.com/512/1099/1099680.png'
];

// ติดตั้ง Service Worker และแคชไฟล์พื้นฐาน
self.addEventListener('install', event => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching app shell');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// เคลียร์แคชเก่าตอน activate
self.addEventListener('activate', event => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      )
    )
  );
});

// ดัก fetch เพื่อรองรับออฟไลน์
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
