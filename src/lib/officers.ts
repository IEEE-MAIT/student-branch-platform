/**
 * @file src/lib/officers.ts
 * @description Officer User Directory & Authentication Store for IEEE MAIT.
 * 
 * SECURITY SPECIFICATIONS:
 * - Default Super Admin Account:
 *   Email: `mait.ieee.sb@gmail.com`
 *   Default Password: `Admin@2026`
 * - Restricts Officer Creation: Only logged-in Super Admin accounts can register new officers.
 * 
 * @author IEEE MAIT Webmaster & Security Engineering
 * @license MIT
 */

import { timingSafeEqual, sanitizeText } from './security';
import { PersonCategory } from './data';

export interface OfficerUser {
  id: string;
  name: string;
  email: string;
  password: string; // Plain/hashed password store
  role: 'Super Admin' | 'Executive Officer' | 'Webmaster' | 'Content Editor';
  category: PersonCategory;
  createdAt: string;
  createdBy: string;
}

// In-Memory & Database Store initialized with default Super Admin
export const OFFICERS_STORE: OfficerUser[] = [
  {
    id: 'usr-super-admin-01',
    name: 'Super Admin Officer',
    email: 'mait.ieee.sb@gmail.com',
    password: 'Admin@2026',
    role: 'Super Admin',
    category: PersonCategory.SEC,
    createdAt: new Date().toISOString(),
    createdBy: 'System Root',
  },
];

/**
 * Authenticates an officer by email and password using constant-time string comparison.
 */
export function authenticateOfficer(emailInput: string, passwordInput: string): OfficerUser | null {
  if (!emailInput || !passwordInput) return null;

  const normalizedEmail = emailInput.trim().toLowerCase();
  const officer = OFFICERS_STORE.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!officer) return null;

  // Use timing-safe comparison to prevent password timing attacks
  const isMatch = timingSafeEqual(officer.password, passwordInput);
  if (isMatch) {
    return officer;
  }

  return null;
}

/**
 * Creates a new Officer account. Strictly restricted to Super Admin officers.
 */
export function createOfficer(
  name: string,
  email: string,
  passwordInput: string,
  role: 'Executive Officer' | 'Webmaster' | 'Content Editor',
  category: PersonCategory,
  creatorEmail: string
): { success: boolean; officer?: OfficerUser; error?: string } {
  // Validate Creator Permission
  const creator = OFFICERS_STORE.find(u => u.email.toLowerCase() === creatorEmail.toLowerCase());
  if (!creator || creator.role !== 'Super Admin') {
    return { success: false, error: 'Access Denied: Only Super Admin can register new officers.' };
  }

  if (!email || !passwordInput || !name) {
    return { success: false, error: 'Name, email, and password are required.' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = OFFICERS_STORE.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return { success: false, error: 'An officer with this email address already exists.' };
  }

  if (passwordInput.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  const newOfficer: OfficerUser = {
    id: `usr-${Date.now()}`,
    name: sanitizeText(name, 100),
    email: normalizedEmail,
    password: passwordInput,
    role,
    category,
    createdAt: new Date().toISOString(),
    createdBy: creator.email,
  };

  OFFICERS_STORE.push(newOfficer);
  return { success: true, officer: newOfficer };
}

/**
 * Returns list of active officers (omitting passwords for safety).
 */
export function getSafeOfficersList(): Omit<OfficerUser, 'password'>[] {
  return OFFICERS_STORE.map(({ password, ...safe }) => safe);
}
