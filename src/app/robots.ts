import type { MetadataRoute } from 'next';

/**
 * @file src/app/robots.ts
 * @description Dynamic robots.txt configuration generator for IEEE MAIT Student Branch platform.
 * 
 * Directs search engine crawlers to publicly indexed routes and disallows sensitive admin,
 * authentication, and API endpoints while referencing the dynamic XML sitemap.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ieeemait.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/admin',
          '/api/admin/',
          '/api/auth',
          '/api/auth/',
          '/_next/',
          '/private/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
