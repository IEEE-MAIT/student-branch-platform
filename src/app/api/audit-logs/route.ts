import { NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/auditLog';
import { guardApiRoute } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/audit-logs
 * Read-only endpoint for viewing the system audit trail.
 * Strictly gated by AuditLogs:view permission.
 */
export async function GET(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'AuditLogs', 'view');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }

    const { searchParams } = new URL(req.url);
    const entityType = searchParams.get('entityType') || undefined;
    const actionType = searchParams.get('actionType') || undefined;
    const userEmail = searchParams.get('userEmail') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 100;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : 0;

    const result = await getAuditLogs({
      entityType,
      actionType,
      userEmail,
      limit,
      offset,
    });

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Database error' }, { status: 500 });
  }
}

/**
 * Audit logs are completely immutable. Any mutation attempts are strictly forbidden.
 */
export async function POST() {
  return NextResponse.json({ error: 'Audit logs cannot be manually inserted via API.' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Audit logs are immutable and cannot be updated.' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Audit logs are immutable and cannot be deleted.' }, { status: 405 });
}
