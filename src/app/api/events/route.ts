import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { deletedAt: null },
      orderBy: { date: 'desc' },
      include: {
        story: true,
        gallery: { include: { photos: { where: { deletedAt: null } } } },
        chapter: true,
        resources: { where: { deletedAt: null, isPublic: true } },
      },
    });
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
