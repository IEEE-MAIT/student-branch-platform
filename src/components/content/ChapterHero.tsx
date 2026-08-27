import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { ChapterSocialLinks } from './ChapterSocialLinks';
import { FiArrowRight } from 'react-icons/fi';

interface ChapterHeroProps {
  name: string;
  slug: string;
  type: string;
  parentSociety?: string | null;
  establishedYear?: string | null;
  tagline?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  accentColor?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
}

export const ChapterHero: React.FC<ChapterHeroProps> = ({
  name,
  slug,
  type,
  parentSociety,
  establishedYear,
  tagline,
  logoUrl,
  coverImageUrl,
  accentColor,
  instagramUrl,
  linkedinUrl,
  githubUrl,
}) => {
  const isAffinityGroup = type.toLowerCase().includes('affinity') || slug === 'wie';
  const normSlug = slug.toLowerCase().trim();

  const lightLogo =
    normSlug === 'eds'
      ? '/eds_mait_sb_light_mode_logo.png'
      : normSlug === 'wie'
      ? '/wie_mait_light_mode_logo.png'
      : normSlug === 'sb'
      ? '/ieee_mait_sb_light_mode_logo.png'
      : logoUrl;

  const darkLogo =
    normSlug === 'eds'
      ? '/eds_mait_sb_dark_mode_logo.png'
      : normSlug === 'wie'
      ? '/wie_mait_dark_mode_logo.png'
      : normSlug === 'sb'
      ? '/ieee_mait_sb_dark_mode_logo.png'
      : lightLogo;

  return (
    <section className="relative border-b border-warm-200 dark:border-gray-800 bg-warm-100/50 dark:bg-gray-900/40 py-12 sm:py-16 overflow-hidden">
      {/* Background Cover Image if available */}
      {coverImageUrl && (
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <Image
            src={coverImageUrl}
            alt={`${name} cover`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <Container size="default" className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            {/* Meta Category & Society Label */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`font-mono text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded-[2px] ${
                  isAffinityGroup
                    ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'bg-ieee-subtle dark:bg-sky-950 text-ieee-blue dark:text-sky-400 border border-ieee-blue/20 dark:border-sky-800'
                }`}
              >
                {normSlug === 'sb' ? 'Student Branch' : type}
              </span>
              {parentSociety && (
                <span className="font-mono text-xs text-warm-400 dark:text-gray-400">
                  Affiliated with <strong className="text-ink dark:text-gray-200 font-semibold">{parentSociety}</strong>
                </span>
              )}
              {establishedYear && (
                <span className="font-mono text-xs text-warm-300 dark:text-gray-500">
                  · Est. {establishedYear}
                </span>
              )}
            </div>

            {/* Logo and/or Heading */}
            <div className="space-y-2">
              {lightLogo ? (
                <div className="py-2 flex items-center">
                  <Image
                    src={lightLogo}
                    alt={`${name} Logo`}
                    width={320}
                    height={100}
                    className="w-auto max-h-20 object-contain dark:hidden"
                    unoptimized={lightLogo.startsWith('/')}
                    priority
                  />
                  {darkLogo && (
                    <Image
                      src={darkLogo}
                      alt={`${name} Logo`}
                      width={320}
                      height={100}
                      className="w-auto max-h-20 object-contain hidden dark:block"
                      unoptimized={darkLogo.startsWith('/')}
                      priority
                    />
                  )}
                </div>
              ) : (
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink dark:text-gray-100 font-normal leading-[1.1] tracking-tight">
                  {name}
                </h1>
              )}

              {tagline && (
                <p className="font-mono text-sm sm:text-base text-ieee-blue font-medium uppercase tracking-wider">
                  {tagline}
                </p>
              )}
            </div>

            {/* CTA and Social Links Row */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-wrap">
              <Button href="/join" variant="primary" size="md" className="flex items-center gap-1.5">
                <span>Join {isAffinityGroup ? 'WIE Affinity Group' : name}</span>
                <FiArrowRight className="w-4 h-4" />
              </Button>

              <ChapterSocialLinks
                instagram={instagramUrl}
                linkedin={linkedinUrl}
                github={githubUrl}
                size="md"
                className="pt-1 sm:pt-0"
              />
            </div>
          </div>

          {/* Accent Badge Bar */}
          {accentColor && (
            <div
              className="hidden lg:block w-1.5 self-stretch rounded-full"
              style={{ backgroundColor: accentColor }}
              aria-hidden="true"
            />
          )}
        </div>
      </Container>
    </section>
  );
};
