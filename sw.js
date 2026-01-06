const CACHE_NAME = 'golf-pro-tracker-v2.5';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn-icons-png.flaticon.com/192/1099/1099680.png',
  'https://cdn-icons-png.flaticon.com/512/1099/1099680.png'
];

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker: Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching Files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Install Complete');
        return self.skipWaiting();
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker: Activate');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Clearing Old Cache');
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activate Complete');
        return self.clients.claim();
      })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetching');
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback for offline
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      })
  );
});

// Background sync (optional)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background Sync');
  }
});

// Push notifications (optional)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New golf round reminder',
    icon: 'https://cdn-icons-png.flaticon.com/192/1099/1099680.png',
    badge: 'https://cdn-icons-png.flaticon.com/96/1099/1099680.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: 'https://cdn-icons-png.flaticon.com/96/1099/1099680.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: 'https://cdn-icons-png.flaticon.com/96/1099/1099680.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Golf Pro Tracker', options)
  );
});
