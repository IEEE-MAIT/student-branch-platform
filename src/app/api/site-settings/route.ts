import { NextResponse } from 'next/server';
import { sanitizeText, validateSafeUrl } from '@/lib/security';

let dynamicSiteSettings = {
  announcementMessage: 'Membership Drive 2025–26 is officially open! Join 150+ students advancing technology at MAIT.',
  announcementLinkText: 'Register Now →',
  announcementLinkHref: '/join',
  announcementActive: true,
};

/**
 * GET /api/site-settings
 */
export async function GET() {
  return NextResponse.json(dynamicSiteSettings, {
    headers: {
      'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=120',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

/**
 * POST /api/site-settings
 * Hardened REST endpoint for updating site-wide announcement banner text & settings.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (typeof body.announcementMessage === 'string') {
      dynamicSiteSettings.announcementMessage = sanitizeText(body.announcementMessage, 250);
    }
    if (typeof body.announcementLinkText === 'string') {
      dynamicSiteSettings.announcementLinkText = sanitizeText(body.announcementLinkText, 50);
    }
    if (typeof body.announcementLinkHref === 'string') {
      const safeUrl = validateSafeUrl(body.announcementLinkHref);
      if (safeUrl) {
        dynamicSiteSettings.announcementLinkHref = safeUrl;
      }
    }
    if (typeof body.announcementActive === 'boolean') {
      dynamicSiteSettings.announcementActive = body.announcementActive;
    }

    return NextResponse.json({ success: true, settings: dynamicSiteSettings });
  } catch {
    return NextResponse.json({ error: 'Malformed request JSON' }, { status: 400 });
  }
}
