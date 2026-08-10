import { NextResponse } from 'next/server';
import { sanitizeText } from '@/lib/security';
import { recordAuditLog } from '@/lib/auditLog';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({ orderBy: { year: 'desc' } });
    return NextResponse.json(achievements, {
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

    if (!body.title || typeof body.title !== 'string' || !body.year || typeof body.year !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid title or year' }, { status: 400 });
    }

    const sanitizedTitle = sanitizeText(body.title, 200);
    const sanitizedYear = sanitizeText(body.year, 10);
    const sanitizedConferredBy = sanitizeText(body.conferredBy || 'IEEE', 150);
    const performedBy = sanitizeText(body.performedBy || 'mait.ieee.sb@gmail.com', 100);

    const newAchievement = await prisma.achievement.create({
      data: {
        year: sanitizedYear,
        title: sanitizedTitle,
        conferredBy: sanitizedConferredBy,
        unitOrTeam: sanitizeText(body.unitOrTeam || 'IEEE MAIT SB', 100),
        category: sanitizeText(body.category || 'IEEE Recognition', 50),
        description: sanitizeText(body.description || '', 1000),
      }
    });

    await recordAuditLog({
      performedBy,
      actionType: 'CREATE',
      entityType: 'Achievement',
      entityTitle: sanitizedTitle,
      changeSummary: `Recorded achievement "${sanitizedTitle}" (${sanitizedYear}) conferred by ${sanitizedConferredBy}.`,
    });

    return NextResponse.json({ success: true, achievement: { id: newAchievement.id, title: newAchievement.title } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Database mutation failed' }, { status: 500 });
  }
}
