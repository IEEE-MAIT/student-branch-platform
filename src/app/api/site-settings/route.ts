import { NextResponse } from 'next/server';
import { sanitizeText, validateSafeUrl } from '@/lib/security';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { hasPermission } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findUnique({ where: { id: 'global' } });
    if (settings) {
      return NextResponse.json(settings, {
        headers: {
          'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=120',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }
    return NextResponse.json({}, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ieee_mait_session')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'Settings', 'edit')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const performedBy = payload.name || payload.email;

    const body: any = await request.json();
    let updates: any = {};

    if (typeof body.announcementMessage === 'string') {
      updates.announcementMessage = sanitizeText(body.announcementMessage, 250);
    }
    if (typeof body.announcementLinkText === 'string') {
      updates.announcementLinkText = sanitizeText(body.announcementLinkText, 50);
    }
    if (typeof body.announcementLinkHref === 'string') {
      const safeUrl = validateSafeUrl(body.announcementLinkHref);
      if (safeUrl) {
        updates.announcementLinkHref = safeUrl;
      }
    }
    if (typeof body.announcementActive === 'boolean') {
      updates.announcementActive = body.announcementActive;
    }

    if (Object.keys(updates).length > 0) {
      await prisma.siteSetting.upsert({
        where: { id: 'global' },
        update: updates,
        create: {
          id: 'global',
          ...updates
        }
      });

      await recordAuditLog({
        performedBy,
        actionType: 'UPDATE',
        entityType: 'Site Settings',
        entityTitle: 'Recruitment Announcement Banner',
        changeSummary: 'Updated site announcement banner settings via API.',
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Database mutation failed' }, { status: 500 });
  }
}
