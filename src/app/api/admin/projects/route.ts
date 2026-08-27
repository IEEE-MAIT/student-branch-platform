import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizePlainText, validateSafeUrl } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const list = await prisma.project.findMany({
      where: includeDeleted ? undefined : { deletedAt: null },
      orderBy: { year: 'desc' },
      include: { chapter: true, sig: true },
    });
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Projects', 'create');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Missing required fields: title, slug' }, { status: 400 });
    }

    const sanitizedTitle = sanitizePlainText(body.title, 200);
    const sanitizedSlug = sanitizePlainText(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const sanitizedSummary = sanitizePlainText(body.summary || '', 500);
    const sanitizedDescription = sanitizePlainText(body.description || '', 3000);
    const sanitizedYear = sanitizePlainText(body.year || new Date().getFullYear().toString(), 10);
    const sanitizedStatus = sanitizePlainText(body.status || 'Ongoing', 30);
    const sanitizedGithubUrl = body.githubUrl ? validateSafeUrl(body.githubUrl) : null;
    const sanitizedDemoUrl = body.demoUrl ? validateSafeUrl(body.demoUrl) : null;
    const sanitizedCoverImage = body.coverImage ? validateSafeUrl(body.coverImage) : null;

    const tags = Array.isArray(body.tags)
      ? body.tags.map((t: string) => sanitizePlainText(t, 50)).slice(0, 10)
      : [];

    const newProject = await prisma.project.create({
      data: {
        title: sanitizedTitle,
        slug: sanitizedSlug,
        summary: sanitizedSummary,
        description: sanitizedDescription,
        githubUrl: sanitizedGithubUrl,
        demoUrl: sanitizedDemoUrl,
        coverImage: sanitizedCoverImage,
        year: sanitizedYear,
        status: sanitizedStatus,
        tags,
        featured: Boolean(body.featured),
        chapterId: body.chapterId && body.chapterId.trim() ? body.chapterId.trim() : null,
        sigId: body.sigId && body.sigId.trim() ? body.sigId.trim() : null,
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'CREATE',
      entityType: 'PROJECT',
      entityId: newProject.id,
      entityTitle: sanitizedTitle,
      changeSummary: `Created technical project: "${sanitizedTitle}"`,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Projects', 'edit');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    if (!body || typeof body !== 'object' || !body.id) {
      return NextResponse.json({ error: 'Project ID and payload required' }, { status: 400 });
    }

    const safeTitle = body.title ? sanitizePlainText(body.title, 200) : undefined;
    const safeSlug = body.slug ? sanitizePlainText(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-') : undefined;
    const safeSummary = body.summary !== undefined ? sanitizePlainText(body.summary, 500) : undefined;
    const safeDescription = body.description !== undefined ? sanitizePlainText(body.description, 3000) : undefined;
    const safeYear = body.year !== undefined ? sanitizePlainText(body.year, 10) : undefined;
    const safeStatus = body.status !== undefined ? sanitizePlainText(body.status, 30) : undefined;
    const safeGithub = body.githubUrl !== undefined ? (body.githubUrl ? validateSafeUrl(body.githubUrl) : null) : undefined;
    const safeDemo = body.demoUrl !== undefined ? (body.demoUrl ? validateSafeUrl(body.demoUrl) : null) : undefined;
    const safeCover = body.coverImage !== undefined ? (body.coverImage ? validateSafeUrl(body.coverImage) : null) : undefined;

    const tags = Array.isArray(body.tags)
      ? body.tags.map((t: string) => sanitizePlainText(t, 50)).slice(0, 10)
      : undefined;

    const updated = await prisma.project.update({
      where: { id: body.id },
      data: {
        ...(safeTitle && { title: safeTitle }),
        ...(safeSlug && { slug: safeSlug }),
        ...(safeSummary !== undefined && { summary: safeSummary }),
        ...(safeDescription !== undefined && { description: safeDescription }),
        ...(safeYear !== undefined && { year: safeYear }),
        ...(safeStatus !== undefined && { status: safeStatus }),
        ...(safeGithub !== undefined && { githubUrl: safeGithub }),
        ...(safeDemo !== undefined && { demoUrl: safeDemo }),
        ...(safeCover !== undefined && { coverImage: safeCover }),
        ...(tags !== undefined && { tags }),
        ...(body.featured !== undefined && { featured: Boolean(body.featured) }),
        chapterId: body.chapterId !== undefined ? (body.chapterId && body.chapterId.trim() ? body.chapterId.trim() : null) : undefined,
        sigId: body.sigId !== undefined ? (body.sigId && body.sigId.trim() ? body.sigId.trim() : null) : undefined,
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'UPDATE',
      entityType: 'PROJECT',
      entityId: idCheck(body.id),
      entityTitle: updated.title,
      changeSummary: `Updated technical project: "${updated.title}"`,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function idCheck(id: any): string {
  return String(id || '');
}

export async function DELETE(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Projects', 'delete');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required.' }, { status: 400 });
    }

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    if (permanent) {
      await prisma.project.delete({ where: { id } });
      await recordAuditLog({
        performedBy: user.name || user.email,
        userEmail: user.email,
        actionType: 'DELETE',
        entityType: 'PROJECT',
        entityId: id,
        entityTitle: existing.title,
        changeSummary: `Permanently deleted project: ${existing.title} (ID: ${id})`,
      });
    } else {
      await prisma.project.update({
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
        entityType: 'PROJECT',
        entityId: id,
        entityTitle: existing.title,
        changeSummary: `Moved project to Recycle Bin: ${existing.title} (ID: ${id})`,
      });
    }

    return NextResponse.json({ success: true, softDeleted: !permanent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
