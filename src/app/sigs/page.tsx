/**
 * @file src/app/sigs/page.tsx
 * @description Special Interest Groups (SIGs) Directory Page.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { getDynamicSIGs } from '@/lib/api';
import Link from '@/components/ui/AppLink';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Special Interest Groups (SIGs) | IEEE MAIT Student Branch',
  description:
    'Explore hands-on technical wings at IEEE MAIT: Algorithms, Full-Stack Web Development, AI/ML, Embedded Hardware, and VLSI Silicon Design.',
};

export const revalidate = 60; // ISR Cache

export default async function SIGsPage() {
  const sigs = await getDynamicSIGs();

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Special Interest Groups (SIGs)' },
            ]}
          />

          <SectionHeading
            category="Technical Research Wings"
            title="Special Interest Groups (SIGs)"
            subtitle="Student-led technical research circles, algorithmic problem solving teams, and hands-on hardware development pods at IEEE MAIT."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            {sigs.map((sig: any) => {
              const accent = sig.accentColor || '#0284C7';
              const projectCount = sig._count?.projects ?? (sig.projects?.length || 0);

              return (
                <div
                  key={sig.id}
                  className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:shadow-lg transition-all duration-300 group shadow-xs relative overflow-hidden"
                >
                  {/* Color Accent Indicator Strip */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{ backgroundColor: accent }}
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <Badge variant="ieee">Technical Wing</Badge>
                      <span className="font-mono text-xs text-warm-400 dark:text-gray-400">
                        {projectCount} Active Projects
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal leading-tight group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors">
                      <Link href={`/sigs/${sig.slug}`}>
                        {sig.name}
                      </Link>
                    </h3>

                    <p className="text-sm text-warm-500 dark:text-gray-300 font-sans leading-relaxed">
                      {sig.description}
                    </p>

                    {/* Quick Focus Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {sig.slug === 'dsa' && ['Competitive Programming', 'LeetCode', 'Dynamic Programming', 'Graph Theory'].map(t => (
                        <span key={t} className="px-2 py-0.5 rounded text-[11px] font-mono bg-warm-100 dark:bg-gray-800 text-warm-600 dark:text-gray-300 border border-warm-200 dark:border-gray-700">
                          {t}
                        </span>
                      ))}
                      {sig.slug === 'development' && ['Next.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Open Source'].map(t => (
                        <span key={t} className="px-2 py-0.5 rounded text-[11px] font-mono bg-warm-100 dark:bg-gray-800 text-warm-600 dark:text-gray-300 border border-warm-200 dark:border-gray-700">
                          {t}
                        </span>
                      ))}
                      {sig.slug === 'ai-ml' && ['PyTorch', 'Computer Vision', 'NLP', 'TensorFlow Lite', 'Edge AI'].map(t => (
                        <span key={t} className="px-2 py-0.5 rounded text-[11px] font-mono bg-warm-100 dark:bg-gray-800 text-warm-600 dark:text-gray-300 border border-warm-200 dark:border-gray-700">
                          {t}
                        </span>
                      ))}
                      {sig.slug === 'hardware' && ['KiCad PCB', 'STM32', 'Robotics', 'IoT', 'Embedded C'].map(t => (
                        <span key={t} className="px-2 py-0.5 rounded text-[11px] font-mono bg-warm-100 dark:bg-gray-800 text-warm-600 dark:text-gray-300 border border-warm-200 dark:border-gray-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-warm-200 dark:border-gray-800 flex items-center justify-between">
                    <span className="font-mono text-xs text-warm-400 dark:text-gray-400">
                      Weekly Sessions @ Lab 402
                    </span>
                    <Link
                      href={`/sigs/${sig.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-ieee-blue dark:text-sky-400 hover:underline uppercase tracking-wider"
                    >
                      <span>Explore SIG Hub</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Join Callout Banner */}
          <div className="mt-16 p-8 border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/50 rounded-xl text-center space-y-4">
            <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">
              Interested in Leading or Mentoring a SIG?
            </h3>
            <p className="text-sm text-warm-500 dark:text-gray-300 max-w-xl mx-auto font-sans leading-relaxed">
              IEEE MAIT empowers student innovators to start new domain circles, conduct peer workshops, and lead sponsored research projects.
            </p>
            <div className="pt-2 flex justify-center gap-4 flex-wrap">
              <Link
                href="/opportunities"
                className="px-5 py-2.5 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-mono text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                View Volunteer Openings →
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 bg-white dark:bg-gray-800 hover:bg-warm-100 dark:hover:bg-gray-700 text-ink dark:text-gray-200 border border-warm-300 dark:border-gray-700 font-mono text-xs font-semibold rounded-lg transition-colors"
              >
                Propose a New SIG
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
