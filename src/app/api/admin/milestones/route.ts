import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizePlainText } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const list = await prisma.milestone.findMany({
      where: includeDeleted ? undefined : { deletedAt: null },
      orderBy: { sortOrder: 'desc' },
      include: { sourceEvent: true },
    });
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Milestones', 'create');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    const { year, title, description, category, sortOrder, sourceEventId } = body;

    if (!year || !title) {
      return NextResponse.json({ error: 'Year and Title are required.' }, { status: 400 });
    }

    const safeYear = sanitizePlainText(year, 20);
    const safeTitle = sanitizePlainText(title, 200);
    const safeDescription = description ? sanitizePlainText(description, 2000) : null;
    const safeCategory = category ? sanitizePlainText(category, 50) : 'Milestone';

    const item = await prisma.milestone.create({
      data: {
        year: safeYear,
        title: safeTitle,
        description: safeDescription,
        category: safeCategory,
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
        sourceEventId: sourceEventId && sourceEventId.trim() ? sourceEventId.trim() : null,
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'CREATE',
      entityType: 'MILESTONE',
      entityId: item.id,
      entityTitle: safeTitle,
      changeSummary: `Added milestone: ${safeTitle} (${safeYear})`,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Milestones', 'edit');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    const { id, year, title, description, category, sortOrder, sourceEventId } = body;

    if (!id) {
      return NextResponse.json({ error: 'Milestone ID is required.' }, { status: 400 });
    }

    const safeYear = year ? sanitizePlainText(year, 20) : undefined;
    const safeTitle = title ? sanitizePlainText(title, 200) : undefined;
    const safeDescription = description !== undefined ? (description ? sanitizePlainText(description, 2000) : null) : undefined;
    const safeCategory = category !== undefined ? (category ? sanitizePlainText(category, 50) : 'Milestone') : undefined;
    const sort = typeof sortOrder === 'number' ? sortOrder : undefined;

    const updated = await prisma.milestone.update({
      where: { id },
      data: {
        ...(safeYear && { year: safeYear }),
        ...(safeTitle && { title: safeTitle }),
        ...(safeDescription !== undefined && { description: safeDescription }),
        ...(safeCategory !== undefined && { category: safeCategory }),
        ...(sort !== undefined && { sortOrder: sort }),
        ...(sourceEventId !== undefined && { sourceEventId: sourceEventId && sourceEventId.trim() ? sourceEventId.trim() : null }),
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'UPDATE',
      entityType: 'MILESTONE',
      entityId: id,
      entityTitle: updated.title,
      changeSummary: `Updated milestone: ${updated.title}`,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Milestones', 'delete');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'Milestone ID is required.' }, { status: 400 });
    }

    const existing = await prisma.milestone.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Milestone not found.' }, { status: 404 });
    }

    if (permanent) {
      await prisma.milestone.delete({ where: { id } });
      await recordAuditLog({
        performedBy: user.name || user.email,
        userEmail: user.email,
        actionType: 'DELETE',
        entityType: 'MILESTONE',
        entityId: id,
        entityTitle: existing.title,
        changeSummary: `Permanently deleted milestone: ${existing.title} (ID: ${id})`,
      });
    } else {
      await prisma.milestone.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletedBy: user.name || user.email,
        },
      });
      await recordAuditLog({
        performedBy: user.name || user.email,
        userEmail: user.email,
        actionType: 'DELETE',
        entityType: 'MILESTONE',
        entityId: id,
        entityTitle: existing.title,
        changeSummary: `Moved milestone to Recycle Bin: ${existing.title} (ID: ${id})`,
      });
    }

    return NextResponse.json({ success: true, softDeleted: !permanent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
