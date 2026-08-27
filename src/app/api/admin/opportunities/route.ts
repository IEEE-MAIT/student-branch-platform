import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizePlainText, validateSafeUrl } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const list = await prisma.opportunity.findMany({
      where: includeDeleted ? undefined : { deletedAt: null },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
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
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Missing required fields: title, slug' }, { status: 400 });
    }

    const sanitizedTitle = sanitizePlainText(body.title, 200);
    const sanitizedSlug = sanitizePlainText(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const sanitizedDescription = sanitizePlainText(body.description || '', 2000);
    const sanitizedOrganisation = sanitizePlainText(body.organisation || '', 100);
    const sanitizedCategory = sanitizePlainText(body.category || 'Scholarship', 50);
    const sanitizedEligibility = sanitizePlainText(body.eligibility || '', 500);
    const sanitizedDeadline = sanitizePlainText(body.deadline || '', 50);
    const sanitizedLink = body.link ? validateSafeUrl(body.link) : null;
    const sanitizedStatus = sanitizePlainText(body.status || 'Active', 20);
    const deadlineDate = body.deadlineDate ? new Date(body.deadlineDate) : null;

    const newOpportunity = await prisma.opportunity.create({
      data: {
        title: sanitizedTitle,
        slug: sanitizedSlug,
        description: sanitizedDescription,
        organisation: sanitizedOrganisation,
        category: sanitizedCategory,
        eligibility: sanitizedEligibility,
        deadline: sanitizedDeadline,
        deadlineDate,
        link: sanitizedLink,
        status: sanitizedStatus,
        featured: Boolean(body.featured),
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'CREATE',
      entityType: 'RESOURCE',
      entityId: newOpportunity.id,
      entityTitle: sanitizedTitle,
      changeSummary: `Created Opportunity / Grant: "${sanitizedTitle}" (${sanitizedCategory})`,
    });

    return NextResponse.json(newOpportunity, { status: 201 });
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
    if (!body || typeof body !== 'object' || !body.id) {
      return NextResponse.json({ error: 'Opportunity ID and payload required' }, { status: 400 });
    }

    const safeTitle = body.title ? sanitizePlainText(body.title, 200) : undefined;
    const safeSlug = body.slug ? sanitizePlainText(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-') : undefined;
    const safeDescription = body.description !== undefined ? sanitizePlainText(body.description, 2000) : undefined;
    const safeOrganisation = body.organisation !== undefined ? sanitizePlainText(body.organisation, 100) : undefined;
    const safeCategory = body.category !== undefined ? sanitizePlainText(body.category, 50) : undefined;
    const safeEligibility = body.eligibility !== undefined ? sanitizePlainText(body.eligibility, 500) : undefined;
    const safeDeadline = body.deadline !== undefined ? sanitizePlainText(body.deadline, 50) : undefined;
    const safeLink = body.link !== undefined ? (body.link ? validateSafeUrl(body.link) : null) : undefined;
    const safeStatus = body.status !== undefined ? sanitizePlainText(body.status, 20) : undefined;
    const deadlineDate = body.deadlineDate !== undefined ? (body.deadlineDate ? new Date(body.deadlineDate) : null) : undefined;

    const updated = await prisma.opportunity.update({
      where: { id: body.id },
      data: {
        ...(safeTitle && { title: safeTitle }),
        ...(safeSlug && { slug: safeSlug }),
        ...(safeDescription !== undefined && { description: safeDescription }),
        ...(safeOrganisation !== undefined && { organisation: safeOrganisation }),
        ...(safeCategory !== undefined && { category: safeCategory }),
        ...(safeEligibility !== undefined && { eligibility: safeEligibility }),
        ...(safeDeadline !== undefined && { deadline: safeDeadline }),
        ...(deadlineDate !== undefined && { deadlineDate }),
        ...(safeLink !== undefined && { link: safeLink }),
        ...(safeStatus !== undefined && { status: safeStatus }),
        ...(body.featured !== undefined && { featured: Boolean(body.featured) }),
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'UPDATE',
      entityType: 'RESOURCE',
      entityId: body.id,
      entityTitle: updated.title,
      changeSummary: `Updated Opportunity / Grant: "${updated.title}"`,
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
      return NextResponse.json({ error: 'Opportunity ID is required.' }, { status: 400 });
    }

    const existing = await prisma.opportunity.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Opportunity not found.' }, { status: 404 });
    }

    if (permanent) {
      await prisma.opportunity.delete({ where: { id } });
      await recordAuditLog({
        performedBy: user.name || user.email,
        userEmail: user.email,
        actionType: 'DELETE',
        entityType: 'RESOURCE',
        entityId: id,
        entityTitle: existing.title,
        changeSummary: `Permanently deleted opportunity: ${existing.title} (ID: ${id})`,
      });
    } else {
      await prisma.opportunity.update({
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
        changeSummary: `Moved opportunity to Recycle Bin: ${existing.title} (ID: ${id})`,
      });
    }

    return NextResponse.json({ success: true, softDeleted: !permanent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
