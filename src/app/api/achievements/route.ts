import { NextResponse } from 'next/server';
import { ACHIEVEMENTS_DATA } from '@/lib/data';
import { sanitizeText } from '@/lib/security';
import { recordAuditLog } from '@/lib/auditLog';

let dynamicAchievementsStore = [...ACHIEVEMENTS_DATA];

export async function GET() {
  return NextResponse.json(dynamicAchievementsStore, {
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

    if (!body.title || typeof body.title !== 'string' || !body.year || typeof body.year !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid title or year' }, { status: 400 });
    }

    const sanitizedTitle = sanitizeText(body.title, 200);
    const sanitizedYear = sanitizeText(body.year, 10);
    const sanitizedConferredBy = sanitizeText(body.conferredBy || 'IEEE', 150);
    const performedBy = sanitizeText(body.performedBy || 'mait.ieee.sb@gmail.com', 100);

    const newItem = {
      id: `ach-${Date.now()}`,
      year: sanitizedYear,
      title: sanitizedTitle,
      conferredBy: sanitizedConferredBy,
      unitOrTeam: sanitizeText(body.unitOrTeam || 'IEEE MAIT SB', 100),
      category: sanitizeText(body.category || 'IEEE Recognition', 50) as any,
      description: sanitizeText(body.description || '', 1000),
    };

    dynamicAchievementsStore.unshift(newItem);

    // Record Audit Log (Who, When, What)
    recordAuditLog({
      performedBy,
      actionType: 'CREATE',
      entityType: 'Achievement',
      entityTitle: sanitizedTitle,
      changeSummary: `Recorded achievement "${sanitizedTitle}" (${sanitizedYear}) conferred by ${sanitizedConferredBy}.`,
    });

    return NextResponse.json({ success: true, achievement: newItem }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Malformed request JSON' }, { status: 400 });
  }
}
