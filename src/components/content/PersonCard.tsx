/**
 * @file src/components/content/PersonCard.tsx
 * @description Hierarchical Person & Leadership Card Component for IEEE MAIT.
 * 
 * FEATURES:
 * - Supports mentor, featured executive, standard officer, and compact member scale.
 * - Displays official department, role designation, academic year badge, and bio.
 * - Provides social action links (LinkedIn, GitHub, Email) with accessible hover effects.
 * - WCAG compliant light and dark mode contrast tokens.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React from 'react';
import Image from 'next/image';
import { Badge } from '../ui/Badge';

export interface PersonCardProps {
  /** Full name of the person */
  name: string;
  /** Designation or role (e.g. 'Branch Counselor', 'Chairperson') */
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
  /** Short biography text */
  bio?: string | null;
  /** Category label (e.g. 'Senior Executive Committee', 'Counsellor / Mentor') */
  category?: string | null;
  /** Size / hierarchy scale alias */
  size?: 'mentor' | 'featured' | 'standard' | 'compact' | string;
  /** Organizational hierarchy rank or scale alias */
  hierarchy?: 'mentor' | 'featured' | 'standard' | 'compact' | number | string;
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

export const PersonCard: React.FC<PersonCardProps> = ({
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
}) => {
  const photo = imageUrl || imageSrc;
  const scale = size || hierarchy;
  const isMentor = category === 'Counsellor / Mentor' || category === 'Counsellor' || scale === 'mentor';
  const isFeatured = scale === 'featured' || scale === 1 || scale === 2;
  const isCompact = scale === 'compact';
  const formattedLinkedIn = formatExternalUrl(linkedIn);
  const formattedGithub = formatExternalUrl(github);

  if (isCompact) {
    return (
      <div className="flex items-center gap-3 p-3.5 bg-warm-50 dark:bg-gray-800/80 border border-warm-200 dark:border-gray-700 rounded-xl hover:border-ieee-blue/40 transition-colors">
        <div className="relative w-12 h-12 shrink-0 bg-warm-200 dark:bg-gray-700 overflow-hidden rounded-lg">
          {photo ? (
            <Image src={photo} alt={name} fill sizes="48px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-serif text-warm-400 dark:text-gray-400 text-lg font-bold">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-sm text-ink dark:text-gray-100 truncate">{name}</span>
          <span className="text-xs text-ieee-blue dark:text-sky-400 font-medium truncate">{role}</span>
          {department && <span className="text-[11px] text-warm-400 dark:text-gray-400 truncate">{department}</span>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl transition-all duration-300 hover:shadow-lg sm:hover:-translate-y-1 hover:border-ieee-blue/40 dark:hover:border-sky-500/40 group p-5 gap-5 ${
        isMentor ? 'flex-col sm:flex-row sm:p-7 sm:gap-7' : 'flex-col'
      }`}
    >
      {/* Portrait Photo Viewport */}
      <div
        className={`relative bg-warm-100 dark:bg-gray-800 overflow-hidden rounded-lg shrink-0 ${
          isMentor
            ? 'w-full sm:w-56 h-64 sm:h-72'
            : isFeatured
            ? 'w-full h-64 sm:h-72'
            : 'w-full h-56 sm:h-64'
        }`}
      >
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-warm-100 to-warm-200 dark:from-gray-800 dark:to-gray-900 text-center p-4">
            <span className="font-serif text-3xl sm:text-4xl text-warm-400 dark:text-gray-500 font-normal">
              {name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </span>
          </div>
        )}
      </div>

      {/* Details Column */}
      <div className="flex flex-col flex-1 min-w-0 justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <span className="font-mono text-[11px] text-ieee-blue dark:text-sky-400 font-bold uppercase tracking-wider">
              {role}
            </span>
            {academicYear && (
              <Badge variant="neutral" className="font-mono text-[10px]">
                {academicYear}
              </Badge>
            )}
          </div>

          <h3 className={`font-serif text-ink dark:text-gray-100 group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors duration-300 font-medium tracking-tight ${
            isMentor ? 'text-2xl sm:text-3xl' : isFeatured ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
          }`}>
            {name}
          </h3>

          {department && (
            <p className="text-xs text-warm-500 dark:text-gray-400 mt-1 font-sans font-medium">
              {department}
            </p>
          )}

          {bio && (
            <p className="text-xs sm:text-sm leading-relaxed text-warm-500 dark:text-gray-300 mt-3 font-sans line-clamp-3">
              {bio}
            </p>
          )}
        </div>

        {/* Social & Contact Actions */}
        {(formattedLinkedIn || formattedGithub || email) && (
          <div className="pt-4 mt-4 border-t border-warm-200 dark:border-gray-800 flex items-center gap-3.5 flex-wrap text-xs">
            {formattedLinkedIn && (
              <a
                href={formattedLinkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-ieee-blue dark:text-sky-400 hover:text-ieee-dark dark:hover:text-sky-300 font-medium transition-colors"
                aria-label={`${name}'s LinkedIn Profile`}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            )}
            {formattedGithub && (
              <a
                href={formattedGithub}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-warm-500 dark:text-gray-400 hover:text-ink dark:hover:text-white font-medium transition-colors"
                aria-label={`${name}'s GitHub Profile`}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email.replace(/^mailto:/i, '')}`}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-warm-500 dark:text-gray-400 hover:text-ink dark:hover:text-white font-medium transition-colors"
                aria-label={`Email ${name}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
