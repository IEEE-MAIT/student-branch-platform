import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';

export async function GET() {
  try {
    const people = await prisma.person.findMany({ orderBy: { hierarchy: 'asc' } });
    return NextResponse.json(people);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'People', 'create')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const body: any = await req.json();
    const { name, role, category, department, hierarchy, imageUrl, bio, linkedin } = body;

    if (!name || !role || !category) {
      return NextResponse.json({ error: 'Name, Role, and Category are required.' }, { status: 400 });
    }

    const person = await prisma.person.create({
      data: {
        name,
        role,
        category,
        department: department || '',
        hierarchy: String(hierarchy ?? 'standard'),
        imageUrl,
      },
    });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'CREATE',
      entityType: 'PERSON',
      entityTitle: name,
      changeSummary: `Created team member: ${name} (${role})`,
    });

    return NextResponse.json(person);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'People', 'delete')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Person ID is required.' }, { status: 400 });
    }

    await prisma.person.delete({ where: { id } });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'DELETE',
      entityType: 'PERSON',
      entityTitle: id,
      changeSummary: `Deleted team member ID: ${id}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
