import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      where: { deletedAt: null },
      orderBy: { date: 'desc' },
      include: { chapter: true, authorPerson: true },
    });
    return NextResponse.json(stories, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=300',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
