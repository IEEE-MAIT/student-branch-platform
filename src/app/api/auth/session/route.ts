import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { getSafeOfficersList } from '@/lib/officers';

/**
 * GET /api/auth/session
 * Verifies JWT token from HttpOnly cookie and returns authenticated officer payload & officers directory.
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

    const officersList = payload.role === 'Super Admin' ? await getSafeOfficersList() : [];

    return NextResponse.json({
      authenticated: true,
      officer: {
        userId: payload.userId,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        category: payload.category,
      },
      officersList,
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
