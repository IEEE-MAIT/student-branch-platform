/**
 * @file src/lib/security.ts
 * @description Core Security & Defense Utility Module for IEEE MAIT Platform.
 * 
 * DEFENSIVE MEASURES IMPLEMENTED:
 * 1. String Sanitization & XSS Prevention: Escapes HTML tags and dangerous characters.
 * 2. URL Scheme Validation: Blocks dangerous URI protocols (e.g. `javascript:`, `data:`) allowing only `http://` and `https://`.
 * 3. Timing-Safe String Comparison: Prevents side-channel timing attacks during password/token validation.
 * 4. Input Length Boundaries: Enforces strict length limits on input fields to prevent buffer/memory exhaustion.
 * 
 * @author IEEE MAIT Webmaster & Security Engineering
 * @license MIT
 */

import crypto from 'crypto';

/**
 * Escapes HTML characters in user-provided text to eliminate XSS (Cross-Site Scripting) vulnerabilities.
 */
export function sanitizeText(input: string, maxLength: number = 2000): string {
  if (typeof input !== 'string') return '';
  
  // Truncate to maximum acceptable length to mitigate DoS / memory exhaustion
  const truncated = input.slice(0, maxLength);

  return truncated
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates and sanitizes external URLs to prevent `javascript:` and `data:` URI scheme injection attacks.
 */
export function validateSafeUrl(url: string | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Allow relative path links starting with '/'
  if (trimmed.startsWith('/')) {
    // Prevent protocol-relative URL exploits (e.g., '//attacker.com')
    if (trimmed.startsWith('//')) return null;
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    // Strictly restrict allowed protocols to http and https
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    // Invalid URL syntax
    return null;
  }

  return null;
}

/**
 * Performs timing-safe comparison of strings to prevent side-channel timing attacks.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  
  const bufA = Buffer.from(a, 'utf-8');
  const bufB = Buffer.from(b, 'utf-8');

  if (bufA.length !== bufB.length) {
    // Perform dummy comparison to keep execution timing constant
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}
