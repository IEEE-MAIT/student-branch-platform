import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizePlainText, validateSafeUrl } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const list = await prisma.resource.findMany({
      where: includeDeleted ? undefined : { deletedAt: null },
      orderBy: { publishedDate: 'desc' },
    });
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Resources', 'create');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    const { title, type, publishedDate, description, fileUrl, status } = body;

    if (!title || !type) {
      return NextResponse.json({ error: 'Title and Type are required.' }, { status: 400 });
    }

    const safeTitle = sanitizePlainText(title, 200);
    const safeType = sanitizePlainText(type, 50);
    const safeDate = sanitizePlainText(publishedDate || new Date().toISOString().split('T')[0], 50);
    const safeDescription = description ? sanitizePlainText(description, 2000) : null;
    const safeFileUrl = fileUrl ? validateSafeUrl(fileUrl) : null;
    const safeStatus = sanitizePlainText(status || 'published', 20);

    const item = await prisma.resource.create({
      data: {
        title: safeTitle,
        type: safeType,
        publishedDate: safeDate,
        description: safeDescription,
        fileUrl: safeFileUrl,
        status: safeStatus,
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'CREATE',
      entityType: 'RESOURCE',
      entityId: item.id,
      entityTitle: safeTitle,
      changeSummary: `Added resource: ${safeTitle} (${safeType})`,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Resources', 'edit');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    const { id, title, type, publishedDate, description, fileUrl, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Resource ID is required.' }, { status: 400 });
    }

    const safeTitle = title ? sanitizePlainText(title, 200) : undefined;
    const safeType = type ? sanitizePlainText(type, 50) : undefined;
    const safeDate = publishedDate ? sanitizePlainText(publishedDate, 50) : undefined;
    const safeDescription = description !== undefined ? (description ? sanitizePlainText(description, 2000) : null) : undefined;
    const safeFileUrl = fileUrl !== undefined ? (fileUrl ? validateSafeUrl(fileUrl) : null) : undefined;
    const safeStatus = status ? sanitizePlainText(status, 20) : undefined;

    const updated = await prisma.resource.update({
      where: { id },
      data: {
        ...(safeTitle && { title: safeTitle }),
        ...(safeType && { type: safeType }),
        ...(safeDate && { publishedDate: safeDate }),
        ...(safeDescription !== undefined && { description: safeDescription }),
        ...(safeFileUrl !== undefined && { fileUrl: safeFileUrl }),
        ...(safeStatus && { status: safeStatus }),
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'UPDATE',
      entityType: 'RESOURCE',
      entityId: id,
      entityTitle: updated.title,
      changeSummary: `Updated resource: ${updated.title}`,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Resources', 'delete');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'Resource ID is required.' }, { status: 400 });
    }

    const existing = await prisma.resource.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Resource not found.' }, { status: 404 });
    }

    if (permanent) {
      await prisma.resource.delete({ where: { id } });
      await recordAuditLog({
        performedBy: user.name || user.email,
        userEmail: user.email,
        actionType: 'DELETE',
        entityType: 'RESOURCE',
        entityId: id,
        entityTitle: existing.title,
        changeSummary: `Permanently deleted resource: ${existing.title} (ID: ${id})`,
      });
    } else {
      await prisma.resource.update({
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
        entityType: 'RESOURCE',
        entityId: id,
        entityTitle: existing.title,
        changeSummary: `Moved resource to Recycle Bin: ${existing.title} (ID: ${id})`,
      });
    }

    return NextResponse.json({ success: true, softDeleted: !permanent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
