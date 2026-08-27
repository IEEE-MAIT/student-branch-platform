import type { MetadataRoute } from 'next';

/**
 * @file src/app/manifest.ts
 * @description Web App Manifest generator for IEEE MAIT Student Branch Progressive Web App (PWA).
 * 
 * SPECIFICATIONS:
 * - Standalone PWA experience for mobile and desktop devices.
 * - Theme color set to IEEE Brand Blue (`#00629B`).
 * - Shortcuts for Events, Publications, SIGs, Projects, Opportunities, and Search.
 * - Enables home screen installation with offline caching.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'IEEE MAIT Student Branch',
    short_name: 'IEEE MAIT',
    description: 'Official digital platform and mobile web application of IEEE MAIT Student Branch at Maharaja Agrasen Institute of Technology, Delhi.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#00629B',
    orientation: 'portrait-primary',
    categories: ['education', 'engineering', 'technology', 'students'],
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
      {
        src: '/ieee_mait_sb_light_mode_logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Events & Workshops',
        short_name: 'Events',
        description: 'Explore upcoming technical sessions and hackathons',
        url: '/events',
        icons: [{ src: '/favicon.svg', sizes: 'any' }],
      },
      {
        name: 'Publications & Tech Tuesday',
        short_name: 'Digest',
        description: 'Read weekly technical publications and newsletters',
        url: '/publications',
        icons: [{ src: '/favicon.svg', sizes: 'any' }],
      },
      {
        name: 'Special Interest Groups',
        short_name: 'SIGs',
        description: 'DSA, Web Dev, AI/ML & Hardware technical circles',
        url: '/sigs',
        icons: [{ src: '/favicon.svg', sizes: 'any' }],
      },
      {
        name: 'Technical Projects Hub',
        short_name: 'Projects',
        description: 'Explore student-engineered hardware & software builds',
        url: '/projects',
        icons: [{ src: '/favicon.svg', sizes: 'any' }],
      },
      {
        name: 'Opportunities & Grants',
        short_name: 'Opportunities',
        description: 'Scholarships, fellowships, and travel grants',
        url: '/opportunities',
        icons: [{ src: '/favicon.svg', sizes: 'any' }],
      },
      {
        name: 'Omni Search',
        short_name: 'Search',
        description: 'Search events, achievements, and leadership records',
        url: '/search',
        icons: [{ src: '/favicon.svg', sizes: 'any' }],
      },
    ],
  };
}
