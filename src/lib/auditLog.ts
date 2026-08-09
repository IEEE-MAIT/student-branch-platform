/**
 * @file src/lib/auditLog.ts
 * @description Centralized Audit Log Engine & Change History Ledger using Prisma ORM.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import { prisma } from './db';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  performedBy: string;
  actionType: string;
  entityType: string;
  entityTitle: string | null;
  changeSummary: string | null;
}

export async function recordAuditLog(entry: {
  performedBy: string;
  actionType: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: string;
  entityTitle: string;
  changeSummary: string;
}) {
  const timestamp = new Date().toISOString();
  
  try {
    await prisma.auditLog.create({
      data: {
        timestamp,
        performedBy: entry.performedBy || 'System Admin',
        actionType: entry.actionType,
        entityType: entry.entityType,
        entityTitle: entry.entityTitle,
        changeSummary: entry.changeSummary,
      }
    });
  } catch (e) {
    console.error('Failed to write audit log to DB', e);
  }
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    const logs = await prisma.auditLog.findMany({ orderBy: { timestamp: 'desc' } });
    return logs;
  } catch (e) {
    console.error('Failed to fetch audit logs from DB', e);
    return [];
  }
}
