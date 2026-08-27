// @ts-nocheck
/**
 * @file scripts/purge-recycle-bin.ts
 * @description Scheduled Cron Worker script to automatically purge expired soft-deleted records from Recycle Bin.
 * 
 * Retention Period is dynamically fetched from `site_settings.recycleBinRetentionDays` (default: 30 days).
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config({ path: resolve(process.cwd(), '.dev.vars') });

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URI || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('FATAL ERROR: DIRECT_URL, DATABASE_URI or DATABASE_URL is not set in environment.');
  process.exit(1);
}

const pool = new Pool({ connectionString });

export async function purgeExpiredRecycleBinItems() {
  console.log('Connecting to Neon PostgreSQL to purge expired Recycle Bin records...');
  const client = await pool.connect();

  try {
    // 1. Fetch configured retention days (default: 30 days)
    const settingsRes = await client.query(`SELECT "recycleBinRetentionDays" FROM site_settings WHERE id = 'global';`);
    const retentionDays = settingsRes.rows[0]?.recycleBinRetentionDays || 30;
    console.log(`Recycle Bin retention threshold: ${retentionDays} days.`);

    const tablesWithSoftDelete = [
      'events',
      'people',
      'stories',
      'galleries',
      'gallery_photos',
      'achievements',
      'projects',
      'initiatives',
      'milestones',
      'resources',
      'opportunities',
      'banners',
      'chapters',
      'sigs',
      'event_resources',
    ];

    let totalPurged = 0;
    const purgeSummary: Record<string, number> = {};

    for (const table of tablesWithSoftDelete) {
      try {
        const deleteRes = await client.query(
          `DELETE FROM ${table} 
           WHERE "deletedAt" IS NOT NULL 
           AND "deletedAt" < (CURRENT_TIMESTAMP - ($1 || ' days')::INTERVAL);`,
          [retentionDays]
        );
        const count = deleteRes.rowCount || 0;
        if (count > 0) {
          purgeSummary[table] = count;
          totalPurged += count;
          console.log(`Purged ${count} expired item(s) from table: ${table}`);
        }
      } catch (err) {
        console.warn(`Table ${table} might not have deletedAt or is empty:`, err.message);
      }
    }

    if (totalPurged > 0) {
      // Record in immutable audit log
      await client.query(
        `INSERT INTO audit_logs (id, timestamp, "performedBy", "actionType", "entityType", "entityTitle", "changeSummary", details, "createdAt")
         VALUES ($1, $2, 'Cron Worker', 'DELETE', 'RECYCLE_BIN', 'Automated Recycle Bin Purge', $3, $4, CURRENT_TIMESTAMP);`,
        [
          `audit-purge-${Date.now()}`,
          new Date().toISOString(),
          `Permanently purged ${totalPurged} expired record(s) older than ${retentionDays} days.`,
          JSON.stringify(purgeSummary),
        ]
      );
      console.log(`Recorded purge summary of ${totalPurged} items in audit log.`);
    } else {
      console.log('No expired records found in Recycle Bin.');
    }

    console.log(`✅ Recycle Bin purge completed successfully! Total purged: ${totalPurged}`);
    return { success: true, totalPurged, summary: purgeSummary };
  } catch (error) {
    console.error('Error during Recycle Bin purge:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  purgeExpiredRecycleBinItems();
}
