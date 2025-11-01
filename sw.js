/*
Service Worker for Red-Headed Hallelujah
Version: v13 - Aggressive Update
*/

const CACHE_NAME = 'rhh-cache-v13';
const APP_SHELL_URLS = [
    'index.html',
    'cover.jpg.jpg',
    'paint-video.mp4',
    'hallelujah-intro.mp3',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Staatliches&display=swap',
    'https://www.transparenttextures.com/patterns/stucco.png',
    'https://www.transparenttextures.com/patterns/concrete-wall.png'
];
const CONTENT_URLS = [
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

// --- AGGRESSIVE UPDATE LOGIC ---
// This tells the new service worker to take over immediately.
self.addEventListener('install', event => {
    console.log('[SW v13] Install');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[SW v13] Caching App Shell');
            return cache.addAll(APP_SHELL_URLS);
        }).then(() => {
            // Force the new service worker to activate
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', event => {
    console.log('[SW v13] Activate');
    // Force the new service worker to take control of the page
    event.waitUntil(self.clients.claim());
    
    // Clean up old caches
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW v13] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// --- CACHE & NETWORK STRATEGY ---
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // --- Google Cast SDK ---
    // This is an online-only feature. Always fetch from the network.
    // This also fixes the Cast button not appearing.
    if (url.origin === 'https://www.gstatic.com' || url.pathname.startsWith('/__cast/')) {
        event.respondWith(fetch(event.request));
        return;
    }

    // --- App files ---
    // Serve from cache first, then check network.
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            // If it's in the cache, serve it.
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // If not, fetch it from the network.
            return fetch(event.request).then(networkResponse => {
                // (Don't cache non-app files, just return them)
                return networkResponse;
            });
        })
    );
});


// --- MESSAGE LISTENER ---
// Listens for the "cache-music" message from the main page.
self.addEventListener('message', event => {
    if (event.data.type === 'CACHE_MUSIC') {
        console.log('[SW v13] Received message to cache music/art.');
        event.waitUntil(
            caches.open(CACHE_NAME).then(cache => {
                console.log('[SW v13] Starting background cache of music/art...');
                return cache.addAll(CONTENT_URLS).then(() => {
                    console.log('[SW v13] All music/art successfully cached.');
                }).catch(error => {
                    console.error('[SW v13] Failed to cache music/art:', error);
                });
            })
        );
    }
});

