const CACHE_NAME = 'rhh-cache-v19'; // -- IMPORTANT: This is v19

// 1. App Shell Files: The basic files needed for the app to run.
// These are cached immediately on install.
const APP_SHELL_FILES = [
    './', // This caches the index.html
    'index.html',
    'manifest.json?v=3',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Staatliches&display=swap',
    'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2', // Common font file
    'https://fonts.gstatic.com/s/staatliches/v12/HI_OiY8KO6hCsQSoAPmtMYebvpU.woff2', // Common font file
    'https://www.transparenttextures.com/patterns/stucco.png',
    'https://www.transparenttextures.com/patterns/concrete-wall.png',
    'cover.png', // Main cover art
    'paint-video.mp4',
    'hallelujah-intro.mp3',
];

// 2. Content Files: The songs, art, and LYRICS to be cached in the background.
// This list is now updated to match your new tracklist AND include SRT files.
const CONTENT_FILES = [
    '01-intro.mp3',
    '01-intro-art.png',
    '02-the-crimson-tide.mp3',
    '02-the-crimson-tide-art.png',
    '03-real-women.mp3',
    '03-real-women-art.png',
    '04-red-headed-hallelujah.mp3',
    '04-red-headed-hallelujah-art.png',
    '05-the_good_stuff.mp3',
    '05-the_good_stuff-art.png',
    '06-zero-degree-beach.mp3',
    '06-zero-degree-beach-art.png',
    '07-caps.mp3',
    '07-caps-art.png',
    '08-red-paddle-queen.mp3',
    '08-red-paddle-queen.png',
    '09-interrupted.mp3',
    '09-interrupted-art.png',
    '10-cinnamon-serenade.mp3',
    '10-cinnamon-serenade-art.png',
    '11-basement-stereo-glow.mp3',
    '11-basement-stereo-glow.png',
    '12-golden-devotion.mp3',
    '12-golden-devotion-art.png',
    '13-natural-magic.mp3',
    '13-natural-magic-art.png',
    '14-outro.mp3',
    '14-outro-art.png',
    '15-red-headed-hallelujah-guitar.mp3',
    '16-natural-magic-acoustic.mp3',

    // --- NEWLY ADDED SRT FILES ---
    'Basement Stereo Glow.srt',
    'Caps.srt',
    'Cinnamon Serenade.srt',
    'Golden Devotion.srt',
    'Interrupted.srt',
    'Natural Magic (Acoustic).srt',
    'Natural Magic.srt',
    'Outro.srt',
    'Real Women.srt',
    'Red Paddle Queen.srt',
    'Red-Headed Hallelujah (Guitar).srt',
    'Red-Headed Hallelujah.srt',
    'The Crimson Tide.srt',
    'The Good Stuff.srt',
    'Zero-Degree Beach.srt'
];

// Helper function to cache with CORS
function cacheRequest(url) {
    // Check if the URL is an absolute URL (starts with http)
    if (url.startsWith('http')) {
        // For cross-origin requests (like Google Fonts, textures), we need 'cors' mode
        return new Request(url, { mode: 'cors' });
    }
    // For local files, just return a normal request
    return new Request(url);
}

// 1. Install Step: Cache the app shell
self.addEventListener('install', event => {
    console.log('[SW] Install');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[SW] Caching App Shell...');
            return Promise.all(
                APP_SHELL_FILES.map(url => {
                    return cache.add(cacheRequest(url)).catch(err => {
                        console.warn(`[SW] Failed to cache (App Shell): ${url}`, err);
                    });
                })
            );
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
        console.log('[SW] Received message to cache content (songs/art/srt).');
        event.waitUntil(
            caches.open(CACHE_NAME).then(cache => {
                console.log('[SW] Caching content in background...');
                return Promise.all(
                    CONTENT_FILES.map(url => {
                        return cache.add(cacheRequest(url)).catch(error => {
                            console.warn(`[SW] Failed to cache (Content): ${url}`, error);
                        });
                    })
                );
            })
        );
    }
});

// 4. Fetch Step: Serve from cache, fallback to network
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            // 1. Respond from Cache (Cache-First)
            if (response) {
                return response;
            }

            // 2. Not in Cache: Fetch from Network, Cache, and Respond
            return fetch(event.request.clone()).then(networkResponse => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
                    return networkResponse;
                }
                
                const url = event.request.url;
                
                // Check if the file is one we want to cache
                const isAppShell = APP_SHELL_FILES.some(path => url.includes(path));
                const isContent = CONTENT_FILES.some(path => url.includes(path));
                const isFont = url.includes('gstatic.com');

                if (isAppShell || isContent || isFont) {
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
