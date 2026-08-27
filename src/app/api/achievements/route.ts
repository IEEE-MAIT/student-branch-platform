import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      where: { deletedAt: null },
      orderBy: { year: 'desc' },
      include: {
        people: { include: { person: true } },
        tags: true,
        chapter: true,
        event: true,
      },
    });
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
