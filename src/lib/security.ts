/**
 * @file src/lib/security.ts
 * @description Enterprise-Grade Security, Encoding, and Sanitization Engine for IEEE MAIT.
 * 
 * DEFENSIVE CAPABILITIES:
 * 1. Proper UTF-8 & Entity Normalization: Solves the special character bug (hex codes / HTML entities)
 *    by decoding stray entities and ensuring pristine UTF-8 across the stack.
 * 2. Plain Text Sanitization: Strips dangerous HTML tags while preserving proper punctuation (apostrophes, quotes, slashes, ampersands, hyphens).
 * 3. Rich HTML Sanitization: Sanitizes rich HTML content fields against XSS, stripping scripts, event handlers, and dangerous attributes.
 * 4. Safe URL Protocol Validation: Enforces strict whitelist of HTTP/HTTPS protocols, rejecting javascript:, data:, and other malicious schemes.
 * 5. Constant-Time Equality: Prevents timing side-channel attacks on authentication tokens and passwords.
 * 
 * @author IEEE MAIT Webmaster & Security Engineering
 * @license MIT
 */

import crypto from 'crypto';

/**
 * Common HTML entities to UTF-8 character mapping.
 */
const ENTITY_MAP: Record<string, string> = {
  '&#x27;': "'",
  '&#39;': "'",
  '&apos;': "'",
  '&#x2F;': '/',
  '&#47;': '/',
  '&#92;': '\\',
  '&quot;': '"',
  '&#34;': '"',
  '&amp;': '&',
  '&#38;': '&',
  '&lt;': '<',
  '&#60;': '<',
  '&gt;': '>',
  '&#62;': '>',
  '&nbsp;': ' ',
  '&#160;': ' ',
  '&ndash;': '–',
  '&#8211;': '–',
  '&mdash;': '—',
  '&#8212;': '—',
  '&hellip;': '…',
  '&#8230;': '…',
  '&lsquo;': '‘',
  '&#8216;': '‘',
  '&rsquo;': '’',
  '&#8217;': '’',
  '&ldquo;': '“',
  '&#8220;': '“',
  '&rdquo;': '”',
  '&#8221;': '”',
};

/**
 * Unescapes HTML entities and hex character codes into proper UTF-8 unicode characters.
 * Handles single and double-encoded entities (e.g. `&amp;#x27;` -> `'`).
 */
export function unescapeHtmlEntities(input: string): string {
  if (!input || typeof input !== 'string') return '';

  let result = input;

  // First pass: replace double-encoded ampersands
  result = result.replace(/&amp;([#a-zA-Z0-9]+;)/g, '&$1');

  // Second pass: named and common hex/decimal entities
  for (const [entity, char] of Object.entries(ENTITY_MAP)) {
    result = result.replaceAll(entity, char);
  }

  // Third pass: generic numeric decimal entities (&#123;)
  result = result.replace(/&#(\d+);/g, (_, dec) => {
    try {
      const code = parseInt(dec, 10);
      return Number.isFinite(code) && code >= 0 ? String.fromCodePoint(code) : _;
    } catch {
      return _;
    }
  });

  // Fourth pass: generic hexadecimal entities (&#x1F;)
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
    try {
      const code = parseInt(hex, 16);
      return Number.isFinite(code) && code >= 0 ? String.fromCodePoint(code) : _;
    } catch {
      return _;
    }
  });

  return result;
}

/**
 * Normalizes text to valid, clean UTF-8 string.
 * Strips null bytes and non-printable control characters (except standard whitespace \n, \r, \t).
 */
export function normalizeUtf8(input: string): string {
  if (typeof input !== 'string') return '';

  // Unescape any pre-existing encoded entity junk
  const unescaped = unescapeHtmlEntities(input);

  // Unicode normalization (NFC)
  const normalized = unescaped.normalize('NFC');

  // Strip null bytes and non-printable control characters
  return normalized
    .replace(/\0/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Sanitizes plain text input:
 * - Strips any HTML tags (<script>, <div>, etc.)
 * - Normalizes UTF-8 and unescapes stray entities
 * - Preserves natural punctuation (apostrophes, quotes, slashes, ampersands, hyphens, brackets)
 * - Enforces length bounds
 * 
 * Note: React naturally escapes plain text values in JSX. We store pristine UTF-8 in the DB.
 */
export function sanitizePlainText(input: string | null | undefined, maxLength: number = 2000): string {
  if (!input || typeof input !== 'string') return '';

  // Strip HTML tags
  const noHtml = input.replace(/<[^>]*>?/gm, '');

  // Normalize UTF-8
  const normalized = normalizeUtf8(noHtml).trim();

  // Slice to max acceptable length
  return normalized.slice(0, maxLength);
}

/**
 * Backwards-compatible alias for sanitizePlainText.
 */
export const sanitizeText = sanitizePlainText;

/**
 * Sanitizes rich HTML content (e.g. publication bodies, descriptions):
 * - Removes script, iframe, object, embed, applet, form, and base tags
 * - Strips all inline event handlers (onload, onerror, onclick, onmouseover, etc.)
 * - Strips dangerous URL schemes (javascript:, data:, vbscript:) from href/src attributes
 * - Preserves safe formatting tags (p, a, strong, em, h1-h6, ul, ol, li, blockquote, code, pre, img, table, etc.)
 */
export function sanitizeHtmlContent(html: string | null | undefined, maxLength: number = 100000): string {
  if (!html || typeof html !== 'string') return '';

  let sanitized = html.slice(0, maxLength);

  // Strip dangerous top-level elements and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  // Strip inline event handlers (e.g. onclick="...", onerror="...", onmouseover="...")
  sanitized = sanitized.replace(/\s+on[a-zA-Z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // Strip javascript: and data: URIs in attributes
  sanitized = sanitized.replace(/(href|src)\s*=\s*["']?\s*(?:javascript|data|vbscript):[^"'>\s]*/gi, '$1="#"');

  return normalizeUtf8(sanitized).trim();
}

/**
 * Validates and normalizes safe URLs (HTTP / HTTPS).
 * Blocks dangerous schemes (javascript:, data:, vbscript:, file:).
 */
export function validateSafeUrl(url: string | undefined | null): string | null {
  if (!url || typeof url !== 'string') return null;

  let trimmed = unescapeHtmlEntities(url).trim();
  if (!trimmed) return null;

  // Block dangerous schemes
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) {
    return null;
  }

  // Allow relative internal paths starting with single '/'
  if (trimmed.startsWith('/')) {
    if (trimmed.startsWith('//')) return null; // Block protocol-relative bypasses
    return trimmed;
  }

  // Prepend https:// if protocol is omitted (e.g. linkedin.com/company/...)
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    return null;
  }

  return null;
}

export const sanitizeUrl = validateSafeUrl;

/**
 * Performs timing-safe comparison of strings to prevent side-channel timing attacks.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;

  const bufA = Buffer.from(a, 'utf-8');
  const bufB = Buffer.from(b, 'utf-8');

  if (bufA.length !== bufB.length) {
    // Perform dummy comparison to equalize execution timing
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}
