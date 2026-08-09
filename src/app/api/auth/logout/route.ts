import { NextResponse } from 'next/server';

/**
 * POST /api/auth/logout
 * Clears HttpOnly authentication cookie.
 */
export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: 'auth_token',
    value: '',
    httpOnly: true,
    expires: new Date(0), // Expire cookie immediately
    path: '/',
  });

  return response;
}
