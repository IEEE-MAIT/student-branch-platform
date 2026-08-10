import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';

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
    const token = cookieStore.get('auth_token')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'Galleries', 'create')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const body: any = await req.json();
    const { title, slug, date, category, photoCount, imageCount, coverImage, description } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and Slug are required.' }, { status: 400 });
    }

    const item = await prisma.gallery.create({
      data: {
        title,
        slug,
        date: date || new Date().toISOString().split('T')[0],
        category: category || 'Events',
        imageCount: typeof imageCount === 'number' ? imageCount : (typeof photoCount === 'number' ? photoCount : 0),
        coverImage: coverImage || '',
        description,
      },
    });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'CREATE',
      entityType: 'GALLERY',
      entityTitle: title,
      changeSummary: `Created gallery album: ${title} (${slug})`,
    });

    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
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

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'DELETE',
      entityType: 'GALLERY',
      entityTitle: id,
      changeSummary: `Deleted gallery album ID: ${id}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
