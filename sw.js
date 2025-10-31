const CACHE_NAME = 'rhh-cache-v3'; // <-- IMPORTANT: Cache name is v3

// 1. App Shell Files: The basic files needed for the app to run.
// These are cached immediately on install.
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

// 1. Install Step: Cache the app shell
self.addEventListener('install', event => {
    console.log('[SW] Install');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[SW] Caching App Shell...');
            // This is the download that happens while "Checking for Updates..." is shown
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
        console.log('[SW] Received message to cache content (songs/art).');
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
                // This is the "offline-first" part. It's fast.
                if (response) {
                    
                    // 2. Asynchronously update cache (Stale-While-Revalidate)
                    // This fetches the latest version from the network *in the background*
                    // This part is skipped for the song/art files to save bandwidth,
                    // as we assume they won't change.
                    
                    // We only re-validate the main app files
                    const isAppShellFile = APP_SHELL_FILES.some(url => event.request.url.includes(url.replace('./', '')));

                    if (isAppShellFile) {
                        fetch(event.request).then(networkResponse => {
                            if (networkResponse && networkResponse.status === 200) {
                                cache.put(event.request, networkResponse.clone());
                            }
                        }).catch(error => {
                            // Offline, network fetch failed, which is fine.
                        });
                    }

                    return response;
                }

                // 3. Not in Cache: Fetch from Network, Cache, and Respond
                return fetch(event.request).then(networkResponse => {
                    // Check if we received a valid response
                    if (networkResponse && networkResponse.status === 200) {
                        // Don't cache dynamic CDN requests, only our core files
                        const isCachable = APP_SHELL_FILES.some(url => event.request.url.includes(url)) ||
                                         CONTENT_FILES.some(url => event.request.url.includes(url));
                        
                        if (isCachable) {
                            cache.put(event.request, networkResponse.clone());
                        }
                    }
                    return networkResponse;
                }).catch(error => {
                    console.error(`[SW] Fetch failed, and not in cache: ${event.request.url}`, error);
                });
            });
        })
    );
});

