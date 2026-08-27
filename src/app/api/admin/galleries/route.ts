import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizePlainText, validateSafeUrl } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const list = await prisma.gallery.findMany({
      where: includeDeleted ? undefined : { deletedAt: null },
      include: {
        photos: { where: { deletedAt: null } },
        chapter: true,
      },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Galleries', 'create');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    const { title, slug, date, category, photoCount, imageCount, coverImage, description, chapterId } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and Slug are required.' }, { status: 400 });
    }

    const safeTitle = sanitizePlainText(title, 200);
    const safeSlug = sanitizePlainText(slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const safeDate = sanitizePlainText(date || new Date().toISOString().split('T')[0], 50);
    const safeCategory = sanitizePlainText(category || 'Events', 50);
    const safeCoverImage = coverImage ? validateSafeUrl(coverImage) || '' : '';
    const safeDescription = description ? sanitizePlainText(description, 2000) : null;
    const count = typeof imageCount === 'number' ? imageCount : (typeof photoCount === 'number' ? photoCount : 0);

    const item = await prisma.gallery.create({
      data: {
        title: safeTitle,
        slug: safeSlug,
        date: safeDate,
        category: safeCategory,
        imageCount: count,
        coverImage: safeCoverImage,
        description: safeDescription,
        chapterId: chapterId && chapterId.trim() ? chapterId.trim() : null,
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'CREATE',
      entityType: 'GALLERY',
      entityId: item.id,
      entityTitle: safeTitle,
      changeSummary: `Created gallery album: ${safeTitle} (${safeSlug})`,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Galleries', 'edit');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    const { id, title, slug, date, category, photoCount, imageCount, coverImage, description, chapterId } = body;

    if (!id) {
      return NextResponse.json({ error: 'Gallery ID is required.' }, { status: 400 });
    }

    const safeTitle = title ? sanitizePlainText(title, 200) : undefined;
    const safeSlug = slug ? sanitizePlainText(slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-') : undefined;
    const safeDate = date ? sanitizePlainText(date, 50) : undefined;
    const safeCategory = category ? sanitizePlainText(category, 50) : undefined;
    const safeCoverImage = coverImage !== undefined ? (coverImage ? validateSafeUrl(coverImage) || '' : '') : undefined;
    const safeDescription = description !== undefined ? (description ? sanitizePlainText(description, 2000) : null) : undefined;
    const count = typeof imageCount === 'number' ? imageCount : (typeof photoCount === 'number' ? photoCount : undefined);

    const updated = await prisma.gallery.update({
      where: { id },
      data: {
        ...(safeTitle && { title: safeTitle }),
        ...(safeSlug && { slug: safeSlug }),
        ...(safeDate && { date: safeDate }),
        ...(safeCategory && { category: safeCategory }),
        ...(count !== undefined && { imageCount: count }),
        ...(safeCoverImage !== undefined && { coverImage: safeCoverImage }),
        ...(safeDescription !== undefined && { description: safeDescription }),
        ...(chapterId !== undefined && { chapterId: chapterId && chapterId.trim() ? chapterId.trim() : null }),
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'UPDATE',
      entityType: 'GALLERY',
      entityId: id,
      entityTitle: updated.title,
      changeSummary: `Updated gallery album: ${updated.title}`,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Galleries', 'delete');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'Gallery ID is required.' }, { status: 400 });
    }

    const existing = await prisma.gallery.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Gallery not found.' }, { status: 404 });
    }

    if (permanent) {
      await prisma.gallery.delete({ where: { id } });
      await recordAuditLog({
        performedBy: user.name || user.email,
        userEmail: user.email,
        actionType: 'DELETE',
        entityType: 'GALLERY',
        entityId: id,
        entityTitle: existing.title,
        changeSummary: `Permanently deleted gallery album: ${existing.title} (ID: ${id})`,
      });
    } else {
      await prisma.gallery.update({
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
        entityType: 'GALLERY',
        entityId: id,
        entityTitle: existing.title,
        changeSummary: `Moved gallery album to Recycle Bin: ${existing.title} (ID: ${id})`,
      });
    }

    return NextResponse.json({ success: true, softDeleted: !permanent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
