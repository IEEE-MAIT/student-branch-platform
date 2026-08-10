import { NextResponse } from 'next/server';
import { sanitizeText, validateSafeUrl } from '@/lib/security';
import { recordAuditLog } from '@/lib/auditLog';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const events = await prisma.event.findMany({ orderBy: { date: 'desc' } });
    return NextResponse.json(events, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=300',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: any = await request.json();

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
    const performedBy = sanitizeText(body.performedBy || 'mait.ieee.sb@gmail.com', 100);

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

    // Record Audit Log
    await recordAuditLog({
      performedBy,
      actionType: 'CREATE',
      entityType: 'Event',
      entityTitle: sanitizedTitle,
      changeSummary: `Created event "${sanitizedTitle}" scheduled for ${sanitizedDate} at ${sanitizedVenue}.`,
    });

    return NextResponse.json({ success: true, event: { id: newEvent.id, title: newEvent.title } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Database mutation failed' }, { status: 500 });
  }
}
