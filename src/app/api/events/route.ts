import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status')?.toLowerCase();
    const unit = searchParams.get('unit')?.toLowerCase();
    const eventType = searchParams.get('eventType');
    const query = searchParams.get('q')?.trim();
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

    // Construct Prisma where query
    const whereClause: any = {
      deletedAt: null,
    };

    if (status) {
      if (status === 'upcoming') {
        whereClause.status = 'upcoming';
      } else if (status === 'ongoing') {
        whereClause.OR = [{ status: 'ongoing' }, { isLive: true }];
      } else if (status === 'past') {
        whereClause.status = { not: 'upcoming' };
      }
    }

    if (unit && unit !== 'all') {
      whereClause.unitSlug = unit;
    }

    if (eventType) {
      if (eventType.toLowerCase() === 'flagship') {
        whereClause.OR = [
          { eventType: 'Flagship' },
          { category: { contains: 'Flagship', mode: 'insensitive' } },
        ];
      } else {
        whereClause.eventType = eventType;
      }
    }

    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { venue: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ];
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      take: limit && !isNaN(limit) ? limit : undefined,
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Database error' }, { status: 500 });
  }
}
