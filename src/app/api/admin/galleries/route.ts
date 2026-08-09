import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const list = await prisma.gallery.findMany({
      include: { photos: true },
      orderBy: { date: 'desc' },
    });
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

    if (!payload || !hasPermission(payload.role, 'Galleries', 'create')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const body = await req.json();
    const { title, slug, date, category, photoCount, coverImage, description } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and Slug are required.' }, { status: 400 });
    }

    const item = await prisma.gallery.create({
      data: {
        title,
        slug,
        date: date || new Date().toISOString().split('T')[0],
        category: category || 'Events',
        photoCount: typeof photoCount === 'number' ? photoCount : 0,
        coverImage,
        description,
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          timestamp: new Date().toISOString(),
          officerName: payload.name,
          officerEmail: payload.email,
          action: 'CREATE_GALLERY',
          details: `Created gallery album: ${title} (${slug})`,
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

    if (!payload || !hasPermission(payload.role, 'Galleries', 'delete')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Gallery ID is required.' }, { status: 400 });
    }

    await prisma.gallery.delete({ where: { id } });

    try {
      await prisma.auditLog.create({
        data: {
          timestamp: new Date().toISOString(),
          officerName: payload.name,
          officerEmail: payload.email,
          action: 'DELETE_GALLERY',
          details: `Deleted gallery album ID: ${id}`,
        },
      });
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
