import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizePlainText } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const list = await prisma.academicYear.findMany({ orderBy: { label: 'desc' } });
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Settings', 'create');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (!body.label || typeof body.label !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid label' }, { status: 400 });
    }

    const sanitizedLabel = sanitizePlainText(body.label, 50);
    const startDate = body.startDate ? sanitizePlainText(body.startDate, 50) : null;
    const endDate = body.endDate ? sanitizePlainText(body.endDate, 50) : null;
    const isCurrent = typeof body.isCurrent === 'boolean' ? body.isCurrent : false;

    // If this is set to current, unset any other current academic year
    if (isCurrent) {
      await prisma.academicYear.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
    }

    const newAcademicYear = await prisma.academicYear.create({
      data: {
        label: sanitizedLabel,
        startDate,
        endDate,
        isCurrent,
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'CREATE',
      entityType: 'ACADEMIC_YEAR',
      entityId: newAcademicYear.id,
      entityTitle: sanitizedLabel,
      changeSummary: `Created academic year: ${sanitizedLabel}`,
    });

    return NextResponse.json(newAcademicYear, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Settings', 'edit');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    if (!body || typeof body !== 'object' || !body.id) {
      return NextResponse.json({ error: 'AcademicYear ID is required.' }, { status: 400 });
    }

    const isCurrent = typeof body.isCurrent === 'boolean' ? body.isCurrent : undefined;
    if (isCurrent) {
      await prisma.academicYear.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
    }

    const updated = await prisma.academicYear.update({
      where: { id: body.id },
      data: {
        ...(body.label && { label: sanitizePlainText(body.label, 50) }),
        ...(body.startDate !== undefined && { startDate: body.startDate ? sanitizePlainText(body.startDate, 50) : null }),
        ...(body.endDate !== undefined && { endDate: body.endDate ? sanitizePlainText(body.endDate, 50) : null }),
        ...(isCurrent !== undefined && { isCurrent }),
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'UPDATE',
      entityType: 'ACADEMIC_YEAR',
      entityId: body.id,
      entityTitle: updated.label,
      changeSummary: `Updated academic year: ${updated.label}`,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Settings', 'delete');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'AcademicYear ID is required.' }, { status: 400 });
    }

    const existing = await prisma.academicYear.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'AcademicYear not found.' }, { status: 404 });
    }

    await prisma.academicYear.delete({ where: { id } });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'DELETE',
      entityType: 'ACADEMIC_YEAR',
      entityId: id,
      entityTitle: existing.label,
      changeSummary: `Deleted academic year: ${existing.label} (ID: ${id})`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
