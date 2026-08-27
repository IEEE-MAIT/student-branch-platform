import React from 'react';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa6';
import { FiExternalLink, FiArrowRight } from 'react-icons/fi';

/**
 * @file src/components/content/ProjectCard.tsx
 * @description Card component for student hardware & software projects with react-icons.
 * 
 * Displays project schematics, hardware tags, bill-of-materials summary, and repository links.
 * Used on the EDS Chapter portal, Student Branch portal, and project showcases.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

export interface ProjectCardProps {
  /** Project title */
  title: string;
  /** Slug identifier */
  slug: string;
  /** Short punchy summary */
  summary: string;
  /** Full technical description */
  description?: string | null;
  /** GitHub repository URL */
  githubUrl?: string | null;
  /** Live demo or video showcase URL */
  demoUrl?: string | null;
  /** Project cover photo or schematic render URL */
  coverImage?: string | null;
  /** Project completion or active year */
  year: string;
  /** Technology, hardware & tool tags */
  tags?: string[];
  /** Accent color hex override */
  accentColor?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  slug,
  summary,
  description,
  githubUrl,
  demoUrl,
  coverImage,
  year,
  tags = [],
  accentColor,
}) => {
  return (
    <div 
      className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-6 flex flex-col justify-between space-y-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-ieee-blue/40 dark:hover:border-sky-500/40 group"
      style={accentColor ? { borderTopColor: accentColor, borderTopWidth: '3px' } : undefined}
    >
      <div className="space-y-4">
        {/* Top Header: Year Badge & Tag Strip */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 bg-ieee-subtle dark:bg-sky-950 px-2.5 py-0.5 rounded-full">
            {year}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx}
                className="font-mono text-[10px] text-warm-500 dark:text-gray-400 bg-warm-100/80 dark:bg-gray-800 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Optional Cover Image / Schematic render */}
        {coverImage && (
          <div className="relative w-full h-44 bg-warm-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Title & Summary */}
        <div>
          <Link href={`/projects/${slug}`}>
            <h3 className="font-serif text-xl font-normal text-ink dark:text-gray-100 group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors leading-snug">
              {title}
            </h3>
          </Link>
          <p className="text-xs text-warm-500 dark:text-gray-400 font-sans leading-relaxed mt-2 line-clamp-3">
            {summary || description}
          </p>
        </div>
      </div>

      {/* Footer Links (GitHub, Demo) */}
      <div className="pt-4 border-t border-warm-200 dark:border-gray-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-warm-500 dark:text-gray-400 hover:text-ink dark:hover:text-white transition-colors font-medium"
              aria-label={`View ${title} source code on GitHub`}
            >
              <FaGithub className="w-3.5 h-3.5" />
              <span>Repository</span>
            </a>
          )}
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-ieee-blue dark:text-sky-400 hover:underline font-medium"
            >
              <span>Demo Video</span>
              <FiExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <Link
          href={`/projects/${slug}`}
          className="font-mono text-[11px] text-ieee-blue dark:text-sky-400 font-bold hover:underline uppercase flex items-center gap-1"
        >
          <span>Case Study</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
