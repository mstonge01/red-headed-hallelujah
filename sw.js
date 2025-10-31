const CACHE_NAME = 'rhh-cache-v1';

// These files are the "app shell" and will be cached immediately.
const APP_SHELL_FILES = [
  './', // Represents the root, often same as index.html
  'index.html',
  'manifest.json',
  'cover.jpg.png',
  'paint-video.mp4'
];

// These are the content files that will be cached in the background
// when triggered by the app.
const CONTENT_FILES = [
  '01-the-crimson-tide.mp3',
  '02-real-women.mp3',
  '03-red-headed-hallelujah.mp3',
  '04-the_good_stuff.mp3',
  '05-zero-degree-beach.mp3',
  '06-caps.mp3',
  '07-interrupted.mp3',
  '08-cinnamon-serenade.mp3',
  '09-golden-devotion.mp3',
  '10-natural-magic.mp3',
  '11-red-headed-hallelujah-guitar.mp3',
  '12-red-headed-hallelujah-piano.mp3',
  '01-the-crimson-tide-art.png',
  '02-real-women-art.png',
  '03-red-headed-hallelujah-art.png',
  '04-the_good_stuff-art.png',
  '05-zero-degree-beach-art.png',
  '06-caps-art.png',
  '07-interrupted-art.png',
  '08-cinnamon-serenade-art.png',
  '09-golden-devotion-art.png',
  '10-natural-magic-art.png',
  '11-red-headed-hallelujah-guitar-art.png',
  '12-red-headed-hallelujah-piano-art.png'
];

// Install event: Caches the app shell.
self.addEventListener('install', event => {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell');
        return cache.addAll(APP_SHELL_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event: Cleans up old caches.
self.addEventListener('activate', event => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event: "Cache-first, then network update" (Stale-While-Revalidate)
self.addEventListener('fetch', event => {
  // We only want to cache GET requests for our app files.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      // 1. Try to get the response from the cache.
      return cache.match(event.request).then(cachedResponse => {
        
        // 2. While we're returning the cached version, fetch a fresh
        //    version from the network to update the cache.
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // Check if we received a valid response
          if (networkResponse && networkResponse.status === 200) {
            console.log(`[SW] Updating cache for: ${event.request.url}`);
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(error => {
          console.warn(`[SW] Network fetch failed for ${event.request.url}:`, error);
          // This happens when offline.
        });

        // 3. Return the cached response immediately if we have it.
        //    If not, we must wait for the network fetch.
        return cachedResponse || fetchPromise;
      });
    })
  );
});

// Message event: Listens for the "cache-content" trigger from the app.
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'cache-content') {
    console.log('[SW] Received message to cache content');
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('[SW] Caching all content files in the background');
          // We use addAll. If any file fails, the promise rejects.
          // For a "softer" cache, you'd iterate and cache one-by-one.
          return cache.addAll(CONTENT_FILES);
        })
        .catch(error => {
          console.error('[SW] Failed to cache content files:', error);
        })
    );
  }
});

