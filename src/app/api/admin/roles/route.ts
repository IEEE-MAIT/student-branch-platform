import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizeText } from '@/lib/security';

export async function GET() {
  try {
    const list = await prisma.role.findMany({ orderBy: { hierarchy: 'asc' } });
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

    if (!body.title || typeof body.title !== 'string' || !body.category || typeof body.category !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid title or category' }, { status: 400 });
    }

    const sanitizedTitle = sanitizeText(body.title, 100);
    const sanitizedCategory = sanitizeText(body.category, 50);
    const hierarchy = typeof body.hierarchy === 'number' ? body.hierarchy : 1;
    const isActive = typeof body.isActive === 'boolean' ? body.isActive : true;

    const newRole = await prisma.role.create({
      data: {
        title: sanitizedTitle,
        category: sanitizedCategory,
        hierarchy,
        isActive,
      }
    });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'CREATE',
      entityType: 'ROLE',
      entityTitle: sanitizedTitle,
      changeSummary: `Created role: ${sanitizedTitle} (Category: ${sanitizedCategory})`,
    });

    return NextResponse.json(newRole, { status: 201 });
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
      return NextResponse.json({ error: 'Role ID is required.' }, { status: 400 });
    }

    await prisma.role.delete({ where: { id } });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'DELETE',
      entityType: 'ROLE',
      entityTitle: id,
      changeSummary: `Deleted role ID: ${id}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
