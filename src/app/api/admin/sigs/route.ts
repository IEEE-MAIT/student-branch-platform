import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizePlainText, validateSafeUrl } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const list = await prisma.sIG.findMany({
      where: includeDeleted ? undefined : { deletedAt: null },
      orderBy: { createdAt: 'asc' },
      include: {
        lead: true,
        _count: {
          select: { projects: true, events: true, memberships: true },
        },
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

    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Missing required fields: name, slug' }, { status: 400 });
    }

    const sanitizedName = sanitizePlainText(body.name, 200);
    const sanitizedSlug = sanitizePlainText(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const sanitizedDescription = sanitizePlainText(body.description || '', 1000);
    const sanitizedAccentColor = sanitizePlainText(body.accentColor || '#00629B', 20);
    const sanitizedLogoUrl = body.logoUrl ? validateSafeUrl(body.logoUrl) : null;
    const sanitizedCoverImageUrl = body.coverImageUrl ? validateSafeUrl(body.coverImageUrl) : null;

    const newSIG = await prisma.sIG.create({
      data: {
        name: sanitizedName,
        slug: sanitizedSlug,
        description: sanitizedDescription,
        accentColor: sanitizedAccentColor,
        memberCount: typeof body.memberCount === 'number' ? body.memberCount : 0,
        logoUrl: sanitizedLogoUrl,
        coverImageUrl: sanitizedCoverImageUrl,
        leadId: body.leadId && body.leadId.trim() ? body.leadId.trim() : null,
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'CREATE',
      entityType: 'CHAPTER',
      entityId: newSIG.id,
      entityTitle: sanitizedName,
      changeSummary: `Created Special Interest Group: "${sanitizedName}"`,
    });

    return NextResponse.json(newSIG, { status: 201 });
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
      return NextResponse.json({ error: 'SIG ID and payload required' }, { status: 400 });
    }

    const safeName = body.name ? sanitizePlainText(body.name, 200) : undefined;
    const safeSlug = body.slug ? sanitizePlainText(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-') : undefined;
    const safeDescription = body.description !== undefined ? sanitizePlainText(body.description, 1000) : undefined;
    const safeAccentColor = body.accentColor !== undefined ? sanitizePlainText(body.accentColor, 20) : undefined;
    const safeLogoUrl = body.logoUrl !== undefined ? (body.logoUrl ? validateSafeUrl(body.logoUrl) : null) : undefined;
    const safeCoverImageUrl = body.coverImageUrl !== undefined ? (body.coverImageUrl ? validateSafeUrl(body.coverImageUrl) : null) : undefined;

    const updated = await prisma.sIG.update({
      where: { id: body.id },
      data: {
        ...(safeName && { name: safeName }),
        ...(safeSlug && { slug: safeSlug }),
        ...(safeDescription !== undefined && { description: safeDescription }),
        ...(safeAccentColor !== undefined && { accentColor: safeAccentColor }),
        ...(typeof body.memberCount === 'number' && { memberCount: body.memberCount }),
        ...(safeLogoUrl !== undefined && { logoUrl: safeLogoUrl }),
        ...(safeCoverImageUrl !== undefined && { coverImageUrl: safeCoverImageUrl }),
        leadId: body.leadId !== undefined ? (body.leadId && body.leadId.trim() ? body.leadId.trim() : null) : undefined,
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'UPDATE',
      entityType: 'CHAPTER',
      entityId: body.id,
      entityTitle: updated.name,
      changeSummary: `Updated Special Interest Group: "${updated.name}"`,
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
      return NextResponse.json({ error: 'SIG ID is required.' }, { status: 400 });
    }

    const existing = await prisma.sIG.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'SIG not found.' }, { status: 404 });
    }

    if (permanent) {
      await prisma.sIG.delete({ where: { id } });
      await recordAuditLog({
        performedBy: user.name || user.email,
        userEmail: user.email,
        actionType: 'DELETE',
        entityType: 'CHAPTER',
        entityId: id,
        entityTitle: existing.name,
        changeSummary: `Permanently deleted Special Interest Group: ${existing.name} (ID: ${id})`,
      });
    } else {
      await prisma.sIG.update({
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
        changeSummary: `Moved Special Interest Group to Recycle Bin: ${existing.name} (ID: ${id})`,
      });
    }

    return NextResponse.json({ success: true, softDeleted: !permanent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
