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
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

export async function generateStaticParams() {
  const achievements = await getDynamicAchievements();
  return achievements.map((achievement: any) => ({
    id: achievement.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const achievement = await getDynamicAchievementById(id);

  if (!achievement) {
    return {
      title: 'Achievement Record Not Found | IEEE MAIT',
    };
  }

  return {
    title: `${achievement.title} (${achievement.year}) | IEEE MAIT Honors`,
    description: achievement.description || `Honors and recognition conferred to IEEE MAIT in ${achievement.year}.`,
  };
}

export default async function AchievementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const achievement = await getDynamicAchievementById(id);

  if (!achievement) {
    notFound();
  }

  // Resolve team/unit slug
  const unitSlug = achievement.unitOrTeam?.toLowerCase().includes('wie')
    ? 'wie'
    : achievement.unitOrTeam?.toLowerCase().includes('eds')
    ? 'eds'
    : 'sb';

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
        <Container size="default">
          {/* Back Navigation */}
          <Link
            href="/achievements"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-warm-400 dark:text-gray-400 hover:text-ieee-blue dark:hover:text-sky-400 mb-8 transition-colors"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Achievements Ledger</span>
          </Link>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="ieee">{achievement.year}</Badge>
            {achievement.category && <Badge variant="neutral">{achievement.category}</Badge>}
            {achievement.unitOrTeam && (
              <Link href={`/chapters/${unitSlug}`}>
                <Badge variant="neutral" className="hover:bg-warm-200 dark:hover:bg-gray-700 transition-colors">
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
                <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-warm-200 dark:border-gray-800 bg-warm-100/40 dark:bg-gray-900/40 shadow-xs">
                  <Image
                    src={achievement.imageSrc}
                    alt={achievement.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-contain p-4"
                    priority
                  />
                </div>
              )}

              {/* Narrative & Impact */}
              <div className="prose max-w-none text-ink dark:text-gray-200 font-sans leading-relaxed space-y-4">
                <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal border-b border-warm-200 dark:border-gray-800 pb-2">
                  Achievement Narrative &amp; Significance
                </h3>
                <p className="text-base leading-relaxed text-warm-600 dark:text-gray-300">
                  {achievement.description ||
                    'This honor represents a landmark institutional recognition conferred upon the IEEE MAIT Student Branch for sustained technical leadership, student research, and high-impact regional initiatives.'}
                </p>
              </div>

              {/* Multi-Photo Document Gallery */}
              {achievement.images && achievement.images.length > 0 && (
                <div className="space-y-4 border-t border-warm-200 dark:border-gray-800 pt-8">
                  <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">
                    Ceremony &amp; Documentary Photographs
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {achievement.images.map((imgUrl: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative h-44 rounded-xl overflow-hidden border border-warm-200 dark:border-gray-800 bg-warm-100/30 dark:bg-gray-900/40 group shadow-xs"
                      >
                        <Image
                          src={imgUrl}
                          alt={`${achievement.title} Photo ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 260px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Student Recipients / Project Leads */}
              {achievement.recipients && achievement.recipients.length > 0 && (
                <div className="space-y-4 border-t border-warm-200 dark:border-gray-800 pt-8">
                  <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">
                    Key Recipients &amp; Team Members
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {achievement.recipients.map((person: any) => (
                      <PersonCard
                        key={person.id}
                        name={person.name}
                        role={person.role}
                        category={person.category}
                        department={person.department}
                        imageUrl={person.imageUrl}
                        imageSrc={person.imageSrc}
                        linkedIn={person.linkedIn || person.linkedin}
                        github={person.github}
                        email={person.email}
                        bio={person.bio}
                        size="standard"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Associated Event Link */}
              {achievement.event && (
                <div className="p-6 border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/50 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                  <div>
                    <span className="font-mono text-[10px] text-ieee-blue dark:text-sky-400 uppercase tracking-wider block font-semibold">
                      Associated Event
                    </span>
                    <h4 className="font-serif text-xl text-ink dark:text-gray-100 font-normal mt-0.5">
                      {achievement.event.title}
                    </h4>
                  </div>
                  <Button href={`/events/${achievement.event.slug}`} variant="secondary" size="md" className="flex items-center gap-1.5">
                    <span>View Event Dossier</span>
                    <FiArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Recognition Ledger Specification */}
              <div className="border border-warm-200 dark:border-gray-800 bg-warm-100/40 dark:bg-gray-900/40 p-6 rounded-xl space-y-6 shadow-xs">
                <h4 className="font-serif text-xl text-ink dark:text-gray-100 font-normal border-b border-warm-200 dark:border-gray-800 pb-3">
                  Ledger Record
                </h4>
                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <span className="text-warm-400 dark:text-gray-400 block uppercase">Conferred Year</span>
                    <span className="text-ink dark:text-gray-100 font-semibold text-sm">{achievement.year}</span>
                  </div>
                  {achievement.conferredBy && (
                    <div>
                      <span className="text-warm-400 dark:text-gray-400 block uppercase">Conferred By</span>
                      <span className="text-ink dark:text-gray-100 font-semibold text-sm">{achievement.conferredBy}</span>
                    </div>
                  )}
                  {achievement.unitOrTeam && (
                    <div>
                      <span className="text-warm-400 dark:text-gray-400 block uppercase">Recipient Unit / Team</span>
                      <Link
                        href={`/chapters/${unitSlug}`}
                        className="text-ieee-blue dark:text-sky-400 font-semibold text-sm hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <span>{achievement.unitOrTeam}</span>
                        <FiArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                  {achievement.category && (
                    <div>
                      <span className="text-warm-400 dark:text-gray-400 block uppercase">Category Classification</span>
                      <span className="text-ink dark:text-gray-100 font-semibold text-sm">{achievement.category}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-warm-400 dark:text-gray-400 block uppercase">Verification Status</span>
                    <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-xs bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Verified Institutional Record</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Institutional Attribution Card */}
              <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 rounded-xl space-y-3 shadow-xs">
                <span className="font-mono text-[10px] text-warm-400 dark:text-gray-400 uppercase tracking-widest block">
                  Branch Archive
                </span>
                <h4 className="font-serif text-lg text-ink dark:text-gray-100 font-normal">
                  IEEE MAIT Honors Registry
                </h4>
                <p className="text-xs text-warm-500 dark:text-gray-400 font-sans leading-relaxed">
                  Maintained by the Student Branch Executive Committee to honor exemplary student innovations and section recognitions.
                </p>
                <div className="pt-2">
                  <Link
                    href="/achievements"
                    className="text-xs font-mono font-semibold text-ieee-blue dark:text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <span>Explore Full Achievements Ledger</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
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
