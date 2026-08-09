/**
 * @file src/lib/officers.ts
 * @description Officer User Directory & Authentication Store for IEEE MAIT.
 * 
 * Connected to Neon PostgreSQL database via Prisma ORM.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import { timingSafeEqual, sanitizeText } from './security';
import { PersonCategory } from './data';
import { prisma } from './db';

export interface OfficerUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string | null;
  category: string | null;
  createdAt: string | null;
  createdBy: string | null;
}

export const OFFICERS_STORE = [
  {
    id: 'usr-super-admin-01',
    name: 'Super Admin Officer',
    email: 'mait.ieee.sb@gmail.com',
    password: 'Admin@2026',
    role: 'Super Admin',
    category: PersonCategory.SEC,
    createdAt: new Date().toISOString(),
    createdBy: 'System Root',
  }
];

export async function authenticateOfficer(emailInput: string, passwordInput: string): Promise<OfficerUser | null> {
  if (!emailInput || !passwordInput) return null;

  const normalizedEmail = emailInput.trim().toLowerCase();
  
  try {
    const officer = await prisma.officer.findUnique({ where: { email: normalizedEmail } });
    if (!officer) return null;
    
    // Timing-safe password check
    const isMatch = timingSafeEqual(officer.password, passwordInput);
    if (isMatch) {
      return officer;
    }
  } catch (e) {
    console.error('DB error authenticating officer', e);
  }
  return null;
}

export async function createOfficer(
  name: string,
  email: string,
  passwordInput: string,
  role: string,
  category: string,
  creatorEmail: string
): Promise<{ success: boolean; officer?: OfficerUser; error?: string }> {
  try {
    const creator = await prisma.officer.findUnique({ where: { email: creatorEmail.toLowerCase() } });
    if (!creator || creator.role !== 'Super Admin') {
      return { success: false, error: 'Access Denied: Only Super Admin can register new officers.' };
    }

    if (!email || !passwordInput || !name) {
      return { success: false, error: 'Name, email, and password are required.' };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await prisma.officer.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return { success: false, error: 'An officer with this email address already exists.' };
    }

    if (passwordInput.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const safeName = sanitizeText(name, 100);
    const createdAt = new Date().toISOString();

    const newOfficer = await prisma.officer.create({
      data: {
        name: safeName,
        email: normalizedEmail,
        password: passwordInput,
        role: role,
        category: category,
        createdAt: createdAt,
        createdBy: creatorEmail,
      }
    });

    return { 
      success: true, 
      officer: newOfficer
    };
  } catch (e) {
    return { success: false, error: 'Database error creating officer.' };
  }
}

export async function getSafeOfficersList(): Promise<Omit<OfficerUser, 'password'>[]> {
  try {
    const officers = await prisma.officer.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        category: true,
        createdAt: true,
        createdBy: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return officers;
  } catch (e) {
    return [];
  }
}
