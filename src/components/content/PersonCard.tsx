import React from 'react';
import Image from 'next/image';
import { Badge } from '../ui/Badge';

/**
 * Props for PersonCard component matching updated Prisma Person model.
 */
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

/**
 * Hierarchical Person & Leadership Card Component.
 * Encodes organizational hierarchy into visual portrait scale. Uses sharp 2px rectangular frames.
 */
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

  if (isCompact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-warm-100/60 border border-warm-200 rounded-[2px]">
        <div className="relative w-12 h-12 flex-shrink-0 bg-warm-200 overflow-hidden rounded-[2px]">
          {photo ? (
            <Image src={photo} alt={name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-serif text-warm-400 text-lg">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-sm text-ink truncate">{name}</span>
          <span className="text-xs text-ieee-blue font-medium truncate">{role}</span>
          {department && <span className="text-[11px] text-warm-400 truncate">{department}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex border border-warm-200 bg-white rounded-[2px] transition-all duration-500 hover:shadow-xl sm:hover:-translate-y-1 hover:border-ieee-blue/30 group p-4 gap-4 ${isMentor ? 'flex-row sm:p-6 sm:gap-6' : 'flex-row sm:flex-col sm:p-5 sm:gap-0'}`}>
      <div className={`relative bg-warm-100 overflow-hidden rounded-[2px] flex-shrink-0 ${isMentor ? 'w-24 h-32 sm:w-48 sm:h-60' : isFeatured ? 'w-28 h-36 sm:w-full sm:h-72' : 'w-24 h-32 sm:w-full sm:h-64'}`}>
        {photo ? (
          <Image src={photo} alt={name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-warm-100 to-warm-200/50 border border-dashed border-warm-300 text-center p-2 sm:p-4 group-hover:border-ieee-blue/40 transition-colors duration-500">
            <span className="font-serif text-2xl sm:text-3xl text-warm-300">
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
      </div>

      <div className={`flex flex-col flex-1 min-w-0 justify-between ${isMentor ? 'py-1 sm:py-2' : 'sm:pt-5'}`}>
        <div>
          <div className="flex items-start sm:items-center justify-between gap-2 mb-1.5">
            <span className="font-mono text-[10px] sm:text-[11px] text-ieee-blue font-bold uppercase tracking-widest leading-snug">
              {role}
            </span>
            {academicYear && (
              <div className="hidden sm:block flex-shrink-0">
                <Badge variant="neutral">{academicYear}</Badge>
              </div>
            )}
          </div>

          <h3 className={`font-serif text-ink group-hover:text-ieee-blue transition-colors duration-300 ${isMentor || isFeatured ? 'text-lg sm:text-2xl' : 'text-base sm:text-xl'} font-medium tracking-tight mt-0.5 sm:mt-1 truncate sm:whitespace-normal`}>
            {name}
          </h3>

          {department && (
            <p className="text-[10px] sm:text-[11px] text-warm-500 mt-1 sm:mt-1.5 font-sans font-semibold uppercase tracking-wider truncate sm:whitespace-normal">
              {department}
            </p>
          )}

          {bio && (
            <p className="text-[12px] sm:text-[13px] leading-relaxed text-ink/75 mt-2 sm:mt-3.5 font-sans line-clamp-2 sm:line-clamp-3">
              {bio}
            </p>
          )}
        </div>

        {(linkedIn || github || email) && (
          <div className="pt-3 sm:pt-4 mt-3 sm:mt-5 border-t border-warm-200/50 flex items-center gap-3 sm:gap-4 flex-wrap opacity-100 lg:opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            {linkedIn && (
              <a
                href={linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-ieee-blue hover:text-ieee-dark transition-all duration-300 hover:-translate-y-0.5 font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-warm-500 hover:text-ink transition-all duration-300 hover:-translate-y-0.5 font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 text-xs text-warm-500 hover:text-ink transition-all duration-300 hover:-translate-y-0.5 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
