/**
 * @file public/sw.js
 * @description Service Worker for IEEE MAIT Student Branch Progressive Web App (PWA).
 * 
 * CACHING STRATEGY:
 * - Pre-caches core static assets and primary routes during installation.
 * - Employs Network-First with Cache Fallback for dynamic content and event details.
 * - Allows offline viewing of campus event details, contact info, and leadership maps.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

const CACHE_NAME = 'ieee-mait-pwa-v2';
const PRECACHE_URLS = [
  '/',
  '/events',
  '/people',
  '/chapters',
  '/achievements',
  '/stories',
  '/gallery',
  '/join',
  '/contact',
  '/favicon.svg',
];

// Install Event: Pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Cleanup stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network-First strategy with Cache Fallback
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip browser extension requests
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Clone and store valid responses in cache
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache if network fails (offline)
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return generic offline page if route not in cache
          return caches.match('/');
        });
      })
  );
});
