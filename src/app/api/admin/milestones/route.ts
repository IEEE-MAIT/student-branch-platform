import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const list = await prisma.milestone.findMany({ orderBy: { sortOrder: 'desc' } });
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ieee_mait_session')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'Milestones', 'create')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const body = await req.json();
    const { year, title, description, category, sortOrder } = body;

    if (!year || !title) {
      return NextResponse.json({ error: 'Year and Title are required.' }, { status: 400 });
    }

    const item = await prisma.milestone.create({
      data: {
        year,
        title,
        description,
        category: category || 'Establishment',
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          timestamp: new Date().toISOString(),
          officerName: payload.name,
          officerEmail: payload.email,
          action: 'CREATE_MILESTONE',
          details: `Added milestone: ${title} (${year})`,
        },
      });
    } catch (e) {}

    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ieee_mait_session')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'Milestones', 'delete')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Milestone ID is required.' }, { status: 400 });
    }

    await prisma.milestone.delete({ where: { id } });

    try {
      await prisma.auditLog.create({
        data: {
          timestamp: new Date().toISOString(),
          officerName: payload.name,
          officerEmail: payload.email,
          action: 'DELETE_MILESTONE',
          details: `Deleted milestone ID: ${id}`,
        },
      });
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
