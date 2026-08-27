import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizePlainText, validateSafeUrl } from '@/lib/security';

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
        donateUrl: 'https://www.ieee.org/membership/join/index.html',
        recycleBinRetentionDays: 30,
      });
    }
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Settings', 'edit');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    const {
      announcementMessage,
      announcementLinkText,
      announcementLinkHref,
      announcementActive,
      donateUrl,
      recycleBinRetentionDays,
    } = body;

    const safeMessage = announcementMessage ? sanitizePlainText(announcementMessage, 500) : null;
    const safeLinkText = announcementLinkText ? sanitizePlainText(announcementLinkText, 100) : null;
    const safeLinkHref = announcementLinkHref ? validateSafeUrl(announcementLinkHref) : null;
    const safeDonateUrl = donateUrl ? validateSafeUrl(donateUrl) : undefined;
    const safeRetention = typeof recycleBinRetentionDays === 'number' ? Math.max(1, Math.min(365, recycleBinRetentionDays)) : 30;

    const updated = await prisma.siteSetting.upsert({
      where: { id: 'global' },
      update: {
        announcementMessage: safeMessage,
        announcementLinkText: safeLinkText,
        announcementLinkHref: safeLinkHref,
        announcementActive: announcementActive !== undefined ? Boolean(announcementActive) : undefined,
        ...(safeDonateUrl !== undefined ? { donateUrl: safeDonateUrl } : {}),
        recycleBinRetentionDays: safeRetention,
      },
      create: {
        id: 'global',
        announcementMessage: safeMessage,
        announcementLinkText: safeLinkText,
        announcementLinkHref: safeLinkHref,
        announcementActive: Boolean(announcementActive),
        donateUrl: safeDonateUrl || 'https://www.ieee.org/membership/join/index.html',
        recycleBinRetentionDays: safeRetention,
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'UPDATE',
      entityType: 'SITE_SETTINGS',
      entityId: 'global',
      entityTitle: 'Global Site Settings',
      changeSummary: `Updated global site settings. Banner Active: ${announcementActive}, Donate URL: ${safeDonateUrl || 'default'}, Retention: ${safeRetention}d`,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
