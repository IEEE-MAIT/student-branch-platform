/**
 * @file src/components/content/PersonCard.tsx
 * @description Hierarchical Person & Leadership Card Component for IEEE MAIT.
 * 
 * FEATURES:
 * - Supports mentor, featured executive, standard officer, and compact member scale.
 * - Displays official department, role designation, academic year badge, and bio.
 * - Provides social action links (LinkedIn, GitHub, Email) with react-icons.
 * - WCAG compliant light and dark mode contrast tokens.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React from 'react';
import Image from 'next/image';
import { Badge } from '../ui/Badge';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa6';
import { FiMail } from 'react-icons/fi';

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
                <FaLinkedinIn className="w-3.5 h-3.5" />
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
                <FaGithub className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email.replace(/^mailto:/i, '')}`}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-warm-500 dark:text-gray-400 hover:text-ink dark:hover:text-white font-medium transition-colors"
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
};
