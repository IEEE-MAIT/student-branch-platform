// @ts-nocheck
/**
 * @file scripts/seed-rbac.ts
 * @description Seeds standard RBAC Roles, bootstrap Admin Users, Social Links, SIGs, and Site Settings.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { ROLE_DEFAULT_PERMISSIONS } from '../src/lib/permissions';

dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config({ path: resolve(process.cwd(), '.dev.vars') });

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URI || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('FATAL ERROR: DIRECT_URL, DATABASE_URI or DATABASE_URL is not set in environment.');
  process.exit(1);
}

const pool = new Pool({ connectionString });

export async function seedRbacAndCoreData() {
  console.log('Connecting to Neon PostgreSQL to seed RBAC roles, accounts, and core settings...');
  const client = await pool.connect();

  try {
    // 1. Seed 7 standard RBAC Roles
    console.log('--- 1. Seeding 7 Standard RBAC Roles ---');
    const roleDescriptions: Record<string, string> = {
      'Super Admin': 'Full administrative access across all system modules, user/role management, and system settings.',
      Admin: 'Full access across content modules; read-only access to audit logs and settings.',
      'Event Manager': 'Create, edit, manage, and publish events, galleries, and event resources.',
      'PR/Media': 'Full access to publications, galleries, banners, and social links.',
      'SIG Lead': 'Manage assigned Special Interest Groups (SIGs), projects, and technical activities.',
      'Content Editor': 'Draft, review, and edit technical articles, opportunities, and learning resources.',
      Viewer: 'Read-only access across public administrative modules.',
    };

    for (const [roleName, permissions] of Object.entries(ROLE_DEFAULT_PERMISSIONS)) {
      const existing = await client.query(`SELECT id FROM admin_roles WHERE name = $1;`, [roleName]);
      if (existing.rows.length === 0) {
        await client.query(
          `INSERT INTO admin_roles (id, name, description, permissions, "isSystem", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`,
          [`role-${roleName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`, roleName, roleDescriptions[roleName] || `${roleName} Role`, JSON.stringify(permissions)]
        );
        console.log(`Created built-in role: ${roleName}`);
      } else {
        await client.query(
          `UPDATE admin_roles SET permissions = $1, description = $2, "isSystem" = true WHERE name = $3;`,
          [JSON.stringify(permissions), roleDescriptions[roleName] || `${roleName} Role`, roleName]
        );
        console.log(`Updated permissions for role: ${roleName}`);
      }
    }

    // 2. Migrate existing officers to AdminUser and ensure Super Admin account exists
    console.log('--- 2. Seeding & Migrating Admin Users ---');
    const superAdminRoleRes = await client.query(`SELECT id FROM admin_roles WHERE name = 'Super Admin';`);
    const superAdminRoleId = superAdminRoleRes.rows[0]?.id;

    // Check if Super Admin exists in admin_users
    const defaultSuperAdminEmail = 'mait.ieee.sb@gmail.com';
    const existingAdmin = await client.query(`SELECT id FROM admin_users WHERE email = $1;`, [defaultSuperAdminEmail]);

    if (existingAdmin.rows.length === 0) {
      await client.query(
        `INSERT INTO admin_users (id, name, email, password, "roleId", "isActive", "createdAt", "updatedAt", "createdBy")
         VALUES ($1, $2, $3, $4, $5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'System Bootstrap');`,
        ['usr-super-admin-01', 'Super Admin Officer', defaultSuperAdminEmail, 'Admin@2026', superAdminRoleId]
      );
      console.log(`Created bootstrap Super Admin user: ${defaultSuperAdminEmail}`);
    }

    // Migrate any legacy officers into admin_users
    const legacyOfficers = await client.query(`SELECT id, name, email, password, role FROM officers;`);
    for (const off of legacyOfficers.rows) {
      const existsInAdmin = await client.query(`SELECT id FROM admin_users WHERE email = $1;`, [off.email]);
      if (existsInAdmin.rows.length === 0) {
        const targetRole = off.role || 'Admin';
        const roleRes = await client.query(`SELECT id FROM admin_roles WHERE name ILIKE $1;`, [targetRole]);
        const roleId = roleRes.rows[0]?.id || superAdminRoleId;

        await client.query(
          `INSERT INTO admin_users (id, name, email, password, "roleId", "isActive", "createdAt", "updatedAt", "createdBy")
           VALUES ($1, $2, $3, $4, $5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Officer Migration');`,
          [off.id, off.name, off.email, off.password, roleId]
        );
        console.log(`Migrated legacy officer ${off.email} to AdminUser.`);
      }
    }

    // 3. Seed Official Social Accounts
    console.log('--- 3. Seeding Official Social Accounts ---');
    const officialSocialLinks = [
      {
        entity: 'IEEE MAIT Student Branch',
        platform: 'LinkedIn',
        url: 'https://www.linkedin.com/company/ieee-mait',
        handle: 'ieee-mait',
        sortOrder: 1,
      },
      {
        entity: 'IEEE MAIT Student Branch',
        platform: 'Instagram',
        url: 'https://www.instagram.com/ieeemait/',
        handle: '@ieeemait',
        sortOrder: 2,
      },
      {
        entity: 'IEEE MAIT Student Branch',
        platform: 'X',
        url: 'https://x.com/IEEE_MAIT',
        handle: '@IEEE_MAIT',
        sortOrder: 3,
      },
      {
        entity: 'WIE AG MAIT',
        platform: 'Instagram',
        url: 'https://www.instagram.com/wie.mait/',
        handle: '@wie.mait',
        sortOrder: 4,
      },
      {
        entity: 'IEEE EDS MAIT',
        platform: 'Instagram',
        url: 'https://www.instagram.com/ieee_eds_mait_official/',
        handle: '@ieee_eds_mait_official',
        sortOrder: 5,
      },
    ];

    for (const link of officialSocialLinks) {
      const existingLink = await client.query(
        `SELECT id FROM social_links WHERE url = $1;`,
        [link.url]
      );
      if (existingLink.rows.length === 0) {
        await client.query(
          `INSERT INTO social_links (id, entity, platform, url, handle, "isActive", "sortOrder", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, true, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`,
          [`link-${link.platform.toLowerCase()}-${link.sortOrder}`, link.entity, link.platform, link.url, link.handle, link.sortOrder]
        );
        console.log(`Seeded official social account: ${link.entity} (${link.platform})`);
      }
    }

    // 4. Seed Standard SIGs (Special Interest Groups)
    console.log('--- 4. Seeding Standard SIGs ---');
    const sigs = [
      {
        id: 'sig-dsa',
        name: 'Data Structures & Algorithms (DSA)',
        slug: 'dsa',
        description: 'Mastering algorithmic problem solving, competitive programming, and technical interview preparation.',
        accentColor: '#0284C7',
      },
      {
        id: 'sig-dev',
        name: 'Software & Web Development',
        slug: 'development',
        description: 'Building modern full-stack web applications, open-source projects, and decentralized systems.',
        accentColor: '#10B981',
      },
      {
        id: 'sig-ai-ml',
        name: 'Artificial Intelligence & Machine Learning',
        slug: 'ai-ml',
        description: 'Researching neural networks, deep learning, NLP, computer vision, and predictive intelligence.',
        accentColor: '#8B5CF6',
      },
      {
        id: 'sig-hardware',
        name: 'Hardware, Embedded Systems & IoT',
        slug: 'hardware',
        description: 'Hands-on PCB design, microcontroller architecture, robotics, and smart IoT sensor systems.',
        accentColor: '#F59E0B',
      },
    ];

    for (const sig of sigs) {
      const existingSig = await client.query(`SELECT id FROM sigs WHERE slug = $1;`, [sig.slug]);
      if (existingSig.rows.length === 0) {
        await client.query(
          `INSERT INTO sigs (id, name, slug, description, "accentColor", "memberCount", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`,
          [sig.id, sig.name, sig.slug, sig.description, sig.accentColor]
        );
        console.log(`Seeded SIG: ${sig.name}`);
      }
    }

    // 5. Seed Site Settings
    console.log('--- 5. Seeding Default Site Settings ---');
    await client.query(`
      INSERT INTO site_settings (id, "announcementMessage", "announcementLinkText", "announcementLinkHref", "announcementActive", "donateUrl", "recycleBinRetentionDays")
      VALUES (
        'global',
        'Membership Drive 2025–26 is officially open! Join 150+ students advancing technology at MAIT.',
        'Register Now →',
        '/join',
        true,
        'https://www.ieee.org/membership/join/index.html',
        30
      )
      ON CONFLICT (id) DO UPDATE SET
        "donateUrl" = COALESCE(site_settings."donateUrl", EXCLUDED."donateUrl"),
        "recycleBinRetentionDays" = COALESCE(site_settings."recycleBinRetentionDays", EXCLUDED."recycleBinRetentionDays");
    `);

    console.log('✅ RBAC and Core Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding RBAC data:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  seedRbacAndCoreData();
}
