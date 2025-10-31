const CACHE_NAME = 'rhh-streaming-cache-v1';
// Only cache the *app shell*. No media!
const urlsToCache = [
    'index.html',
    'cover.jpg.png'
    // We will let the browser cache the external fonts and tailwind
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                // We use addAll, but we don't fail if one fails.
                // This is a "best-effort" cache for the app shell.
                return cache.addAll(urlsToCache).catch(err => {
                    console.warn("Failed to cache some app shell files:", err);
                });
            })
    );
});

self.addEventListener('fetch', event => {
    // We're using a "Network First" strategy.
    // This *always* tries to get the latest file from GitHub.
    event.respondWith(
        fetch(event.request).catch(() => {
            // If the network fails (offline), *then* try to serve from cache.
            // This will only work for index.html and cover.jpg.png
            return caches.match(event.request);
        })
    );
});

// Clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

