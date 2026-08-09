import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { createOfficer } from '@/lib/officers';
import { PersonCategory } from '@/lib/data';
import { recordAuditLog } from '@/lib/auditLog';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Session token missing.' }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload || payload.role !== 'Super Admin') {
      return NextResponse.json({ error: 'Forbidden: Only Super Admin can register new officers.' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, role, category } = body || {};

    const validCategory = Object.values(PersonCategory).includes(category) ? category : PersonCategory.SEC;
    const validRole = ['Executive Officer', 'Webmaster', 'Content Editor'].includes(role) ? role : 'Executive Officer';

    const result = createOfficer(
      name,
      email,
      password,
      validRole as any,
      validCategory,
      payload.email
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Record Audit Log (Who, When, What)
    recordAuditLog({
      performedBy: payload.email,
      actionType: 'CREATE',
      entityType: 'Officer User',
      entityTitle: `${result.officer!.name} (${result.officer!.role})`,
      changeSummary: `Registered new branch officer account "${result.officer!.name}" (${result.officer!.email}) with role ${result.officer!.role}.`,
    });

    return NextResponse.json({
      success: true,
      officer: {
        id: result.officer!.id,
        name: result.officer!.name,
        email: result.officer!.email,
        role: result.officer!.role,
        category: result.officer!.category,
        createdAt: result.officer!.createdAt,
        createdBy: result.officer!.createdBy,
      },
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create officer.' }, { status: 500 });
  }
}
