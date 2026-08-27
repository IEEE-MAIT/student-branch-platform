import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const unit = searchParams.get('unit')?.toLowerCase();
    const tag = searchParams.get('tag');
    const query = searchParams.get('q')?.trim();
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

    const whereClause: any = {
      deletedAt: null,
    };

    if (status && status !== 'ALL') {
      whereClause.status = { equals: status, mode: 'insensitive' };
    }

    if (unit && unit !== 'all') {
      whereClause.chapter = {
        slug: unit,
      };
    }

    if (tag) {
      whereClause.tags = {
        has: tag,
      };
    }

    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { summary: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
      ];
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit && !isNaN(limit) ? limit : undefined,
      include: {
        chapter: true,
        sig: true,
      },
    });

    return NextResponse.json(projects, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=300',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Database error' }, { status: 500 });
  }
}
