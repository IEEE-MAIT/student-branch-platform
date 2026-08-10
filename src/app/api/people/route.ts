import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year') || searchParams.get('academicYear');

    const people = await prisma.person.findMany({
      orderBy: { hierarchy: 'asc' },
      include: { memberships: { include: { academicYear: true } } }
    });

    if (!year) {
      return NextResponse.json(people);
    }

    const normalizedYear = year.replace('–', '-');
    const filtered = people.filter((p: any) => {
      if (p.academicYear) {
        const pYear = p.academicYear.replace('–', '-');
        if (pYear === normalizedYear || p.academicYear === year) return true;
      }
      if (Array.isArray(p.memberships) && p.memberships.length > 0) {
        return p.memberships.some((m: any) => {
          if (m.academicYear?.label) {
            const mYear = m.academicYear.label.replace('–', '-');
            return mYear === normalizedYear || m.academicYear.label === year;
          }
          return false;
        });
      }
      return false;
    });

    return NextResponse.json(filtered);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
