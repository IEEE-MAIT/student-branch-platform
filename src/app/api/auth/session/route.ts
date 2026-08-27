import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { getSafeOfficersList } from '@/lib/officers';
import { canPerform } from '@/lib/permissions';

/**
 * GET /api/auth/session
 * Verifies JWT token from HttpOnly cookie and returns authenticated officer payload & directory.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false, error: 'Token expired or invalid' }, { status: 200 });
    }

    const sessionUser = {
      id: payload.userId,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      roleId: payload.roleId,
      permissions: payload.permissions,
      customPermissions: payload.customPermissions,
    };

    // Only fetch officers list if user has permission to view Users module
    const canViewUsers = canPerform(sessionUser, 'Users', 'view');
    const officersList = canViewUsers ? await getSafeOfficersList() : [];

    return NextResponse.json({
      authenticated: true,
      officer: {
        userId: payload.userId,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        roleId: payload.roleId,
        category: payload.category,
        permissions: payload.permissions,
        customPermissions: payload.customPermissions,
      },
      officersList,
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
