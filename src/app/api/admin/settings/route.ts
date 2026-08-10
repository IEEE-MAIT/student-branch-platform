import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findUnique({ where: { id: 'global' } });
    if (!settings) {
      return NextResponse.json({
        id: 'global',
        announcementMessage: '',
        announcementLinkText: '',
        announcementLinkHref: '',
        announcementActive: false,
      });
    }
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const body: any = await req.json();
    const { announcementMessage, announcementLinkText, announcementLinkHref, announcementActive } = body;

    const updated = await prisma.siteSetting.upsert({
      where: { id: 'global' },
      update: {
        announcementMessage,
        announcementLinkText,
        announcementLinkHref,
        announcementActive,
      },
      create: {
        id: 'global',
        announcementMessage,
        announcementLinkText,
        announcementLinkHref,
        announcementActive,
      },
    });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'UPDATE',
      entityType: 'SITE_SETTINGS',
      entityTitle: 'Global Banner Settings',
      changeSummary: `Updated site announcement banner settings. Active: ${announcementActive}`,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
