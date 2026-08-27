/**
 * @file public/sw.js
 * @description Service Worker for IEEE MAIT Student Branch Progressive Web App (PWA).
 * 
 * CACHING STRATEGY:
 * - Pre-caches core static assets and primary routes during installation.
 * - Employs Stale-While-Revalidate for public API routes.
 * - Employs Network-First with Cache Fallback for dynamic public pages.
 * - Strictly bypasses admin dashboard, authentication, and officer mutations.
 * - Allows offline viewing of campus event details, contact info, and leadership maps.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

const CACHE_NAME = 'ieee-mait-pwa-v4';
const PRECACHE_URLS = [
  '/',
  '/events',
  '/people',
  '/chapters',
  '/achievements',
  '/publications',
  '/sigs',
  '/projects',
  '/opportunities',
  '/gallery',
  '/resources',
  '/join',
  '/contact',
  '/search',
  '/favicon.svg',
  '/favicon-dark.svg',
  '/ieee_mait_sb_light_mode_logo.png',
  '/ieee_mait_sb_dark_mode_logo.png',
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

// Fetch Event: Network-First strategy with Cache Fallback for public assets
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip browser extension requests
  if (!event.request.url.startsWith('http')) return;

  // Bypass admin portal, auth endpoints, and officer actions completely
  const url = new URL(event.request.url);
  if (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api/admin') ||
    url.pathname.startsWith('/api/auth')
  ) {
    return;
  }

  // Stale-While-Revalidate for public API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Network-First for HTML pages and UI assets
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Clone and store valid public responses in cache
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
          // Return generic offline home if route not in cache
          return caches.match('/');
        });
      })
  );
});
