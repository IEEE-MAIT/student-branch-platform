/**
 * @file src/components/content/PersonCard.tsx
 * @description Modern, Minimalist & Professional Leadership Card Component for IEEE MAIT.
 * 
 * FEATURES:
 * - Strict 1:1 squarish portrait frame across all member tiers.
 * - Standardized card sizing and proportions across Mentors, Senior ExeCom, and Operational Leads.
 * - Featured branch counselor layout with slightly larger 1:1 portrait viewport.
 * - Clean, non-generic typography and calm, sophisticated neutral palette (no funky colors).
 * - Equal height flex layout aligning quotes, departments, and connect triggers along a clean baseline.
 * - High-performance React.memo memoization and optimized Next.js Image caching.
 * - WCAG AA compliant light/dark contrast.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { memo } from 'react';
import Image from 'next/image';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa6';
import { FiMail, FiCheckCircle } from 'react-icons/fi';

export interface PersonCardProps {
  /** Full name of the person */
  name: string;
  /** Designation or role */
  role: string;
  /** Academic department or branch */
  department?: string | null;
  /** Academic year term */
  academicYear?: string | null;
  /** Portrait photo image URL */
  imageSrc?: string | null;
  /** Alias for photo image URL from Prisma schema */
  imageUrl?: string | null;
  /** LinkedIn profile URL */
  linkedIn?: string | null;
  /** GitHub profile URL */
  github?: string | null;
  /** Contact email */
  email?: string | null;
  /** Short biography or personal motto */
  bio?: string | null;
  /** Category label */
  category?: string | null;
  /** Size / hierarchy scale alias */
  size?: 'mentor' | 'advisory' | 'featured' | 'operational' | 'standard' | 'compact' | string;
  /** Organizational hierarchy rank or scale alias */
  hierarchy?: 'mentor' | 'advisory' | 'featured' | 'operational' | 'standard' | 'compact' | number | string;
  /** Image loading priority for above-the-fold cards */
  priority?: boolean;
}

function formatExternalUrl(url?: string | null): string | undefined {
  if (!url || typeof url !== 'string') return undefined;
  let clean = url
    .replace(/&#x2F;/g, '/')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .trim();
  if (!clean) return undefined;
  if (/^(javascript|data|vbscript|file):/i.test(clean)) return undefined;
  if (!/^https?:\/\//i.test(clean) && !clean.startsWith('/')) {
    clean = `https://${clean}`;
  }
  return clean;
}

export const PersonCard: React.FC<PersonCardProps> = memo(({
  name,
  role,
  department,
  academicYear,
  imageSrc,
  imageUrl,
  linkedIn,
  github,
  email,
  bio,
  category,
  size,
  hierarchy = 'standard',
  priority = false,
}) => {
  const rawPhoto = imageUrl || imageSrc;
  const photo = rawPhoto && !rawPhoto.startsWith('/images/people/') ? rawPhoto : undefined;
  const scale = size || hierarchy;
  const isCounselor =
    (scale === 'mentor' || scale === 'hero') &&
    (category === 'Counsellor' ||
      category === 'Counsellor / Mentor' ||
      role.toLowerCase().includes('branch counsellor') ||
      role.toLowerCase().includes('branch counselor') ||
      role.toLowerCase().includes('counselor'));
  const isCompact = scale === 'compact';

  const formattedLinkedIn = formatExternalUrl(linkedIn);
  const formattedGithub = formatExternalUrl(github);

  // 1. Compact scale for minimalist sidebars/rosters
  if (isCompact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-warm-200/90 dark:border-gray-800 rounded-xl hover:border-warm-300 dark:hover:border-gray-700 hover:shadow-xs transition-all duration-200 w-full">
        <div className="relative w-11 h-11 shrink-0 bg-warm-100 dark:bg-gray-800 overflow-hidden rounded-lg border border-warm-200/60 dark:border-gray-700/60">
          {photo ? (
            <Image
              src={photo}
              alt={name}
              fill
              sizes="44px"
              className="object-cover"
              loading="eager"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-serif text-warm-400 dark:text-gray-400 text-base font-bold bg-warm-100 dark:bg-gray-800">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-sm text-ink dark:text-gray-100 truncate">{name}</span>
          <span className="text-[11px] text-warm-500 dark:text-gray-400 font-medium truncate">{role}</span>
          {department && <span className="text-[10px] text-warm-400 dark:text-gray-500 truncate">{department}</span>}
        </div>
      </div>
    );
  }

  // 2. Branch Faculty Counselor Layout (Hero Card with slightly larger 1:1 square photo)
  if (isCounselor) {
    return (
      <div className="border border-warm-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-7 items-start shadow-xs hover:shadow-md hover:border-warm-300 dark:hover:border-gray-700 transition-all duration-300 group max-w-3xl w-full">
        <div className="relative w-full md:w-60 sm:max-w-[240px] aspect-square rounded-xl overflow-hidden bg-warm-100 dark:bg-gray-800 shrink-0 border border-warm-200/60 dark:border-gray-700/60 shadow-xs">
          {photo ? (
            <Image
              src={photo}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 240px"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-103"
              priority={priority || true}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-warm-100 dark:bg-gray-800 text-3xl font-serif text-warm-400 dark:text-gray-400">
              {name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-warm-100 dark:bg-gray-800 text-ink dark:text-gray-200 border border-warm-200 dark:border-gray-700 font-mono text-[10px] font-semibold uppercase tracking-wider">
                <FiCheckCircle className="w-3 h-3 text-ieee-blue dark:text-sky-400" />
                <span>{role}</span>
              </span>
              <span className="font-mono text-[10px] text-warm-400 dark:text-gray-400">
                IEEE Delhi Section · Region 10
              </span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-ink dark:text-gray-100 group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors duration-200 font-normal">
              {name}
            </h3>

            {department && (
              <p className="text-xs font-sans text-warm-500 dark:text-gray-400 mt-1 font-medium">
                {department}
              </p>
            )}

            {bio && (
              <p className="text-xs leading-relaxed text-warm-600 dark:text-gray-300 font-sans mt-3">
                {bio}
              </p>
            )}
          </div>

          {(formattedLinkedIn || formattedGithub || email) && (
            <div className="pt-4 border-t border-warm-100 dark:border-gray-800 flex items-center gap-4 text-xs font-mono">
              {formattedLinkedIn && (
                <a
                  href={formattedLinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-warm-600 dark:text-gray-300 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors"
                  aria-label={`${name}'s LinkedIn`}
                >
                  <FaLinkedinIn className="w-3.5 h-3.5" />
                  <span>LinkedIn Profile</span>
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email.replace(/^mailto:/i, '')}`}
                  className="inline-flex items-center gap-1.5 text-xs text-warm-600 dark:text-gray-300 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors"
                  aria-label={`Email ${name}`}
                >
                  <FiMail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. Standard Unified Member Card: Clean, modern, 1:1 squarish frame across all student members
  return (
    <div className="bg-white dark:bg-gray-900 border border-warm-200/90 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-between space-y-3.5 shadow-2xs hover:shadow-md hover:border-warm-300 dark:hover:border-gray-700 hover:-translate-y-1 transition-all duration-300 ease-out group h-full w-full">
      <div className="space-y-3">
        {/* Role Badge + Academic Term */}
        <div className="flex items-center justify-between gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-medium tracking-wider text-warm-700 dark:text-gray-300 bg-warm-100/90 dark:bg-gray-800 border border-warm-200/80 dark:border-gray-700/80">
            {role}
          </span>
          {academicYear && (
            <span className="font-mono text-[10px] text-warm-400 dark:text-gray-400">
              {academicYear}
            </span>
          )}
        </div>

        {/* 1:1 Squarish Photo Frame */}
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-warm-100 dark:bg-gray-800 border border-warm-200/50 dark:border-gray-700/50 shrink-0">
          {photo ? (
            <Image
              src={photo}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-104"
              loading="eager"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-warm-100 dark:bg-gray-800 text-center p-4 select-none">
              <span className="font-serif text-3xl text-warm-400 dark:text-gray-500 font-normal">
                {name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </span>
            </div>
          )}
        </div>

        {/* Identity & Department */}
        <div className="space-y-0.5">
          <h3 className="font-serif text-lg text-ink dark:text-gray-100 group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors font-normal leading-snug">
            {name}
          </h3>
          {department && (
            <p className="text-[11px] text-warm-500 dark:text-gray-400 font-sans font-medium line-clamp-1">
              {department}
            </p>
          )}

          {/* Quote / Bio */}
          {bio && (
            <p className="text-xs text-warm-500 dark:text-gray-400 italic font-sans leading-relaxed line-clamp-2 pt-1">
              &ldquo;{bio}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Social & Contact Actions Bar */}
      {(formattedLinkedIn || formattedGithub || email) && (
        <div className="pt-2.5 border-t border-warm-100 dark:border-gray-800/80 flex items-center justify-between text-xs font-mono mt-auto">
          <span className="text-[9px] text-warm-400 dark:text-gray-400 uppercase tracking-widest font-medium">
            Connect
          </span>
          <div className="flex items-center gap-1.5">
            {formattedLinkedIn && (
              <a
                href={formattedLinkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6.5 h-6.5 rounded-md bg-warm-100/80 dark:bg-gray-800 hover:bg-ieee-blue hover:text-white flex items-center justify-center text-warm-500 dark:text-gray-400 transition-all duration-200 p-1.5"
                aria-label={`${name}'s LinkedIn Profile`}
                title="LinkedIn"
              >
                <FaLinkedinIn className="w-3 h-3" />
              </a>
            )}
            {formattedGithub && (
              <a
                href={formattedGithub}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6.5 h-6.5 rounded-md bg-warm-100/80 dark:bg-gray-800 hover:bg-black hover:text-white flex items-center justify-center text-warm-500 dark:text-gray-400 transition-all duration-200 p-1.5"
                aria-label={`${name}'s GitHub Profile`}
                title="GitHub"
              >
                <FaGithub className="w-3 h-3" />
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email.replace(/^mailto:/i, '')}`}
                className="w-6.5 h-6.5 rounded-md bg-warm-100/80 dark:bg-gray-800 hover:bg-ieee-blue hover:text-white flex items-center justify-center text-warm-500 dark:text-gray-400 transition-all duration-200 p-1.5"
                aria-label={`Email ${name}`}
                title="Email"
              >
                <FiMail className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

PersonCard.displayName = 'PersonCard';
