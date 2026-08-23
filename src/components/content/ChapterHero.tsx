import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { ChapterSocialLinks } from './ChapterSocialLinks';

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

  const resolvedLogo =
    logoUrl ||
    (slug === 'eds'
      ? '/eds_mait_logo.png'
      : slug === 'wie'
      ? '/wie_ag_mait_logo.png'
      : null);

  return (
    <section className="relative border-b border-warm-200 bg-warm-100/50 py-12 sm:py-16 overflow-hidden">
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
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-ieee-subtle text-ieee-blue border border-ieee-blue/20'
                }`}
              >
                {type}
              </span>
              {parentSociety && (
                <span className="font-mono text-xs text-warm-400">
                  Affiliated with <strong className="text-ink font-semibold">{parentSociety}</strong>
                </span>
              )}
              {establishedYear && (
                <span className="font-mono text-xs text-warm-300">
                  · Est. {establishedYear}
                </span>
              )}
            </div>

            {/* Logo and/or Heading */}
            <div className="space-y-2">
              {resolvedLogo ? (
                <div className="py-2 flex items-center">
                  <Image
                    src={resolvedLogo}
                    alt={`${name} Logo`}
                    width={320}
                    height={100}
                    className="w-auto max-h-20 object-contain"
                    unoptimized={resolvedLogo.startsWith('/')}
                    priority
                  />
                </div>
              ) : (
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink font-normal leading-[1.1] tracking-tight">
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
              <Button href="/join" variant="primary" size="md">
                Join {isAffinityGroup ? 'WIE Affinity Group' : name} →
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
