import { NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/auditLog';

/**
 * GET /api/audit-logs
 * Returns complete site-wide change history logs (Who modified What and When).
 */
export async function GET() {
  return NextResponse.json(getAuditLogs(), {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
