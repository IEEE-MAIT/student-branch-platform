import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizePlainText, sanitizeHtmlContent, validateSafeUrl } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const stories = await prisma.story.findMany({
      where: includeDeleted ? undefined : { deletedAt: null },
      orderBy: { date: 'desc' },
      include: { chapter: true, authorPerson: true },
    });
    return NextResponse.json(stories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Publications', 'create');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    const {
      title,
      slug,
      author,
      authorId,
      date,
      category,
      publicationType,
      excerpt,
      contentHtml,
      imageUrl,
      pdfUrl,
      externalLink,
      chapterId,
      workflowStatus,
    } = body;

    if (!title || !slug || !contentHtml) {
      return NextResponse.json({ error: 'Title, Slug, and Content are required.' }, { status: 400 });
    }

    const safeTitle = sanitizePlainText(title, 200);
    const safeSlug = sanitizePlainText(slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const safeAuthor = sanitizePlainText(author || user.name, 100);
    const safeDate = sanitizePlainText(date || new Date().toISOString().split('T')[0], 50);
    const safeCategory = sanitizePlainText(category || 'General', 50);
    const safePublicationType = publicationType ? sanitizePlainText(publicationType, 50) : 'Technical Article';
    const safeExcerpt = sanitizePlainText(excerpt || '', 500);
    const safeContentHtml = sanitizeHtmlContent(contentHtml);
    const safeImageUrl = imageUrl ? validateSafeUrl(imageUrl) : null;
    const safePdfUrl = pdfUrl ? validateSafeUrl(pdfUrl) : null;
    const safeExternalLink = externalLink ? validateSafeUrl(externalLink) : null;

    const story = await prisma.story.create({
      data: {
        title: safeTitle,
        slug: safeSlug,
        author: safeAuthor,
        authorId: authorId && authorId.trim() ? authorId.trim() : null,
        date: safeDate,
        category: safeCategory,
        publicationType: safePublicationType,
        excerpt: safeExcerpt,
        contentHtml: safeContentHtml,
        imageUrl: safeImageUrl,
        pdfUrl: safePdfUrl,
        externalLink: safeExternalLink,
        chapterId: chapterId && chapterId.trim() ? chapterId.trim() : null,
        workflowStatus: workflowStatus ? sanitizePlainText(workflowStatus, 30) : 'Published',
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'CREATE',
      entityType: 'PUBLICATION',
      entityId: story.id,
      entityTitle: safeTitle,
      changeSummary: `Created publication article: ${safeTitle} (${safePublicationType})`,
    });

    return NextResponse.json(story, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Publications', 'edit');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    const {
      id,
      title,
      slug,
      author,
      authorId,
      date,
      category,
      publicationType,
      excerpt,
      contentHtml,
      imageUrl,
      pdfUrl,
      externalLink,
      chapterId,
      workflowStatus,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Publication ID is required.' }, { status: 400 });
    }

    const safeTitle = title ? sanitizePlainText(title, 200) : undefined;
    const safeSlug = slug ? sanitizePlainText(slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-') : undefined;
    const safeAuthor = author ? sanitizePlainText(author, 100) : undefined;
    const safeDate = date ? sanitizePlainText(date, 50) : undefined;
    const safeCategory = category ? sanitizePlainText(category, 50) : undefined;
    const safePublicationType = publicationType ? sanitizePlainText(publicationType, 50) : undefined;
    const safeExcerpt = excerpt !== undefined ? sanitizePlainText(excerpt, 500) : undefined;
    const safeContentHtml = contentHtml !== undefined ? sanitizeHtmlContent(contentHtml) : undefined;
    const safeImageUrl = imageUrl !== undefined ? (imageUrl ? validateSafeUrl(imageUrl) : null) : undefined;
    const safePdfUrl = pdfUrl !== undefined ? (pdfUrl ? validateSafeUrl(pdfUrl) : null) : undefined;
    const safeExternalLink = externalLink !== undefined ? (externalLink ? validateSafeUrl(externalLink) : null) : undefined;
    const safeChapterId = chapterId !== undefined ? (chapterId && chapterId.trim() ? chapterId.trim() : null) : undefined;
    const safeAuthorId = authorId !== undefined ? (authorId && authorId.trim() ? authorId.trim() : null) : undefined;
    const safeWorkflow = workflowStatus ? sanitizePlainText(workflowStatus, 30) : undefined;

    const updated = await prisma.story.update({
      where: { id },
      data: {
        ...(safeTitle && { title: safeTitle }),
        ...(safeSlug && { slug: safeSlug }),
        ...(safeAuthor && { author: safeAuthor }),
        ...(safeAuthorId !== undefined && { authorId: safeAuthorId }),
        ...(safeDate && { date: safeDate }),
        ...(safeCategory && { category: safeCategory }),
        ...(safePublicationType && { publicationType: safePublicationType }),
        ...(safeExcerpt !== undefined && { excerpt: safeExcerpt }),
        ...(safeContentHtml !== undefined && { contentHtml: safeContentHtml }),
        ...(safeImageUrl !== undefined && { imageUrl: safeImageUrl }),
        ...(safePdfUrl !== undefined && { pdfUrl: safePdfUrl }),
        ...(safeExternalLink !== undefined && { externalLink: safeExternalLink }),
        ...(safeChapterId !== undefined && { chapterId: safeChapterId }),
        ...(safeWorkflow && { workflowStatus: safeWorkflow }),
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'UPDATE',
      entityType: 'PUBLICATION',
      entityId: id,
      entityTitle: updated.title,
      changeSummary: `Updated publication article: ${updated.title}`,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Publications', 'delete');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'Publication ID is required.' }, { status: 400 });
    }

    const existing = await prisma.story.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Publication not found.' }, { status: 404 });
    }

    if (permanent) {
      await prisma.story.delete({ where: { id } });
      await recordAuditLog({
        performedBy: user.name || user.email,
        userEmail: user.email,
        actionType: 'DELETE',
        entityType: 'PUBLICATION',
        entityId: id,
        entityTitle: existing.title,
        changeSummary: `Permanently deleted publication: ${existing.title} (ID: ${id})`,
      });
    } else {
      await prisma.story.update({
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
        entityType: 'PUBLICATION',
        entityId: id,
        entityTitle: existing.title,
        changeSummary: `Moved publication to Recycle Bin: ${existing.title} (ID: ${id})`,
      });
    }

    return NextResponse.json({ success: true, softDeleted: !permanent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
