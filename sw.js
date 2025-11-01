const CACHE_NAME = 'rhh-cache-v10'; // This version matches your index.html

// 1. App Shell Files: The basic files needed for the app to run.
// These are cached immediately on install.
const APP_SHELL_FILES = [
    './', // This caches the index.html
    'index.html',
    'manifest.json?v=3', // Matches the v3 in your index.html
    'https://cdn.tailwindcss.com/',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Staatliches&display=swap',
    'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2', // Common font file
    'https://fonts.gstatic.com/s/staatliches/v12/HI_OiY8KO6hCsQSoAPmtMYebvpU.woff2', // Common font file
    'https://www.transparenttextures.com/patterns/stucco.png',
    'https://www.transparenttextures.com/patterns/concrete-wall.png',
    'cover.jpg.jpg', // Main cover art
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

// Helper function to cache with CORS
function cacheRequest(url) {
    if (url.startsWith('http')) {
        return new Request(url, { mode: 'cors' });
    }
    return new Request(url);
}

// 1. Install Step: Cache the app shell
self.addEventListener('install', event => {
    console.log('[SW] Install');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[SW] Caching App Shell...');
            return Promise.all(
                APP_SHELL_FILES.map(url => cache.add(cacheRequest(url)))
            ).catch(err => {
                console.error('[SW] App Shell caching failed', err);
            });
        }).then(() => {
            console.log('[SW] Install complete, skipping waiting.');
            return self.skipWaiting();
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
        console.log('[SW] Received message to cache content (songs/art).');
        event.waitUntil(
            caches.open(CACHE_NAME).then(cache => {
                console.log('[SW] Caching songs and art in background...');
                return Promise.all(
                    CONTENT_FILES.map(url => cache.add(cacheRequest(url)))
                ).catch(error => {
                    console.error('[SW] Failed to cache content:', error);
                });
            })
        );
    }
});

// 4. Fetch Step: Serve from cache, fallback to network
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    // --- Do NOT cache Google Cast SDK ---
    // These are dynamic, online-only scripts. Let them pass through.
    if (event.request.url.includes('gstatic.com/cv/js') || event.request.url.includes('cast.google.com')) {
        // console.log('[SW] Network-only request (Cast):', event.request.url);
        return; // This will use the default network fetch
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            // 1. Respond from Cache (Cache-First)
            if (response) {
                // console.log(`[SW] Serving from cache: ${event.request.url}`);
                return response;
            }

            // 2. Not in Cache: Fetch from Network, Cache, and Respond
            // console.log(`[SW] Fetching from network: ${event.request.url}`);
            return fetch(event.request.clone()).then(networkResponse => {

                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
                    return networkResponse;
                }
                
                // Check if this is a file we want to cache
                const isCachable = APP_SHELL_FILES.some(url => event.request.url.includes(url.replace('https://', ''))) ||
                                     CONTENT_FILES.some(url => event.request.url.includes(url)) ||
                                     event.request.url.includes('gstatic.com/s/'); // Cache Google Fonts
                
                if (isCachable) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(error => {
                console.error(`[SW] Fetch failed, and not in cache: ${event.request.url}`, error);
            });
        })
    );
});

