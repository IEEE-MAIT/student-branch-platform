import { NextResponse } from 'next/server';
import { EVENTS_DATA } from '@/lib/data';
import { sanitizeText, validateSafeUrl } from '@/lib/security';
import { recordAuditLog } from '@/lib/auditLog';

let dynamicEventsStore = [...EVENTS_DATA];

export async function GET() {
  return NextResponse.json(dynamicEventsStore, {
    headers: {
      'Cache-Control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=300',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

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
    const sanitizedRegistrationLink = body.registrationLink ? validateSafeUrl(body.registrationLink) : undefined;
    const performedBy = sanitizeText(body.performedBy || 'mait.ieee.sb@gmail.com', 100);

    const newEvent = {
      id: `evt-${Date.now()}`,
      title: sanitizedTitle,
      slug: sanitizedSlug,
      date: sanitizedDate,
      venue: sanitizedVenue,
      unit: sanitizeText(body.unit || 'IEEE MAIT SB', 50) as any,
      unitSlug: sanitizeText(body.unitSlug || 'sb', 20) as any,
      category: sanitizeText(body.category || 'Technical Workshop', 50) as any,
      status: sanitizeText(body.status || 'upcoming', 20) as any,
      description: sanitizedDescription,
      registrationLink: sanitizedRegistrationLink || undefined,
    };

    dynamicEventsStore.unshift(newEvent);

    // Record Audit Log (Who, When, What)
    recordAuditLog({
      performedBy,
      actionType: 'CREATE',
      entityType: 'Event',
      entityTitle: sanitizedTitle,
      changeSummary: `Created event "${sanitizedTitle}" scheduled for ${sanitizedDate} at ${sanitizedVenue}.`,
    });

    return NextResponse.json({ success: true, event: newEvent }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Malformed request JSON' }, { status: 400 });
  }
}
