'use client';

/**
 * @file src/components/layout/ServiceWorkerRegister.tsx
 * @description Registers PWA Service Worker on client mount and displays an offline status indicator.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

import React, { useEffect, useState } from 'react';

/**
 * Client component managing PWA Service Worker lifecycle and network connection alerts.
 */
export const ServiceWorkerRegister: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Register Service Worker in browser
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[IEEE MAIT PWA] Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('[IEEE MAIT PWA] Service Worker registration failed:', err);
        });
    }

    // Monitor network status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      className="bg-amber-600 text-white px-4 py-1.5 text-xs font-mono text-center flex items-center justify-center gap-2 border-b border-amber-700"
      role="status"
      aria-live="polite"
    >
      <span>⚡ Offline Mode: Displaying cached IEEE MAIT platform content.</span>
    </div>
  );
};
