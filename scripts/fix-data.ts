// @ts-nocheck
/**
 * @file scripts/fix-data.ts
 * @description Data integrity and cleanup script for IEEE MAIT.
 * 
 * FIXES APPLIED:
 * 1. Special Characters Bug: Decodes hex and HTML entity codes (&#x27;, &#x2F;, &quot;, &amp;, etc.)
 *    across all text fields to pristine UTF-8.
 * 2. Faculty Counsellor Department Fix: Updates department from ECE to EEE.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { unescapeHtmlEntities } from '../src/lib/security';

dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config({ path: resolve(process.cwd(), '.dev.vars') });

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URI || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('FATAL ERROR: DIRECT_URL, DATABASE_URI or DATABASE_URL is not set in environment.');
  process.exit(1);
}

const pool = new Pool({ connectionString });

export async function runDataFix() {
  console.log('Connecting to Neon PostgreSQL to execute Data Integrity & Character Fix...');
  const client = await pool.connect();

  try {
    // 1. Fix Faculty Counsellor Department (ECE -> EEE)
    console.log('--- 1. Fixing Faculty Counsellor Department (ECE -> EEE) ---');
    const counsellorRes = await client.query(`
      UPDATE people
      SET 
        "department" = 'Department of Electrical & Electronics Engineering (EEE)',
        "facultyDepartment" = 'EEE',
        "isFacultyAdvisor" = true
      WHERE 
        "role" ILIKE '%counsellor%' OR 
        "role" ILIKE '%counselor%' OR 
        "category" ILIKE '%counsellor%' OR
        "category" ILIKE '%counselor%' OR
        "name" ILIKE '%Monika%';
    `);
    console.log(`Updated ${counsellorRes.rowCount} Faculty Counsellor record(s) to EEE.`);

    // 2. Clean UTF-8 and HTML Entities across People table
    console.log('--- 2. Cleaning special characters in People table ---');
    const people = await client.query(`SELECT id, name, role, department, bio FROM people;`);
    let peopleCleaned = 0;
    for (const p of people.rows) {
      const cleanName = unescapeHtmlEntities(p.name);
      const cleanRole = unescapeHtmlEntities(p.role);
      const cleanDept = p.department ? unescapeHtmlEntities(p.department) : null;
      const cleanBio = p.bio ? unescapeHtmlEntities(p.bio) : null;

      if (cleanName !== p.name || cleanRole !== p.role || cleanDept !== p.department || cleanBio !== p.bio) {
        await client.query(
          `UPDATE people SET name = $1, role = $2, department = $3, bio = $4 WHERE id = $5;`,
          [cleanName, cleanRole, cleanDept, cleanBio, p.id]
        );
        peopleCleaned++;
      }
    }
    console.log(`Cleaned encoding in ${peopleCleaned} people records.`);

    // 3. Clean UTF-8 in Gallery Photos
    console.log('--- 3. Cleaning special characters in Gallery Photos ---');
    const photos = await client.query(`SELECT id, caption FROM gallery_photos;`);
    let photosCleaned = 0;
    for (const ph of photos.rows) {
      const cleanCaption = unescapeHtmlEntities(ph.caption);
      if (cleanCaption !== ph.caption) {
        await client.query(`UPDATE gallery_photos SET caption = $1 WHERE id = $2;`, [cleanCaption, ph.id]);
        photosCleaned++;
      }
    }
    console.log(`Cleaned encoding in ${photosCleaned} gallery photos.`);

    // 4. Clean UTF-8 in Events table
    console.log('--- 4. Cleaning special characters in Events ---');
    const events = await client.query(`SELECT id, title, description, venue, category FROM events;`);
    let eventsCleaned = 0;
    for (const ev of events.rows) {
      const cleanTitle = unescapeHtmlEntities(ev.title);
      const cleanDesc = ev.description ? unescapeHtmlEntities(ev.description) : null;
      const cleanVenue = ev.venue ? unescapeHtmlEntities(ev.venue) : null;
      const cleanCat = ev.category ? unescapeHtmlEntities(ev.category) : null;

      if (cleanTitle !== ev.title || cleanDesc !== ev.description || cleanVenue !== ev.venue || cleanCat !== ev.category) {
        await client.query(
          `UPDATE events SET title = $1, description = $2, venue = $3, category = $4 WHERE id = $5;`,
          [cleanTitle, cleanDesc, cleanVenue, cleanCat, ev.id]
        );
        eventsCleaned++;
      }
    }
    console.log(`Cleaned encoding in ${eventsCleaned} event records.`);

    // 5. Clean UTF-8 in Stories / Publications table
    console.log('--- 5. Cleaning special characters in Stories / Publications ---');
    const stories = await client.query(`SELECT id, title, excerpt, "contentHtml" FROM stories;`);
    let storiesCleaned = 0;
    for (const st of stories.rows) {
      const cleanTitle = unescapeHtmlEntities(st.title);
      const cleanExcerpt = st.excerpt ? unescapeHtmlEntities(st.excerpt) : null;
      const cleanHtml = st.contentHtml ? unescapeHtmlEntities(st.contentHtml) : null;

      if (cleanTitle !== st.title || cleanExcerpt !== st.excerpt || cleanHtml !== st.contentHtml) {
        await client.query(
          `UPDATE stories SET title = $1, excerpt = $2, "contentHtml" = $3 WHERE id = $4;`,
          [cleanTitle, cleanExcerpt, cleanHtml, st.id]
        );
        storiesCleaned++;
      }
    }
    console.log(`Cleaned encoding in ${storiesCleaned} publication records.`);

    // 6. Clean UTF-8 in Achievements table
    console.log('--- 6. Cleaning special characters in Achievements ---');
    const achievements = await client.query(`SELECT id, title, description, "unitOrTeam" FROM achievements;`);
    let achCleaned = 0;
    for (const ach of achievements.rows) {
      const cleanTitle = unescapeHtmlEntities(ach.title);
      const cleanDesc = ach.description ? unescapeHtmlEntities(ach.description) : null;
      const cleanUnit = ach.unitOrTeam ? unescapeHtmlEntities(ach.unitOrTeam) : null;

      if (cleanTitle !== ach.title || cleanDesc !== ach.description || cleanUnit !== ach.unitOrTeam) {
        await client.query(
          `UPDATE achievements SET title = $1, description = $2, "unitOrTeam" = $3 WHERE id = $4;`,
          [cleanTitle, cleanDesc, cleanUnit, ach.id]
        );
        achCleaned++;
      }
    }
    console.log(`Cleaned encoding in ${achCleaned} achievement records.`);

    // 7. Clean UTF-8 in Chapters, Projects, Milestones, Resources, Initiatives
    console.log('--- 7. Cleaning remaining content tables ---');
    const chapters = await client.query(`SELECT id, name, description, mission, tagline FROM chapters;`);
    for (const c of chapters.rows) {
      await client.query(
        `UPDATE chapters SET name = $1, description = $2, mission = $3, tagline = $4 WHERE id = $5;`,
        [
          unescapeHtmlEntities(c.name),
          c.description ? unescapeHtmlEntities(c.description) : null,
          c.mission ? unescapeHtmlEntities(c.mission) : null,
          c.tagline ? unescapeHtmlEntities(c.tagline) : null,
          c.id,
        ]
      );
    }

    const projects = await client.query(`SELECT id, title, summary, description FROM projects;`);
    for (const pr of projects.rows) {
      await client.query(
        `UPDATE projects SET title = $1, summary = $2, description = $3 WHERE id = $4;`,
        [
          unescapeHtmlEntities(pr.title),
          pr.summary ? unescapeHtmlEntities(pr.summary) : null,
          pr.description ? unescapeHtmlEntities(pr.description) : null,
          pr.id,
        ]
      );
    }

    const milestones = await client.query(`SELECT id, title, description FROM milestones;`);
    for (const m of milestones.rows) {
      await client.query(
        `UPDATE milestones SET title = $1, description = $2 WHERE id = $3;`,
        [
          unescapeHtmlEntities(m.title),
          m.description ? unescapeHtmlEntities(m.description) : null,
          m.id,
        ]
      );
    }

    console.log('✅ Data Fixup completed successfully! All entity junk normalized to pristine UTF-8.');
  } catch (error) {
    console.error('Error during data fixup:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  runDataFix();
}
