import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PersonCard } from '@/components/content/PersonCard';
import { getDynamicAchievementById, getDynamicAchievements } from '@/lib/api';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';

export async function generateStaticParams() {
  const achievements = await getDynamicAchievements();
  return achievements.map((achievement: any) => ({
    id: achievement.id,
  }));
}

interface AchievementPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60; // ISR Cache

export async function generateMetadata({ params }: AchievementPageProps) {
  const resolvedParams = await params;
  const achievement = await getDynamicAchievementById(resolvedParams.id);
  if (!achievement) return { title: 'Achievement Not Found — IEEE MAIT' };

  return {
    title: `${achievement.title} | IEEE MAIT Achievements`,
    description:
      achievement.description ||
      `Achievement conferred in ${achievement.year} by ${achievement.conferredBy || 'IEEE Delhi Section'}.`,
    openGraph: {
      title: achievement.title,
      description:
        achievement.description ||
        `Achievement conferred in ${achievement.year} by ${achievement.conferredBy || 'IEEE Delhi Section'}.`,
      type: 'article',
      siteName: 'IEEE MAIT Student Branch',
      ...(achievement.imageSrc && { images: [{ url: achievement.imageSrc }] }),
    },
  };
}

export default async function AchievementDetailPage({ params }: AchievementPageProps) {
  const resolvedParams = await params;
  const achievement = await getDynamicAchievementById(resolvedParams.id);

  if (!achievement) {
    notFound();
  }

  // Resolve team members / student recipients
  const creditedPeople = achievement.people || [];
  const unitLower = (achievement.unitOrTeam || '').toLowerCase();
  const unitSlug = unitLower.includes('wie')
    ? 'wie'
    : unitLower.includes('eds')
    ? 'eds'
    : 'sb';

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white page-enter">
        <Container size="default">
          {/* Back Navigation */}
          <Link
            href="/achievements"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-warm-400 hover:text-ieee-blue mb-8 transition-colors"
          >
            <span>← Back to Achievements Ledger</span>
          </Link>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="ieee">{achievement.year}</Badge>
            {achievement.category && <Badge variant="neutral">{achievement.category}</Badge>}
            {achievement.unitOrTeam && (
              <Link href={`/chapters/${unitSlug}`}>
                <Badge variant="neutral" className="hover:bg-warm-200 transition-colors">
                  {achievement.unitOrTeam}
                </Badge>
              </Link>
            )}
          </div>

          <SectionHeading title={achievement.title} className="mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
            {/* Primary Column */}
            <div className="lg:col-span-8 space-y-12">
              {/* Cover Image / Award Certificate Photo */}
              {achievement.imageSrc && (
                <div className="relative w-full h-80 sm:h-96 rounded-[2px] overflow-hidden border border-warm-200 bg-warm-100/40">
                  <Image
                    src={achievement.imageSrc}
                    alt={achievement.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 768px"
                    className="object-contain p-4"
                    priority
                  />
                </div>
              )}

              {/* Citation & Detailed Description */}
              <div className="space-y-4">
                <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                  Official Citation
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal border-b border-warm-200 pb-2">
                  Conferral Details
                </h3>
                <p className="text-base text-warm-400 leading-relaxed font-sans whitespace-pre-wrap">
                  {achievement.description ||
                    `This honor was awarded to ${achievement.unitOrTeam || 'IEEE MAIT Student Branch'} in recognition of outstanding technical contributions, student leadership excellence, and sustained participation across IEEE Delhi Section and international events in ${achievement.year}.`}
                </p>
              </div>

              {/* Credited Student Recipients / Team Members */}
              {creditedPeople.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-warm-200 pb-2">
                    <div>
                      <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                        Recognition Recipients
                      </span>
                      <h3 className="font-serif text-2xl text-ink font-normal mt-0.5">
                        Credited Team Members
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-warm-400">
                      {creditedPeople.length} Recipients
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {creditedPeople.map((item: any, idx: number) => {
                      const p = item.person || item;
                      return (
                        <PersonCard
                          key={p.id || idx}
                          name={p.name}
                          role={p.role || 'Recipient'}
                          department={p.department}
                          imageUrl={p.imageUrl}
                          imageSrc={p.imageSrc}
                          linkedIn={p.linkedIn || p.linkedin}
                          github={p.github}
                          email={p.email}
                          size="compact"
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Award & Ceremony Photos */}
              {achievement.images && achievement.images.length > 0 && (
                <div className="space-y-4">
                  <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                    Photographic Record
                  </span>
                  <h3 className="font-serif text-2xl text-ink font-normal border-b border-warm-200 pb-2">
                    Award Ceremony & Trophy Gallery
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {achievement.images.map((img: string, idx: number) => (
                      <a
                        href={img}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={idx}
                        className="block group overflow-hidden border border-warm-200 rounded-[2px] bg-warm-100 aspect-[4/3] relative"
                      >
                        <Image
                          src={img}
                          alt={`${achievement.title} photo ${idx + 1}`}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Associated Event Link if applicable */}
              {achievement.event && (
                <div className="border border-warm-200 bg-warm-50/50 p-6 rounded-[2px] flex items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-[10px] text-ieee-blue uppercase tracking-wider block font-semibold">
                      Associated Event
                    </span>
                    <h4 className="font-serif text-xl text-ink font-normal mt-0.5">
                      {achievement.event.title}
                    </h4>
                  </div>
                  <Button href={`/events/${achievement.event.slug}`} variant="secondary" size="md">
                    View Event Dossier →
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Recognition Ledger Specification */}
              <div className="border border-warm-200 bg-warm-100/40 p-6 rounded-[2px] space-y-6">
                <h4 className="font-serif text-xl text-ink font-normal border-b border-warm-200 pb-3">
                  Ledger Record
                </h4>
                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <span className="text-warm-400 block uppercase">Conferred Year</span>
                    <span className="text-ink font-semibold text-sm">{achievement.year}</span>
                  </div>
                  {achievement.conferredBy && (
                    <div>
                      <span className="text-warm-400 block uppercase">Conferred By</span>
                      <span className="text-ink font-semibold text-sm">{achievement.conferredBy}</span>
                    </div>
                  )}
                  {achievement.unitOrTeam && (
                    <div>
                      <span className="text-warm-400 block uppercase">Recipient Unit / Team</span>
                      <Link
                        href={`/chapters/${unitSlug}`}
                        className="text-ieee-blue font-semibold text-sm hover:underline block mt-0.5"
                      >
                        {achievement.unitOrTeam} →
                      </Link>
                    </div>
                  )}
                  {achievement.category && (
                    <div>
                      <span className="text-warm-400 block uppercase">Category Classification</span>
                      <span className="text-ink font-semibold text-sm">{achievement.category}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-warm-400 block uppercase">Verification Status</span>
                    <span className="text-emerald-700 font-semibold text-xs bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[2px] inline-block mt-0.5">
                      ● Verified Institutional Record
                    </span>
                  </div>
                </div>
              </div>

              {/* Institutional Attribution Card */}
              <div className="border border-warm-200 bg-white p-6 rounded-[2px] space-y-3">
                <span className="font-mono text-[10px] text-warm-400 uppercase tracking-widest block">
                  Branch Archive
                </span>
                <h4 className="font-serif text-lg text-ink font-normal">
                  IEEE MAIT Honors Registry
                </h4>
                <p className="text-xs text-warm-400 font-sans leading-relaxed">
                  Maintained by the Student Branch Executive Committee to honor exemplary student innovations and section recognitions.
                </p>
                <div className="pt-2">
                  <Link
                    href="/achievements"
                    className="text-xs font-mono font-semibold text-ieee-blue hover:underline"
                  >
                    Explore Full Achievements Ledger →
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
