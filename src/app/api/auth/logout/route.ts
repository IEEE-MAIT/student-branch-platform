import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/auditLog';

/**
 * POST /api/auth/logout
 * Clears HttpOnly authentication cookie and records logout event in audit ledger.
 */
export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (user) {
      recordAuditLog({
        performedBy: user.name,
        userEmail: user.email,
        actionType: 'LOGOUT',
        entityType: 'AUTH',
        entityId: user.userId,
        entityTitle: user.email,
        changeSummary: `Admin logged out: ${user.name} (${user.role})`,
      }).catch(() => {});
    }
  } catch {}

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
