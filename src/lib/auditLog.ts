/**
 * @file src/lib/auditLog.ts
 * @description Centralized Immutable Audit Log Engine & Activity Ledger for IEEE MAIT.
 * 
 * SECURITY SPECIFICATION:
 * - Immutable ledger: No DELETE or UPDATE methods exist.
 * - Records timestamps, actor name, actor email, action type, entity type, entity ID, title, and structured diffs.
 * 
 * @author IEEE MAIT Webmaster & Security Engineering
 * @license MIT
 */

import { prisma } from './db';
import { sanitizePlainText } from './security';

export type AuditActionType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'RESTORE'
  | 'PUBLISH'
  | 'APPROVE'
  | 'LOGIN'
  | 'LOGOUT';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  performedBy: string;
  userEmail?: string | null;
  actionType: string;
  entityType: string;
  entityId?: string | null;
  entityTitle?: string | null;
  changeSummary?: string | null;
  details?: any;
  ipAddress?: string | null;
  createdAt?: Date;
}

export interface RecordAuditParams {
  performedBy: string;
  userEmail?: string | null;
  actionType: AuditActionType | string;
  entityType: string;
  entityId?: string | null;
  entityTitle?: string | null;
  changeSummary: string;
  details?: any;
  ipAddress?: string | null;
}

/**
 * Appends a new immutable entry to the system audit ledger.
 */
export async function recordAuditLog(entry: RecordAuditParams): Promise<void> {
  const timestamp = new Date().toISOString();

  try {
    await prisma.auditLog.create({
      data: {
        timestamp,
        performedBy: sanitizePlainText(entry.performedBy || 'System Admin', 100),
        userEmail: entry.userEmail ? sanitizePlainText(entry.userEmail, 150) : null,
        actionType: entry.actionType.toUpperCase(),
        entityType: entry.entityType.toUpperCase(),
        entityId: entry.entityId || null,
        entityTitle: entry.entityTitle ? sanitizePlainText(entry.entityTitle, 250) : null,
        changeSummary: sanitizePlainText(entry.changeSummary, 1000),
        details: entry.details ? JSON.parse(JSON.stringify(entry.details)) : undefined,
        ipAddress: entry.ipAddress || null,
      },
    });
  } catch (e) {
    console.error('Failed to write audit log to DB:', e);
  }
}

/**
 * Fetches audit logs with optional filtering. Strictly read-only.
 */
export async function getAuditLogs(options?: {
  limit?: number;
  offset?: number;
  entityType?: string;
  actionType?: string;
  userEmail?: string;
}): Promise<{ logs: AuditLogEntry[]; total: number }> {
  try {
    const where: any = {};

    if (options?.entityType) {
      where.entityType = options.entityType.toUpperCase();
    }
    if (options?.actionType) {
      where.actionType = options.actionType.toUpperCase();
    }
    if (options?.userEmail) {
      where.userEmail = { contains: options.userEmail.toLowerCase(), mode: 'insensitive' };
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 100,
        skip: options?.offset || 0,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs: logs as any, total };
  } catch (e) {
    console.error('Failed to fetch audit logs from DB:', e);
    return { logs: [], total: 0 };
  }
}
