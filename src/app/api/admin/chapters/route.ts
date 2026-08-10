import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizeText } from '@/lib/security';

export async function GET() {
  try {
    const list = await prisma.chapter.findMany({ orderBy: { name: 'asc' } });
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

    if (!payload || !hasPermission(payload.role, 'Settings', 'create')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const body: any = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (!body.name || typeof body.name !== 'string' || !body.slug || typeof body.slug !== 'string' || !body.type || typeof body.type !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid name, slug, or type' }, { status: 400 });
    }

    const sanitizedName = sanitizeText(body.name, 100);
    const sanitizedSlug = sanitizeText(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const sanitizedType = sanitizeText(body.type, 50);
    
    const newChapter = await prisma.chapter.create({
      data: {
        name: sanitizedName,
        slug: sanitizedSlug,
        type: sanitizedType,
        parentSociety: body.parentSociety ? sanitizeText(body.parentSociety, 100) : null,
        establishedYear: body.establishedYear ? sanitizeText(body.establishedYear, 10) : null,
        description: body.description ? sanitizeText(body.description, 1000) : null,
        mission: body.mission ? sanitizeText(body.mission, 1000) : null,
        leaderName: body.leaderName ? sanitizeText(body.leaderName, 100) : null,
        leaderRole: body.leaderRole ? sanitizeText(body.leaderRole, 100) : null,
      }
    });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'CREATE',
      entityType: 'CHAPTER',
      entityTitle: sanitizedName,
      changeSummary: `Created organizational unit: ${sanitizedName} (${sanitizedType})`,
    });

    return NextResponse.json(newChapter, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ieee_mait_session')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'Settings', 'delete')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Chapter ID is required.' }, { status: 400 });
    }

    await prisma.chapter.delete({ where: { id } });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'DELETE',
      entityType: 'CHAPTER',
      entityTitle: id,
      changeSummary: `Deleted chapter ID: ${id}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
