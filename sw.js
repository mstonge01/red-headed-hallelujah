const CACHE_NAME = 'rhh-cache-v23'; // Incremented for new files

const APP_SHELL_FILES = [
    './', 
    'index.html',
    'manifest.json?v=3',
    'tracks.js', // -- NEW: Database file
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Staatliches&display=swap',
    'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
    'https://fonts.gstatic.com/s/staatliches/v12/HI_OiY8KO6hCsQSoAPmtMYebvpU.woff2',
    'https://www.transparenttextures.com/patterns/stucco.png',
    'https://www.transparenttextures.com/patterns/concrete-wall.png'
];

function cacheRequest(url) {
    if (url.startsWith('http')) {
        return new Request(url, { mode: 'cors' });
    }
    return new Request(url);
}

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return Promise.all(
                APP_SHELL_FILES.map(url => {
                    return cache.add(cacheRequest(url)).catch(err => {
                        console.warn(`[SW] Failed to cache shell: ${url}`, err);
                    });
                })
            );
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
    if (event.request.headers.has('range')) return; 
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) return response;

            return fetch(event.request).then(networkResponse => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
                    return networkResponse;
                }

                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });
                
                return networkResponse;
            });
        })
    );
});
