const CACHE_NAME = 'rhh-cache-v2'; // <-- Changed to v2 to force update

// 1. App Shell Files: The basic files needed for the app to run.
const APP_SHELL_FILES = [
    './', // This caches the index.html
    'index.html',
    'manifest.json',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Staatliches&display=swap',
    'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2', // Common font file
    'https://fonts.gstatic.com/s/staatliches/v12/HI_OiY8KO6hCsQSoAPmtMYebvpU.woff2', // Common font file
    'https://www.transparenttextures.com/patterns/stucco.png',
    'https://www.transparenttextures.com/patterns/concrete-wall.png',
    'cover.jpg.jpg', // <-- UPDATED to new cover
    'paint-video.mp4',
    'hallelujah-intro.mp3'
];

// 2. Content Files: The songs and art to be cached in the background.
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

// 1. Install Step: Cache the app shell
self.addEventListener('install', event => {
    console.log('[SW] Install');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[SW] Caching App Shell...');
            return cache.addAll(APP_SHELL_FILES);
        })
    );
});

// 2. Activate Step: Clean up old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activate');
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
        })
    );
    return self.clients.claim();
});

// 3. Message Step: Listen for message from app to cache content
self.addEventListener('message', event => {
    if (event.data.action === 'cache-content') {
        console.log('[SW] Received message to cache content.');
        event.waitUntil(
            caches.open(CACHE_NAME).then(cache => {
                console.log('[SW] Caching songs and art in background...');
                return cache.addAll(CONTENT_FILES).catch(error => {
                    console.error('[SW] Failed to cache content:', error);
                });
            })
        );
    }
});

// 4. Fetch Step: Serve from cache, fallback to network, update in background
self.addEventListener('fetch', event => {
    // We only want to cache GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(response => {
                // 1. Respond from Cache (Cache-First)
                if (response) {
                    // console.log(`[SW] Serving from cache: ${event.request.url}`);
                    
                    // 2. Asynchronously update cache (Stale-While-Revalidate)
                    // This fetches the latest version from the network in the background
                    // and updates the cache, so the *next* visit has the freshest content.
                    const fetchPromise = fetch(event.request).then(networkResponse => {
                        // Check if we received a valid response
                        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                            cache.put(event.request, networkResponse.clone());
                        } else if (networkResponse && (networkResponse.status >= 400 || networkResponse.type !== 'basic')) {
                             // Don't cache opaque responses (like from a CDN) or errors
                             // console.log(`[SW] Not caching opaque or error response: ${event.request.url}`);
                        }
                        return networkResponse;
                    }).catch(error => {
                        // Network fetch failed, which is fine if offline.
                        // console.warn(`[SW] Network fetch failed: ${error}`);
                    });

                    return response;
                }

                // 3. Not in Cache: Fetch from Network, Cache, and Respond
                // console.log(`[SW] Fetching from network: ${event.request.url}`);
                return fetch(event.request).then(networkResponse => {
                    // Check if we received a valid response
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        cache.put(event.request, networkResponse.clone());
                    } else if (networkResponse && (networkResponse.status >= 400 || networkResponse.type !== 'basic')) {
                        // Don't cache opaque responses (like from a CDN) or errors
                        // console.log(`[SW] Not caching opaque or error response: ${event.request.url}`);
                    }
                    return networkResponse;
                }).catch(error => {
                    console.error(`[SW] Fetch failed, and not in cache: ${event.request.url}`, error);
                    // You could return a custom offline page here if you had one
                });
            });
        })
    );
});


