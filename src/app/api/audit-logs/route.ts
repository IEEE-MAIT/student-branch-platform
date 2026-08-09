import { NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/auditLog';

export async function GET() {
  try {
    const logs = await getAuditLogs();
    return NextResponse.json(logs, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
