/**
 * @file src/lib/auth.ts
 * @description Authentication & RBAC Verification Engine for IEEE MAIT.
 * 
 * Re-exports permissions primitives and provides request-level authentication
 * and authorization guards for Next.js App Router route handlers.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT, JWTPayload } from './jwt';
import {
  canPerform,
  normalizeModule,
  AppModule,
  AppAction,
  PermissionMatrix,
  SessionUser,
  ROLE_DEFAULT_PERMISSIONS,
} from './permissions';

export type { AppModule, AppAction, PermissionMatrix, SessionUser };
export { canPerform, normalizeModule, ROLE_DEFAULT_PERMISSIONS };

/**
 * Legacy Role and Resource types for backward compatibility.
 */
export type Role = string;
export type Resource = string;
export type Action = 'view' | 'create' | 'edit' | 'delete' | 'restore' | 'publish' | 'approve';

/**
 * Backward-compatible hasPermission function.
 */
export function hasPermission(
  roleOrUser: string | SessionUser | null | undefined,
  resource: string,
  action: Action | string
): boolean {
  if (!roleOrUser) return false;

  let sessionUser: SessionUser;
  if (typeof roleOrUser === 'string') {
    sessionUser = {
      id: '',
      name: '',
      email: '',
      role: roleOrUser,
    };
  } else {
    sessionUser = roleOrUser;
  }

  return canPerform(sessionUser, resource, action as AppAction);
}

/**
 * Extracts and verifies the authenticated user from a Request object or cookies.
 */
export async function getAuthenticatedUser(req?: Request): Promise<JWTPayload | null> {
  let token: string | null = null;

  // 1. Try to extract token from Authorization header (Bearer token)
  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  // 2. Try to extract token from Request Cookie header
  if (!token && req) {
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]+)/);
      if (match) {
        token = decodeURIComponent(match[1]);
      }
    }
  }

  // 3. Try to extract token from Next.js cookies() helper
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get('auth_token')?.value || null;
    } catch {
      // cookies() may fail outside of server request context
    }
  }

  if (!token) return null;

  return verifyJWT(token);
}

/**
 * Route protection guard for Next.js API route handlers.
 * Verifies authentication and checks whether the caller has the required permission.
 * 
 * Returns either:
 * - `{ user: JWTPayload, isAuthorized: true }` on success
 * - `{ errorResponse: NextResponse, isAuthorized: false }` on failure (401 or 403)
 */
export async function guardApiRoute(
  req: Request,
  module: AppModule | string,
  action: AppAction
): Promise<{ user: JWTPayload; isAuthorized: true } | { errorResponse: NextResponse; isAuthorized: false }> {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return {
      isAuthorized: false,
      errorResponse: NextResponse.json(
        { error: 'Unauthorized. Authentication session required.' },
        { status: 401 }
      ),
    };
  }

  const sessionUser: SessionUser = {
    id: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
    roleId: user.roleId,
    permissions: user.permissions,
    customPermissions: user.customPermissions,
  };

  const isAllowed = canPerform(sessionUser, module, action);

  if (!isAllowed) {
    return {
      isAuthorized: false,
      errorResponse: NextResponse.json(
        {
          error: `Forbidden. Role '${user.role}' lacks permission to perform '${action}' on '${module}'.`,
        },
        { status: 403 }
      ),
    };
  }

  return { user, isAuthorized: true };
}
