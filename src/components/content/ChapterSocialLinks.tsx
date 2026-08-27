import React from 'react';
import { FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa6';

/**
 * Props for ChapterSocialLinks component.
 */
interface ChapterSocialLinksProps {
  /** Chapter Instagram profile URL */
  instagram?: string | null;
  /** Chapter LinkedIn page URL */
  linkedin?: string | null;
  /** Chapter GitHub organization URL */
  github?: string | null;
  /**
   * Display size:
   * - 'sm': icon-only, used inline in ChapterPanel bottom bar
   * - 'md': icon + label, used in chapter detail sidebar and hero band
   */
  size?: 'sm' | 'md';
  /** Custom CSS classes */
  className?: string;
}

/**
 * Chapter Social Media Links Component with react-icons.
 * Renders a horizontal row of social profile links for a chapter or affinity group.
 * Icon-only at 'sm' size; icon + label at 'md' size.
 */
export const ChapterSocialLinks: React.FC<ChapterSocialLinksProps> = ({
  instagram,
  linkedin,
  github,
  size = 'sm',
  className = '',
}) => {
  const hasAny = instagram || linkedin || github;
  if (!hasAny) return null;

  const iconClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const linkClass =
    size === 'sm'
      ? 'inline-flex items-center text-warm-300 dark:text-gray-400 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors duration-150'
      : 'inline-flex items-center gap-1.5 text-xs text-warm-400 dark:text-gray-400 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors duration-150 font-medium';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {instagram && (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram page for this chapter"
          className={linkClass}
        >
          <FaInstagram className={iconClass} />
          {size === 'md' && <span>Instagram</span>}
        </a>
      )}

      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn page for this chapter"
          className={linkClass}
        >
          <FaLinkedinIn className={iconClass} />
          {size === 'md' && <span>LinkedIn</span>}
        </a>
      )}

      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub organization for this chapter"
          className={linkClass}
        >
          <FaGithub className={iconClass} />
          {size === 'md' && <span>GitHub</span>}
        </a>
      )}
    </div>
  );
};
