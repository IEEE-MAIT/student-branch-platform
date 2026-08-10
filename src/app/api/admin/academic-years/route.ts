import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizeText } from '@/lib/security';

export async function GET() {
  try {
    const list = await prisma.academicYear.findMany({ orderBy: { label: 'desc' } });
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'Settings', 'create')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const body: any = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (!body.label || typeof body.label !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid label' }, { status: 400 });
    }

    const sanitizedLabel = sanitizeText(body.label, 50);
    const startDate = body.startDate ? sanitizeText(body.startDate, 50) : null;
    const endDate = body.endDate ? sanitizeText(body.endDate, 50) : null;
    const isCurrent = typeof body.isCurrent === 'boolean' ? body.isCurrent : false;

    // If this is set to current, we might want to unset other current years
    if (isCurrent) {
      await prisma.academicYear.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false }
      });
    }

    const newAcademicYear = await prisma.academicYear.create({
      data: {
        label: sanitizedLabel,
        startDate,
        endDate,
        isCurrent,
      }
    });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'CREATE',
      entityType: 'ACADEMIC_YEAR',
      entityTitle: sanitizedLabel,
      changeSummary: `Created academic year: ${sanitizedLabel}`,
    });

    return NextResponse.json(newAcademicYear, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'Settings', 'delete')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'AcademicYear ID is required.' }, { status: 400 });
    }

    await prisma.academicYear.delete({ where: { id } });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'DELETE',
      entityType: 'ACADEMIC_YEAR',
      entityTitle: id,
      changeSummary: `Deleted academic year ID: ${id}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
