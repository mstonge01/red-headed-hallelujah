/*
Service Worker for Red-Headed Hallelujah
Version: v9 - Manual Update Button
*/

const CACHE_NAME = 'rhh-cache-v9';
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

self.addEventListener('install', event => {
    console.log('[SW v9] Install');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[SW v9] Caching App Shell');
            return cache.addAll(APP_SHELL_URLS);
        })
    );
});

self.addEventListener('activate', event => {
    console.log('[SW v9] Activate');
    // Clean up old caches
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW v9] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Take control immediately
    );
});

self.addEventListener('fetch', event => {
    // Serve from cache first, then check network.
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            // If it's in the cache, serve it.
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // If not, fetch it from the network.
            return fetch(event.request);
        })
    );
});


// --- MESSAGE LISTENER ---
// Listens for the "cache-music" message from the main page.
self.addEventListener('message', event => {
    if (event.data.type === 'CACHE_MUSIC') {
        console.log('[SW v9] Received message to cache music/art.');
        event.waitUntil(
            caches.open(CACHE_NAME).then(cache => {
                console.log('[SW v9] Starting background cache of music/art...');
                return cache.addAll(CONTENT_URLS).then(() => {
                    console.log('[SW v9] All music/art successfully cached.');
                }).catch(error => {
                    console.error('[SW v9] Failed to cache music/art:', error);
                });
            })
        );
    } else if (event.data.type === 'SKIP_WAITING') {
        // This message comes from the "Restart App" button
        self.skipWaiting();
    }
});

