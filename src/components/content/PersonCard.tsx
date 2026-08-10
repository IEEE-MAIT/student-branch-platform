import React from 'react';
import Image from 'next/image';
import { Badge } from '../ui/Badge';

/**
 * Props for PersonCard component.
 */
interface PersonCardProps {
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
  /** LinkedIn profile URL */
  linkedIn?: string | null;
  /** Category label (e.g. 'SEC', 'Counsellor') */
  category?: string | null;
  /** Size / hierarchy scale alias */
  size?: 'mentor' | 'featured' | 'standard' | 'compact' | string;
  /** Organizational hierarchy scale: mentor, featured, standard, compact */
  hierarchy?: 'mentor' | 'featured' | 'standard' | 'compact' | string;
}

/**
 * Hierarchical Person & Leadership Card Component.
 * Encodes organizational hierarchy into visual portrait scale. Uses sharp 2px rectangular frames (never circular avatars).
 */
export const PersonCard: React.FC<PersonCardProps> = ({
  name,
  role,
  department,
  academicYear,
  imageSrc,
  linkedIn,
  category,
  size,
  hierarchy = 'standard',
}) => {
  const scale = size || hierarchy;
  const isMentor = scale === 'mentor';
  const isFeatured = scale === 'featured';
  const isCompact = scale === 'compact';

  if (isCompact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-warm-100/60 border border-warm-200 rounded-[2px]">
        <div className="relative w-12 h-12 flex-shrink-0 bg-warm-200 overflow-hidden rounded-[2px]">
          {imageSrc ? (
            <Image src={imageSrc} alt={name} fill className="object-cover" />
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
    <div className={`flex flex-col border border-warm-200 bg-white rounded-[2px] transition-shadow hover:border-warm-300 ${isMentor ? 'sm:flex-row p-6 gap-6' : 'p-4'}`}>
      <div className={`relative bg-warm-100 overflow-hidden rounded-[2px] flex-shrink-0 ${isMentor ? 'w-full sm:w-48 h-60' : isFeatured ? 'w-full h-72' : 'w-full h-56'}`}>
        {imageSrc ? (
          <Image src={imageSrc} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-warm-100 border border-dashed border-warm-300 text-center p-4">
            <span className="font-serif text-3xl text-warm-300">
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
      </div>

      <div className={`flex flex-col flex-1 justify-between ${isMentor ? 'py-2' : 'pt-4'}`}>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-mono text-xs text-ieee-blue font-semibold uppercase tracking-wider">
              {role}
            </span>
            {academicYear && <Badge variant="neutral">{academicYear}</Badge>}
          </div>

          <h3 className={`font-serif text-ink ${isMentor || isFeatured ? 'text-2xl' : 'text-xl'} font-normal`}>
            {name}
          </h3>

          {department && (
            <p className="text-xs text-warm-400 mt-1 font-sans">
              {department}
            </p>
          )}
        </div>

        {linkedIn && (
          <div className="pt-4 mt-4 border-t border-warm-200/60">
            <a
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-ieee-blue hover:text-ieee-dark transition-colors font-medium"
            >
              <span>LinkedIn Profile</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
