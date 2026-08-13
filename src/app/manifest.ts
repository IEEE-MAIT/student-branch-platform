import type { MetadataRoute } from 'next';

/**
 * @file src/app/manifest.ts
 * @description Web App Manifest generator for IEEE MAIT Student Branch Progressive Web App (PWA).
 * 
 * SPECIFICATIONS:
 * - Standalone PWA experience for mobile and desktop devices.
 * - Theme color set to IEEE Brand Blue (`#00629B`).
 * - Enables home screen installation for students and branch members.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'IEEE MAIT Student Branch',
    short_name: 'IEEE MAIT',
    description: 'Official digital platform and mobile web application of IEEE MAIT Student Branch.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#00629B',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/favicon-dark.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
