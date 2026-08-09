import { NextResponse } from 'next/server';
import { authenticateOfficer } from '@/lib/officers';
import { signJWT } from '@/lib/jwt';

/**
 * POST /api/auth/login
 * Authenticates email & password, issues a signed JWT token in an HttpOnly cookie.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const officer = await authenticateOfficer(email, password);
    if (!officer) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Issue JWT token
    const token = signJWT({
      userId: officer.id,
      email: officer.email,
      name: officer.name,
      role: officer.role,
      category: officer.category,
    });

    const response = NextResponse.json({
      success: true,
      officer: {
        id: officer.id,
        name: officer.name,
        email: officer.email,
        role: officer.role,
        category: officer.category,
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
