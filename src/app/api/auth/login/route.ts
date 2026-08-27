import { NextResponse } from 'next/server';
import { authenticateOfficer } from '@/lib/officers';
import { signJWT } from '@/lib/jwt';
import { recordAuditLog } from '@/lib/auditLog';

/**
 * POST /api/auth/login
 * Authenticates email & password, issues a signed JWT token in an HttpOnly cookie,
 * and records a login event in the audit trail.
 */
export async function POST(request: Request) {
  try {
    const body: any = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const admin = await authenticateOfficer(email, password);
    if (!admin) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Issue JWT token with embedded role and permissions
    const token = signJWT({
      userId: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      roleId: admin.roleId,
      category: admin.category || 'Executive',
      permissions: admin.permissions,
      customPermissions: admin.customPermissions,
    });

    // Record login in audit log asynchronously
    recordAuditLog({
      performedBy: admin.name,
      userEmail: admin.email,
      actionType: 'LOGIN',
      entityType: 'AUTH',
      entityId: admin.id,
      entityTitle: admin.email,
      changeSummary: `Admin logged in successfully: ${admin.name} (${admin.role})`,
    }).catch(() => {});

    const response = NextResponse.json({
      success: true,
      officer: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        roleId: admin.roleId,
        category: admin.category,
        permissions: admin.permissions,
        customPermissions: admin.customPermissions,
      },
    });

    // Set secure HttpOnly cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 28800, // 8 Hours
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Authentication request failed.' }, { status: 500 });
  }
}
