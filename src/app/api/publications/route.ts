import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || searchParams.get('category');
    const unit = searchParams.get('unit')?.toLowerCase();
    const query = searchParams.get('q')?.trim();
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

    const whereClause: any = {
      deletedAt: null,
    };

    if (type && type !== 'ALL') {
      whereClause.OR = [
        { type: { equals: type, mode: 'insensitive' } },
        { category: { equals: type, mode: 'insensitive' } },
      ];
    }

    if (unit && unit !== 'all') {
      whereClause.chapter = {
        slug: unit,
      };
    }

    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
        { author: { contains: query, mode: 'insensitive' } },
        { contentHtml: { contains: query, mode: 'insensitive' } },
      ];
    }

    const publications = await prisma.story.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      take: limit && !isNaN(limit) ? limit : undefined,
      include: {
        chapter: true,
        event: true,
      },
    });

    return NextResponse.json(publications, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=300',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Database error' }, { status: 500 });
  }
}
