import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizePlainText } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const list = await prisma.initiative.findMany({
      where: includeDeleted ? undefined : { deletedAt: null },
      include: { chapter: true },
    });
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Chapters', 'create');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (!body.title || !body.slug || !body.description) {
      return NextResponse.json({ error: 'Missing required fields: title, slug, description' }, { status: 400 });
    }

    const sanitizedTitle = sanitizePlainText(body.title, 200);
    const sanitizedSlug = sanitizePlainText(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const sanitizedDescription = sanitizePlainText(body.description, 3000);
    const sanitizedStatus = sanitizePlainText(body.status || 'Active', 50);
    const sanitizedTargetAudience = body.targetAudience ? sanitizePlainText(body.targetAudience, 150) : null;
    const sanitizedIconName = body.iconName ? sanitizePlainText(body.iconName, 50) : null;

    const newInitiative = await prisma.initiative.create({
      data: {
        title: sanitizedTitle,
        slug: sanitizedSlug,
        description: sanitizedDescription,
        status: sanitizedStatus,
        targetAudience: sanitizedTargetAudience,
        iconName: sanitizedIconName,
        chapterId: body.chapterId && body.chapterId.trim() ? body.chapterId.trim() : null,
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'CREATE',
      entityType: 'INITIATIVE',
      entityId: newInitiative.id,
      entityTitle: sanitizedTitle,
      changeSummary: `Created chapter initiative "${sanitizedTitle}"`,
    });

    return NextResponse.json(newInitiative, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Chapters', 'edit');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    if (!body || typeof body !== 'object' || !body.id) {
      return NextResponse.json({ error: 'Initiative ID and payload required' }, { status: 400 });
    }

    const safeTitle = body.title ? sanitizePlainText(body.title, 200) : undefined;
    const safeSlug = body.slug ? sanitizePlainText(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-') : undefined;
    const safeDescription = body.description !== undefined ? sanitizePlainText(body.description, 3000) : undefined;
    const safeStatus = body.status ? sanitizePlainText(body.status, 50) : undefined;
    const safeTarget = body.targetAudience !== undefined ? (body.targetAudience ? sanitizePlainText(body.targetAudience, 150) : null) : undefined;
    const safeIcon = body.iconName !== undefined ? (body.iconName ? sanitizePlainText(body.iconName, 50) : null) : undefined;

    const updated = await prisma.initiative.update({
      where: { id: body.id },
      data: {
        ...(safeTitle && { title: safeTitle }),
        ...(safeSlug && { slug: safeSlug }),
        ...(safeDescription !== undefined && { description: safeDescription }),
        ...(safeStatus && { status: safeStatus }),
        ...(safeTarget !== undefined && { targetAudience: safeTarget }),
        ...(safeIcon !== undefined && { iconName: safeIcon }),
        chapterId: body.chapterId !== undefined ? (body.chapterId && body.chapterId.trim() ? body.chapterId.trim() : null) : undefined,
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'UPDATE',
      entityType: 'INITIATIVE',
      entityId: body.id,
      entityTitle: updated.title,
      changeSummary: `Updated chapter initiative: "${updated.title}"`,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Chapters', 'delete');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'Initiative ID is required.' }, { status: 400 });
    }

    const existing = await prisma.initiative.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Initiative not found.' }, { status: 404 });
    }

    if (permanent) {
      await prisma.initiative.delete({ where: { id } });
      await recordAuditLog({
        performedBy: user.name || user.email,
        userEmail: user.email,
        actionType: 'DELETE',
        entityType: 'INITIATIVE',
        entityId: id,
        entityTitle: existing.title,
        changeSummary: `Permanently deleted initiative: ${existing.title} (ID: ${id})`,
      });
    } else {
      await prisma.initiative.update({
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
        entityType: 'INITIATIVE',
        entityId: id,
        entityTitle: existing.title,
        changeSummary: `Moved initiative to Recycle Bin: ${existing.title} (ID: ${id})`,
      });
    }

    return NextResponse.json({ success: true, softDeleted: !permanent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
