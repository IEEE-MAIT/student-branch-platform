import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizePlainText, validateSafeUrl } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const list = await prisma.chapter.findMany({
      where: includeDeleted ? undefined : { deletedAt: null },
      orderBy: { name: 'asc' },
      include: {
        leader: true,
      },
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

    if (!body.name || typeof body.name !== 'string' || !body.slug || typeof body.slug !== 'string' || !body.type || typeof body.type !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid name, slug, or type' }, { status: 400 });
    }

    const sanitizedName = sanitizePlainText(body.name, 100);
    const sanitizedSlug = sanitizePlainText(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const sanitizedType = sanitizePlainText(body.type, 50);

    const newChapter = await prisma.chapter.create({
      data: {
        name: sanitizedName,
        slug: sanitizedSlug,
        type: sanitizedType,
        parentSociety: body.parentSociety ? sanitizePlainText(body.parentSociety, 100) : null,
        establishedYear: body.establishedYear ? sanitizePlainText(body.establishedYear, 10) : null,
        description: body.description ? sanitizePlainText(body.description, 2000) : null,
        mission: body.mission ? sanitizePlainText(body.mission, 2000) : null,
        tagline: body.tagline ? sanitizePlainText(body.tagline, 200) : null,
        logoUrl: body.logoUrl ? validateSafeUrl(body.logoUrl) : null,
        coverImageUrl: body.coverImageUrl ? validateSafeUrl(body.coverImageUrl) : null,
        accentColor: body.accentColor ? sanitizePlainText(body.accentColor, 30) : null,
        instagramUrl: body.instagramUrl ? validateSafeUrl(body.instagramUrl) : null,
        linkedinUrl: body.linkedinUrl ? validateSafeUrl(body.linkedinUrl) : null,
        githubUrl: body.githubUrl ? validateSafeUrl(body.githubUrl) : null,
        leaderName: body.leaderName ? sanitizePlainText(body.leaderName, 100) : null,
        leaderRole: body.leaderRole ? sanitizePlainText(body.leaderRole, 100) : null,
        leaderId: body.leaderId && body.leaderId.trim() ? body.leaderId.trim() : null,
        memberCount: typeof body.memberCount === 'number' ? body.memberCount : parseInt(body.memberCount || '0', 10) || 0,
        eventCount: typeof body.eventCount === 'number' ? body.eventCount : parseInt(body.eventCount || '0', 10) || 0,
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'CREATE',
      entityType: 'CHAPTER',
      entityId: newChapter.id,
      entityTitle: sanitizedName,
      changeSummary: `Created organizational unit: ${sanitizedName} (${sanitizedType})`,
    });

    return NextResponse.json(newChapter, { status: 201 });
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
      return NextResponse.json({ error: 'Chapter ID and payload required' }, { status: 400 });
    }

    const updatedChapter = await prisma.chapter.update({
      where: { id: body.id },
      data: {
        ...(body.name && { name: sanitizePlainText(body.name, 100) }),
        ...(body.slug && { slug: sanitizePlainText(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-') }),
        ...(body.type && { type: sanitizePlainText(body.type, 50) }),
        parentSociety: body.parentSociety !== undefined ? (body.parentSociety ? sanitizePlainText(body.parentSociety, 100) : null) : undefined,
        establishedYear: body.establishedYear !== undefined ? (body.establishedYear ? sanitizePlainText(body.establishedYear, 10) : null) : undefined,
        description: body.description !== undefined ? (body.description ? sanitizePlainText(body.description, 2000) : null) : undefined,
        mission: body.mission !== undefined ? (body.mission ? sanitizePlainText(body.mission, 2000) : null) : undefined,
        tagline: body.tagline !== undefined ? (body.tagline ? sanitizePlainText(body.tagline, 200) : null) : undefined,
        logoUrl: body.logoUrl !== undefined ? (body.logoUrl ? validateSafeUrl(body.logoUrl) : null) : undefined,
        coverImageUrl: body.coverImageUrl !== undefined ? (body.coverImageUrl ? validateSafeUrl(body.coverImageUrl) : null) : undefined,
        accentColor: body.accentColor !== undefined ? (body.accentColor ? sanitizePlainText(body.accentColor, 30) : null) : undefined,
        instagramUrl: body.instagramUrl !== undefined ? (body.instagramUrl ? validateSafeUrl(body.instagramUrl) : null) : undefined,
        linkedinUrl: body.linkedinUrl !== undefined ? (body.linkedinUrl ? validateSafeUrl(body.linkedinUrl) : null) : undefined,
        githubUrl: body.githubUrl !== undefined ? (body.githubUrl ? validateSafeUrl(body.githubUrl) : null) : undefined,
        leaderName: body.leaderName !== undefined ? (body.leaderName ? sanitizePlainText(body.leaderName, 100) : null) : undefined,
        leaderRole: body.leaderRole !== undefined ? (body.leaderRole ? sanitizePlainText(body.leaderRole, 100) : null) : undefined,
        leaderId: body.leaderId !== undefined ? (body.leaderId && body.leaderId.trim() ? body.leaderId.trim() : null) : undefined,
        ...(body.memberCount !== undefined && {
          memberCount: typeof body.memberCount === 'number' ? body.memberCount : parseInt(body.memberCount || '0', 10) || 0,
        }),
        ...(body.eventCount !== undefined && {
          eventCount: typeof body.eventCount === 'number' ? body.eventCount : parseInt(body.eventCount || '0', 10) || 0,
        }),
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'UPDATE',
      entityType: 'CHAPTER',
      entityId: updatedChapter.id,
      entityTitle: updatedChapter.name,
      changeSummary: `Updated organizational unit: ${updatedChapter.name}`,
    });

    return NextResponse.json(updatedChapter);
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
      return NextResponse.json({ error: 'Chapter ID is required.' }, { status: 400 });
    }

    const existing = await prisma.chapter.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Chapter not found.' }, { status: 404 });
    }

    if (permanent) {
      await prisma.chapter.delete({ where: { id } });
      await recordAuditLog({
        performedBy: user.name || user.email,
        userEmail: user.email,
        actionType: 'DELETE',
        entityType: 'CHAPTER',
        entityId: id,
        entityTitle: existing.name,
        changeSummary: `Permanently deleted chapter: ${existing.name} (ID: ${id})`,
      });
    } else {
      await prisma.chapter.update({
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
        entityType: 'CHAPTER',
        entityId: id,
        entityTitle: existing.name,
        changeSummary: `Moved chapter to Recycle Bin: ${existing.name} (ID: ${id})`,
      });
    }

    return NextResponse.json({ success: true, softDeleted: !permanent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
