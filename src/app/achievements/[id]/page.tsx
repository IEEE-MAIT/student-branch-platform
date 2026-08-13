import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { getDynamicAchievementById, getDynamicAchievements } from '@/lib/api';
import Link from '@/components/ui/AppLink';

export async function generateStaticParams() {
  const achievements = await getDynamicAchievements();
  return achievements.map((achievement: any) => ({
    id: achievement.id,
  }));
}

interface AchievementPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AchievementPageProps) {
  const resolvedParams = await params;
  const achievement = await getDynamicAchievementById(resolvedParams.id);
  if (!achievement) return { title: 'Achievement Not Found — IEEE MAIT' };

  return {
    title: `${achievement.title} | IEEE MAIT Achievements`,
    description: achievement.description || `Achievement conferred in ${achievement.year} by ${achievement.conferredBy || 'IEEE'}`,
    openGraph: {
      title: achievement.title,
      description: achievement.description || `Achievement conferred in ${achievement.year} by ${achievement.conferredBy || 'IEEE'}`,
      type: 'article',
      siteName: 'IEEE MAIT Student Branch',
      ...(achievement.imageSrc && { images: [{ url: achievement.imageSrc }] })
    },
  };
}

export default async function AchievementDetailPage({ params }: AchievementPageProps) {
  const resolvedParams = await params;
  const achievement = await getDynamicAchievementById(resolvedParams.id);

  if (!achievement) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white page-enter">
        <Container size="default">
          <Link href="/achievements" className="inline-flex items-center gap-1.5 font-mono text-xs text-warm-400 hover:text-ieee-blue mb-8 transition-colors">
            <span>← Back to Achievements Ledger</span>
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <Badge variant="ieee">{achievement.year}</Badge>
            {achievement.category && <Badge variant="neutral">{achievement.category}</Badge>}
          </div>

          <SectionHeading
            title={achievement.title}
            className="mb-8"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
            <div className="lg:col-span-8 space-y-10">
              
              {/* Cover Photo */}
              {achievement.imageSrc && (
                <div className="w-full rounded-[2px] overflow-hidden border border-warm-200">
                  <img 
                    src={achievement.imageSrc} 
                    alt={achievement.title} 
                    className="w-full h-auto max-h-[500px] object-contain bg-warm-100/30"
                  />
                </div>
              )}

              {/* Achievement Description */}
              {achievement.description && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl text-ink font-normal border-b border-warm-200 pb-2">
                    About This Achievement
                  </h3>
                  <p className="text-base text-warm-400 leading-relaxed font-sans whitespace-pre-wrap">
                    {achievement.description}
                  </p>
                </div>
              )}

              {/* Achievement Gallery */}
              {achievement.images && achievement.images.length > 0 && (
                <div className="pt-6">
                  <h3 className="font-serif text-2xl text-ink font-normal mb-6 border-b border-warm-200 pb-2">
                    Event & Award Photos
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {achievement.images.map((img: string, idx: number) => (
                      <a href={img} target="_blank" rel="noopener noreferrer" key={idx} className="block group overflow-hidden border border-warm-200 rounded-[2px]">
                        <img 
                          src={img} 
                          alt={`Gallery photo ${idx + 1}`} 
                          className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recognition Details Sidebar */}
            <div className="lg:col-span-4 border border-warm-200 bg-warm-100/40 p-6 rounded-[2px] space-y-6 h-fit">
              <h4 className="font-serif text-xl text-ink font-normal border-b border-warm-200 pb-3">
                Recognition Details
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
                    <span className="text-ieee-blue font-semibold text-sm">{achievement.unitOrTeam}</span>
                  </div>
                )}
                {achievement.category && (
                  <div>
                    <span className="text-warm-400 block uppercase">Category</span>
                    <span className="text-ink font-semibold text-sm">{achievement.category}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
