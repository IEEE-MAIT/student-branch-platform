import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizeText, validateSafeUrl } from '@/lib/security';

export async function GET() {
  try {
    const list = await prisma.event.findMany({ orderBy: { date: 'desc' } });
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ieee_mait_session')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'Events', 'create')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const body: any = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (!body.title || typeof body.title !== 'string' || !body.slug || typeof body.slug !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid title or slug' }, { status: 400 });
    }

    const sanitizedTitle = sanitizeText(body.title, 200);
    const sanitizedSlug = sanitizeText(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const sanitizedDate = sanitizeText(body.date || 'OCT 2026', 50);
    const sanitizedVenue = sanitizeText(body.venue || 'MAIT Campus', 100);
    const sanitizedDescription = sanitizeText(body.description || '', 2000);
    const sanitizedRegistrationLink = body.registrationLink ? validateSafeUrl(body.registrationLink) : null;
    const performedBy = payload.name || payload.email;

    const newEvent = await prisma.event.create({
      data: {
        title: sanitizedTitle,
        slug: sanitizedSlug,
        date: sanitizedDate,
        venue: sanitizedVenue,
        unit: sanitizeText(body.unit || 'IEEE MAIT SB', 50),
        unitSlug: sanitizeText(body.unitSlug || 'sb', 20),
        category: sanitizeText(body.category || 'Technical Workshop', 50),
        status: sanitizeText(body.status || 'upcoming', 20),
        description: sanitizedDescription,
        registrationLink: sanitizedRegistrationLink,
      }
    });

    await recordAuditLog({
      performedBy,
      actionType: 'CREATE',
      entityType: 'EVENT',
      entityTitle: sanitizedTitle,
      changeSummary: `Created event "${sanitizedTitle}" scheduled for ${sanitizedDate} at ${sanitizedVenue}.`,
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ieee_mait_session')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'Events', 'delete')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required.' }, { status: 400 });
    }

    await prisma.event.delete({ where: { id } });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'DELETE',
      entityType: 'EVENT',
      entityTitle: id,
      changeSummary: `Deleted event ID: ${id}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
