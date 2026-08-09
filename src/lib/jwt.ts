/**
 * @file src/lib/jwt.ts
 * @description Lightweight, zero-dependency Cryptographic JWT Authentication Module for IEEE MAIT.
 * 
 * SECURITY SPECIFICATIONS:
 * - Uses HMAC-SHA256 (HS256) signing algorithm via Node.js native `crypto`.
 * - Token payload contains user ID, email, role, and expiration timestamp (exp).
 * - Verifies signature and token expiration against tampering or replay attacks.
 * 
 * @author IEEE MAIT Webmaster & Security Engineering
 * @license MIT
 */

import crypto from 'crypto';
import type { Role } from './auth';

const JWT_SECRET = process.env.PAYLOAD_SECRET || 'ieee-mait-jwt-super-secret-key-2026';

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: Role | string;
  category: string;
  iat: number;
  exp: number;
}

/**
 * Encodes data to URL-safe Base64.
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Decodes URL-safe Base64 string.
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

/**
 * Generates a signed JWT token.
 */
export function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>, expiresInSeconds: number = 28800): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInSeconds; // Default: 8 Hours

  const fullPayload: JWTPayload = {
    ...payload,
    iat,
    exp,
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies a JWT token signature and checks expiration date.
 */
export function verifyJWT(token: string): JWTPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;

  // Re-calculate expected signature
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  // Perform timing-safe signature comparison to mitigate timing attacks
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);

  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null; // Invalid signature
  }

  try {
    const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null; // Expired token
    }

    return payload;
  } catch {
    return null;
  }
}
