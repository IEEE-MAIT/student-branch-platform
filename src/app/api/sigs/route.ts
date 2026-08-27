import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const sig = await prisma.sIG.findFirst({
        where: { slug, deletedAt: null },
        include: {
          lead: true,
          projects: { where: { deletedAt: null } },
          events: { where: { deletedAt: null } },
          memberships: {
            where: { isCurrent: true },
            include: { person: true },
          },
        },
      });

      if (!sig) {
        return NextResponse.json({ error: 'SIG not found' }, { status: 404 });
      }

      return NextResponse.json(sig, {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=300',
        },
      });
    }

    const sigs = await prisma.sIG.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'asc' },
      include: {
        lead: true,
        projects: { where: { deletedAt: null } },
        events: { where: { deletedAt: null } },
        _count: {
          select: { projects: true, events: true, memberships: true },
        },
      },
    });

    return NextResponse.json(sigs, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=300',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Database error' }, { status: 500 });
  }
}
