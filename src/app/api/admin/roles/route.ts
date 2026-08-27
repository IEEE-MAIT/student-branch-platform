import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizePlainText } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const list = await prisma.role.findMany({ orderBy: { hierarchy: 'asc' } });
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Positions', 'create');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (!body.title || typeof body.title !== 'string' || !body.category || typeof body.category !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid title or category' }, { status: 400 });
    }

    const sanitizedTitle = sanitizePlainText(body.title, 100);
    const sanitizedCategory = sanitizePlainText(body.category, 50);
    const hierarchy = typeof body.hierarchy === 'number' ? body.hierarchy : 10;
    const isActive = typeof body.isActive === 'boolean' ? body.isActive : true;

    const newRole = await prisma.role.create({
      data: {
        title: sanitizedTitle,
        category: sanitizedCategory,
        hierarchy,
        isActive,
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'CREATE',
      entityType: 'POSITION',
      entityId: newRole.id,
      entityTitle: sanitizedTitle,
      changeSummary: `Created organizational position: ${sanitizedTitle} (Category: ${sanitizedCategory})`,
    });

    return NextResponse.json(newRole, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Positions', 'edit');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    if (!body?.id || !body?.title) {
      return NextResponse.json({ error: 'Position ID and title are required.' }, { status: 400 });
    }

    const sanitizedTitle = sanitizePlainText(body.title, 100);
    const sanitizedCategory = body.category ? sanitizePlainText(body.category, 50) : undefined;
    const hierarchy = typeof body.hierarchy === 'number' ? body.hierarchy : undefined;
    const isActive = typeof body.isActive === 'boolean' ? body.isActive : undefined;

    const updatedRole = await prisma.role.update({
      where: { id: body.id },
      data: {
        title: sanitizedTitle,
        category: sanitizedCategory,
        hierarchy,
        isActive,
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'UPDATE',
      entityType: 'POSITION',
      entityId: body.id,
      entityTitle: sanitizedTitle,
      changeSummary: `Updated organizational position: ${sanitizedTitle}`,
    });

    return NextResponse.json(updatedRole);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Positions', 'delete');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Position ID is required.' }, { status: 400 });
    }

    const existing = await prisma.role.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Position not found.' }, { status: 404 });
    }

    await prisma.role.delete({ where: { id } });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'DELETE',
      entityType: 'POSITION',
      entityId: id,
      entityTitle: existing.title,
      changeSummary: `Deleted organizational position: ${existing.title} (ID: ${id})`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
