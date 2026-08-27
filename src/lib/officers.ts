/**
 * @file src/lib/officers.ts
 * @description Admin User Directory, Role Resolution & Authentication Store for IEEE MAIT.
 * 
 * Supports both modern `AdminUser + AdminRole` architecture and backward-compatible `Officer` fallback.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import { timingSafeEqual, sanitizePlainText } from './security';
import { prisma } from './db';
import { ROLE_DEFAULT_PERMISSIONS, PermissionMatrix, normalizeRoleName } from './permissions';

export interface AuthenticatedAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
  roleId?: string | null;
  category?: string | null;
  permissions?: PermissionMatrix;
  customPermissions?: PermissionMatrix | null;
  createdAt?: string | Date | null;
  createdBy?: string | null;
}

export const SUPER_ADMIN_FALLBACK = {
  id: 'usr-super-admin-01',
  name: 'Super Admin Officer',
  email: 'mait.ieee.sb@gmail.com',
  password: 'Admin@2026',
  role: 'Super Admin',
  category: 'Senior Executive Committee',
  createdAt: new Date().toISOString(),
  createdBy: 'System Root',
};

/**
 * Authenticates an admin user by email and password.
 * Checks `admin_users` table with fallback to `officers` table and hardcoded root fallback.
 */
export async function authenticateOfficer(
  emailInput: string,
  passwordInput: string
): Promise<AuthenticatedAdmin | null> {
  if (!emailInput || !passwordInput) return null;

  const normalizedEmail = emailInput.trim().toLowerCase();

  try {
    // 1. Try modern AdminUser table first
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
      include: { role: true },
    });

    if (adminUser && adminUser.isActive) {
      const isMatch = timingSafeEqual(adminUser.password, passwordInput);
      if (isMatch) {
        // Update last login timestamp asynchronously
        prisma.adminUser
          .update({
            where: { id: adminUser.id },
            data: { lastLoginAt: new Date() },
          })
          .catch(() => {});

        const rawRoleName = adminUser.role?.name || 'Admin';
        const roleName = normalizeRoleName(rawRoleName);
        const rolePermissions = (adminUser.role?.permissions as PermissionMatrix) || ROLE_DEFAULT_PERMISSIONS[roleName];

        return {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          role: roleName,
          roleId: adminUser.roleId,
          permissions: rolePermissions,
          customPermissions: adminUser.customPermissions as PermissionMatrix | null,
          createdAt: adminUser.createdAt,
          createdBy: adminUser.createdBy,
        };
      }
    }

    // 2. Fallback to legacy Officer table
    const legacyOfficer = await prisma.officer.findUnique({
      where: { email: normalizedEmail },
    });

    if (legacyOfficer) {
      const isMatch = timingSafeEqual(legacyOfficer.password, passwordInput);
      if (isMatch) {
        const rawRoleName = legacyOfficer.role || 'Super Admin';
        const roleName = normalizeRoleName(rawRoleName);
        return {
          id: legacyOfficer.id,
          name: legacyOfficer.name,
          email: legacyOfficer.email,
          role: roleName,
          category: legacyOfficer.category,
          permissions: ROLE_DEFAULT_PERMISSIONS[roleName] || ROLE_DEFAULT_PERMISSIONS['Admin'],
          customPermissions: null,
          createdAt: legacyOfficer.createdAt,
          createdBy: legacyOfficer.createdBy,
        };
      }
    }

    // 3. Fallback to Super Admin bootstrap credential if DB is fresh
    if (normalizedEmail === SUPER_ADMIN_FALLBACK.email) {
      const isMatch = timingSafeEqual(SUPER_ADMIN_FALLBACK.password, passwordInput);
      if (isMatch) {
        return {
          id: SUPER_ADMIN_FALLBACK.id,
          name: SUPER_ADMIN_FALLBACK.name,
          email: SUPER_ADMIN_FALLBACK.email,
          role: SUPER_ADMIN_FALLBACK.role,
          category: SUPER_ADMIN_FALLBACK.category,
          permissions: ROLE_DEFAULT_PERMISSIONS['Super Admin'],
          customPermissions: null,
          createdAt: SUPER_ADMIN_FALLBACK.createdAt,
          createdBy: SUPER_ADMIN_FALLBACK.createdBy,
        };
      }
    }
  } catch (e) {
    console.error('DB error authenticating admin:', e);
  }

  return null;
}

/**
 * Creates a new officer / admin user. Requires Super Admin permission.
 */
export async function createOfficer(
  name: string,
  email: string,
  passwordInput: string,
  role: string,
  category: string,
  creatorEmail: string
): Promise<{ success: boolean; officer?: AuthenticatedAdmin; error?: string }> {
  try {
    if (!email || !passwordInput || !name) {
      return { success: false, error: 'Name, email, and password are required.' };
    }

    if (passwordInput.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const [existingAdmin, existingOfficer] = await Promise.all([
      prisma.adminUser.findUnique({ where: { email: normalizedEmail } }),
      prisma.officer.findUnique({ where: { email: normalizedEmail } }),
    ]);

    if (existingAdmin || existingOfficer) {
      return { success: false, error: 'An admin user with this email address already exists.' };
    }

    const safeName = sanitizePlainText(name, 100);
    const normalizedRole = normalizeRoleName(role);

    // Find or create matching AdminRole
    let dbRole = await prisma.adminRole.findUnique({ where: { name: normalizedRole } });
    if (!dbRole) {
      dbRole = await prisma.adminRole.create({
        data: {
          name: normalizedRole,
          description: `${normalizedRole} Role`,
          permissions: (ROLE_DEFAULT_PERMISSIONS[normalizedRole] || ROLE_DEFAULT_PERMISSIONS['Viewer']) as any,
          isSystem: ['Super Admin', 'Admin', 'Event Manager', 'PR/Media', 'SIG Lead', 'Content Editor', 'Viewer'].includes(normalizedRole),
        },
      });
    }

    // Create AdminUser
    const newAdmin = await prisma.adminUser.create({
      data: {
        name: safeName,
        email: normalizedEmail,
        password: passwordInput,
        roleId: dbRole.id,
        isActive: true,
        createdBy: creatorEmail,
      },
      include: { role: true },
    });

    // Also mirror to legacy Officer table for full backward compatibility
    await prisma.officer.create({
      data: {
        name: safeName,
        email: normalizedEmail,
        password: passwordInput,
        role: normalizedRole,
        category: category,
        createdAt: new Date().toISOString(),
        createdBy: creatorEmail,
      },
    }).catch(() => {});

    return {
      success: true,
      officer: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: dbRole.name,
        roleId: dbRole.id,
        permissions: (dbRole.permissions as PermissionMatrix) || ROLE_DEFAULT_PERMISSIONS[dbRole.name],
        createdAt: newAdmin.createdAt,
        createdBy: newAdmin.createdBy,
      },
    };
  } catch (e: any) {
    console.error('Database error creating admin user:', e);
    return { success: false, error: e.message || 'Database error creating admin user.' };
  }
}

/**
 * Returns safe list of admin users (excluding passwords).
 */
export async function getSafeOfficersList(): Promise<AuthenticatedAdmin[]> {
  try {
    const adminUsers = await prisma.adminUser.findMany({
      include: { role: true },
      orderBy: { createdAt: 'desc' },
    });

    if (adminUsers.length > 0) {
      return adminUsers.map((u: any) => {
        const roleName = normalizeRoleName(u.role?.name || 'Admin');
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: roleName,
          roleId: u.roleId,
          permissions: (u.role?.permissions as PermissionMatrix) || ROLE_DEFAULT_PERMISSIONS[roleName],
          customPermissions: u.customPermissions as PermissionMatrix | null,
          createdAt: u.createdAt,
          createdBy: u.createdBy,
        };
      });
    }

    // Fallback to legacy officers table if AdminUsers table is empty
    const officers = await prisma.officer.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return officers.map((o: any) => {
      const roleName = normalizeRoleName(o.role || 'Super Admin');
      return {
        id: o.id,
        name: o.name,
        email: o.email,
        role: roleName,
        category: o.category,
        permissions: ROLE_DEFAULT_PERMISSIONS[roleName] || ROLE_DEFAULT_PERMISSIONS['Super Admin'],
        customPermissions: null,
        createdAt: o.createdAt,
        createdBy: o.createdBy,
      };
    });
  } catch (e) {
    console.error('Failed to get safe officers list:', e);
    return [];
  }
}
