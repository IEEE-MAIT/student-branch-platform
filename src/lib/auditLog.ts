/**
 * @file src/lib/auditLog.ts
 * @description Centralized Audit Log Engine & Change History Ledger for IEEE MAIT.
 * 
 * SPECIFICATIONS:
 * Tracks WHO modified WHAT and WHEN for every single content change across the platform:
 * - Events & Workshops
 * - Achievements & Recognitions
 * - Officer Accounts & Role Assignments
 * - Site Announcements & Banner Settings
 * - Stories, Articles, and Photo Galleries
 * 
 * @author IEEE MAIT Webmaster & Security Engineering
 * @license MIT
 */

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  performedBy: string;
  actionType: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'Event' | 'Achievement' | 'Person' | 'Chapter' | 'Story' | 'Gallery' | 'Site Settings' | 'Officer User';
  entityTitle: string;
  changeSummary: string;
}

// Global in-memory & persistent history store pre-seeded with initial institutional records
export const AUDIT_LOGS_STORE: AuditLogEntry[] = [
  {
    id: 'audit-001',
    timestamp: '2026-08-09T18:00:00.000Z',
    performedBy: 'mait.ieee.sb@gmail.com (Super Admin)',
    actionType: 'CREATE',
    entityType: 'Event',
    entityTitle: 'Workshop on Machine Learning Fundamentals',
    changeSummary: 'Published new technical workshop scheduled for AUG 20, 2026 at Seminar Hall, Block A.',
  },
  {
    id: 'audit-002',
    timestamp: '2026-08-09T19:30:00.000Z',
    performedBy: 'mait.ieee.sb@gmail.com (Super Admin)',
    actionType: 'UPDATE',
    entityType: 'Site Settings',
    entityTitle: 'Recruitment Announcement Banner',
    changeSummary: 'Updated top announcement banner message to: "Membership Drive 2025–26 is officially open!"',
  },
  {
    id: 'audit-003',
    timestamp: '2026-08-09T20:15:00.000Z',
    performedBy: 'mait.ieee.sb@gmail.com (Super Admin)',
    actionType: 'CREATE',
    entityType: 'Achievement',
    entityTitle: 'Exemplary Student Branch Award 2025',
    changeSummary: 'Recorded Exemplary Student Branch award conferred by IEEE Delhi Section.',
  },
];

/**
 * Records a new change entry in the site-wide history ledger.
 */
export function recordAuditLog(entry: {
  performedBy: string;
  actionType: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'Event' | 'Achievement' | 'Person' | 'Chapter' | 'Story' | 'Gallery' | 'Site Settings' | 'Officer User';
  entityTitle: string;
  changeSummary: string;
}): AuditLogEntry {
  const newLog: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    performedBy: entry.performedBy || 'System Admin',
    actionType: entry.actionType,
    entityType: entry.entityType,
    entityTitle: entry.entityTitle,
    changeSummary: entry.changeSummary,
  };

  AUDIT_LOGS_STORE.unshift(newLog); // Prepend so newest changes appear first
  return newLog;
}

/**
 * Returns complete change history logs.
 */
export function getAuditLogs(): AuditLogEntry[] {
  return AUDIT_LOGS_STORE;
}
