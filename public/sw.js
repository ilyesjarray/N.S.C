// Service Worker for N.S Company PWA
const CACHE_NAME = 'nsc-cache-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/Welcome',
    '/icon.png',
    '/icon-192.png',
    '/icon-512.png',
    '/lobby.webm',
    '/thememusic.mp3',
    '/clicksound.wav',
    '/manifest.json'
];

// Install: cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const isVideo = url.pathname.endsWith('.webm') || url.pathname.endsWith('.mp4');
    const isAudio = url.pathname.endsWith('.mp3') || url.pathname.endsWith('.wav');

    // Bypass cache for media/range requests to prevent playback and seeking errors in Chrome/Safari
    if (event.request.headers.has('range') || isVideo || isAudio) {
        return; // Native browser handling
    }

    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                // Cache new successful requests
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        // Strip query parameters for the cache key so it matches correctly
                        const url = new URL(event.request.url);
                        url.search = '';
                        cache.put(url, responseClone);
                    });
                }
                return networkResponse;
            });
        })
    );
});
