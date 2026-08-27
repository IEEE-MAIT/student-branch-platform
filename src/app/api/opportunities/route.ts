import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const query = searchParams.get('q')?.trim();

    const whereClause: any = {
      deletedAt: null,
    };

    if (category && category !== 'ALL') {
      whereClause.category = { equals: category, mode: 'insensitive' };
    }

    if (status && status !== 'ALL') {
      whereClause.status = { equals: status, mode: 'insensitive' };
    }

    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { organisation: { contains: query, mode: 'insensitive' } },
        { eligibility: { contains: query, mode: 'insensitive' } },
      ];
    }

    const opportunities = await prisma.opportunity.findMany({
      where: whereClause,
      orderBy: [
        { featured: 'desc' },
        { deadlineDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(opportunities, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=300',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Database error' }, { status: 500 });
  }
}
