import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const list = await prisma.resource.findMany();
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

    if (!payload || !hasPermission(payload.role, 'Resources', 'create')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const body = await req.json();
    const { title, type, publishedDate, description, fileUrl, status } = body;

    if (!title || !type) {
      return NextResponse.json({ error: 'Title and Type are required.' }, { status: 400 });
    }

    const item = await prisma.resource.create({
      data: {
        title,
        type,
        publishedDate: publishedDate || new Date().toISOString().split('T')[0],
        description,
        fileUrl,
        status: status || 'published',
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          timestamp: new Date().toISOString(),
          officerName: payload.name,
          officerEmail: payload.email,
          action: 'CREATE_RESOURCE',
          details: `Added resource: ${title} (${type})`,
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

    if (!payload || !hasPermission(payload.role, 'Resources', 'delete')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Resource ID is required.' }, { status: 400 });
    }

    await prisma.resource.delete({ where: { id } });

    try {
      await prisma.auditLog.create({
        data: {
          timestamp: new Date().toISOString(),
          officerName: payload.name,
          officerEmail: payload.email,
          action: 'DELETE_RESOURCE',
          details: `Deleted resource ID: ${id}`,
        },
      });
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
