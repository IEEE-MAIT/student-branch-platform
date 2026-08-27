/**
 * @file src/app/sigs/[slug]/page.tsx
 * @description Special Interest Group (SIG) Detail & Learning Hub Page with react-icons.
 * 
 * FEATURES:
 * - Structured Learning Roadmap (Foundations -> Applied Research -> Capstone).
 * - Weekly Meeting Cadence & Venue Details.
 * - Associated Project Repositories.
 * - Coordinator & Mentor Showcase.
 * - "Join SIG" Call-to-Action.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getDynamicSIGBySlug, getDynamicSIGs, getDynamicProjects } from '@/lib/api';
import Link from '@/components/ui/AppLink';
import type { Metadata } from 'next';
import {
  FiArrowRight,
  FiExternalLink,
  FiCalendar,
  FiMapPin,
  FiGlobe,
  FiCpu,
  FiCode,
  FiTerminal,
  FiZap,
} from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa6';

export async function generateStaticParams() {
  const sigs = await getDynamicSIGs();
  return sigs.map((sig: any) => ({
    slug: sig.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sig = await getDynamicSIGBySlug(slug);

  if (!sig) {
    return {
      title: 'SIG Not Found | IEEE MAIT',
    };
  }

  return {
    title: `${sig.name} (${sig.acronym || 'SIG'}) | IEEE MAIT`,
    description: sig.description,
  };
}

export default async function SIGDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [sig, allProjects] = await Promise.all([
    getDynamicSIGBySlug(slug),
    getDynamicProjects(),
  ]);

  if (!sig) {
    notFound();
  }

  // Filter associated projects
  const sigProjects = allProjects.filter((p: any) => {
    const tags = p.tags || [];
    const tLower = tags.map((t: string) => t.toLowerCase());
    const slugLower = sig.slug.toLowerCase();
    return (
      tLower.includes(slugLower) ||
      (slugLower === 'ai-ml' && (tLower.includes('ai') || tLower.includes('ml') || tLower.includes('nlp'))) ||
      (slugLower === 'development' && (tLower.includes('web') || tLower.includes('fullstack') || tLower.includes('nextjs'))) ||
      (slugLower === 'hardware' && (tLower.includes('iot') || tLower.includes('pcb') || tLower.includes('robotics'))) ||
      (slugLower === 'dsa' && (tLower.includes('algorithms') || tLower.includes('cp')))
    );
  });

  const accentColor =
    sig.slug === 'ai-ml'
      ? '#7C3AED'
      : sig.slug === 'development'
      ? '#0284C7'
      : sig.slug === 'dsa'
      ? '#D97706'
      : '#059669';

  // Syllabus Tracks
  const syllabusTracks = [
    {
      phase: 'Phase 1 · Weeks 1-4',
      title: 'Core Foundations & Tooling Setup',
      duration: '4 Weeks',
      topics: [
        'Development Environment & Git Version Control',
        'Algorithmic Complexity & Benchmark Fundamentals',
        'Architectural Patterns & Clean Code Paradigms',
        'Hands-on Lab: Diagnostic Baseline Assignment',
      ],
    },
    {
      phase: 'Phase 2 · Weeks 5-8',
      title: 'Applied Engineering & System Design',
      duration: '4 Weeks',
      topics: [
        'Production Stack Integration & API Pipelines',
        'State Management & Distributed Performance',
        'Testing Strategies, CI/CD & Deployment',
        'Hands-on Lab: Mid-Term Micro-Service Project',
      ],
    },
    {
      phase: 'Phase 3 · Weeks 9-12',
      title: 'Capstone Innovation & Hackathon Sprint',
      duration: '4 Weeks',
      topics: [
        'End-to-End Capstone Architecture Mentorship',
        'Industry Review with Branch Alumni Advisors',
        'Research Paper Drafting & Publication Prep',
        'Public Showcase & Demo Day Presentation',
      ],
    },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'SIGs', href: '/sigs' },
              { label: sig.name },
            ]}
          />

          {/* Hero Banner Header */}
          <div className="p-8 sm:p-12 border border-warm-200 dark:border-gray-800 bg-warm-50/60 dark:bg-gray-900/60 rounded-xl space-y-6 mb-12 shadow-xs">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span
                className="px-3 py-1 rounded-full text-white font-mono font-bold text-xs shadow-xs"
                style={{ backgroundColor: accentColor }}
              >
                {sig.acronym || 'SIG POD'}
              </span>
              <Badge variant="neutral">Active Focus Group</Badge>
              <Badge variant="neutral">Weekly Meetups</Badge>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-3 max-w-2xl">
                <h1 className="font-serif text-3xl sm:text-5xl text-ink dark:text-gray-100 font-normal leading-tight">
                  {sig.name}
                </h1>
                <p className="text-sm sm:text-base text-warm-500 dark:text-gray-300 font-sans leading-relaxed">
                  {sig.description}
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
                <Link
                  href="/opportunities"
                  className="px-6 py-3 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-mono text-xs font-bold rounded-lg text-center shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Join This SIG</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/projects"
                  className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-warm-100 dark:hover:bg-gray-700 text-ink dark:text-gray-200 border border-warm-300 dark:border-gray-700 font-mono text-xs font-semibold rounded-lg text-center transition-colors"
                >
                  View All Projects
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Left 2 Cols: Syllabus Roadmap & Associated Projects */}
            <div className="lg:col-span-2 space-y-12">
              {/* Syllabus Track */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-warm-200 dark:border-gray-800 pb-3">
                  <div>
                    <span className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue dark:text-sky-400">
                      Curriculum &amp; Learning Track
                    </span>
                    <h2 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal mt-0.5">
                      Structured 12-Week Roadmap
                    </h2>
                  </div>
                </div>

                <div className="space-y-6">
                  {syllabusTracks.map((track) => (
                    <div
                      key={track.phase}
                      className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-6 space-y-4 hover:border-ieee-blue/40 transition-colors shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold text-white"
                            style={{ backgroundColor: accentColor }}
                          >
                            {track.phase}
                          </span>
                          <h3 className="font-serif text-lg text-ink dark:text-gray-100 font-normal">
                            {track.title}
                          </h3>
                        </div>
                        <span className="font-mono text-xs text-warm-400 dark:text-gray-400">
                          {track.duration}
                        </span>
                      </div>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-warm-500 dark:text-gray-300">
                        {track.topics.map((topic, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-ieee-blue dark:text-sky-400 font-mono">▸</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Associated Active Projects */}
              {sigProjects.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-warm-200 dark:border-gray-800 pb-3">
                    <div>
                      <span className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue dark:text-sky-400">
                        Active Technical Builds
                      </span>
                      <h2 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal mt-0.5">
                        SIG Projects &amp; Repositories
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {sigProjects.map((proj: any) => (
                      <div
                        key={proj.id}
                        className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-6 flex flex-col justify-between space-y-4 hover:shadow-md hover:border-ieee-blue/40 transition-all group shadow-xs"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <Badge variant="neutral">{proj.year}</Badge>
                            <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                              ● {proj.status}
                            </span>
                          </div>

                          <h4 className="font-serif text-lg text-ink dark:text-gray-100 font-normal leading-snug group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors">
                            <Link href={`/projects/${proj.slug}`}>
                              {proj.title}
                            </Link>
                          </h4>

                          <p className="text-xs text-warm-500 dark:text-gray-400 font-sans leading-relaxed line-clamp-2">
                            {proj.summary}
                          </p>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {(proj.tags || []).slice(0, 3).map((t: string) => (
                              <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 text-warm-500 dark:text-gray-300">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-warm-200 dark:border-gray-800 flex items-center justify-between text-xs font-mono">
                          {proj.githubUrl ? (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-warm-400 hover:text-ink dark:hover:text-white flex items-center gap-1.5"
                            >
                              <FaGithub className="w-3.5 h-3.5" />
                              <span>GitHub</span>
                              <FiExternalLink className="w-2.5 h-2.5 opacity-70" />
                            </a>
                          ) : (
                            <span className="text-warm-400">Institutional Repo</span>
                          )}

                          <Link
                            href={`/projects/${proj.slug}`}
                            className="text-ieee-blue dark:text-sky-400 font-semibold hover:underline flex items-center gap-1"
                          >
                            <span>Case Study</span>
                            <FiArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column: Meeting Schedule & Joining Info */}
            <div className="space-y-8">
              {/* Meeting Cadence Box */}
              <div className="border border-warm-200 dark:border-gray-800 bg-warm-50/60 dark:bg-gray-900/60 rounded-xl p-6 space-y-4 shadow-xs">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue dark:text-sky-400 block">
                  Meeting Cadence
                </span>
                <h3 className="font-serif text-xl text-ink dark:text-gray-100 font-normal">
                  Weekly Practical Sessions
                </h3>

                <div className="space-y-3 text-xs font-mono text-warm-500 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 text-ieee-blue dark:text-sky-400 shrink-0" />
                    <span>Every Saturday · 4:00 PM – 6:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="w-4 h-4 text-ieee-blue dark:text-sky-400 shrink-0" />
                    <span>Lab 402, Block 4, MAIT Campus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiGlobe className="w-4 h-4 text-ieee-blue dark:text-sky-400 shrink-0" />
                    <span>Hybrid (Discord Live Stream Available)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-warm-200 dark:border-gray-800">
                  <p className="text-xs text-warm-400 dark:text-gray-400 font-sans leading-relaxed">
                    Open to all active IEEE student members across ECE, EEE, CSE, IT, and AI branches.
                  </p>
                </div>
              </div>

              {/* Starter Kit & Resource Repos */}
              <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-6 space-y-4 shadow-xs">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue dark:text-sky-400 block">
                  Starter Kit &amp; Tools
                </span>
                <h3 className="font-serif text-xl text-ink dark:text-gray-100 font-normal">
                  Curated Tooling Stack
                </h3>

                <ul className="space-y-2.5 text-xs font-mono text-warm-600 dark:text-gray-300">
                  <li className="flex items-center justify-between p-2 rounded-lg bg-warm-50/70 dark:bg-gray-800/70 border border-warm-200/50 dark:border-gray-700/50">
                    <span className="truncate mr-2">{sig.slug === 'dsa' ? 'LeetCode Curated 150 Patterns' : sig.slug === 'development' ? 'Next.js + TypeScript Sandbox' : sig.slug === 'ai-ml' ? 'PyTorch & HuggingFace Starter' : 'KiCad 8.0 & STM32 HAL Guide'}</span>
                    <span className="text-ieee-blue dark:text-sky-400 font-bold flex items-center gap-1 shrink-0">
                      <span>Docs</span>
                      <FiExternalLink className="w-3 h-3" />
                    </span>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded-lg bg-warm-50/70 dark:bg-gray-800/70 border border-warm-200/50 dark:border-gray-700/50">
                    <span className="truncate mr-2">{sig.slug === 'dsa' ? 'CP Algorithms Handbook' : sig.slug === 'development' ? 'PostgreSQL & Prisma ORM Guide' : sig.slug === 'ai-ml' ? 'Edge TinyML Audio Benchmark' : 'Verilog RV32I Testbench Suite'}</span>
                    <span className="text-ieee-blue dark:text-sky-400 font-bold flex items-center gap-1 shrink-0">
                      <span>Repo</span>
                      <FiExternalLink className="w-3 h-3" />
                    </span>
                  </li>
                </ul>
              </div>

              {/* Join SIG CTA */}
              <div className="border border-ieee-blue/30 dark:border-sky-800 bg-ieee-subtle/40 dark:bg-sky-950/40 rounded-xl p-6 space-y-4 text-center shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-ieee-blue/10 dark:bg-sky-900/50 text-ieee-blue dark:text-sky-400 flex items-center justify-center mx-auto">
                  <FiZap className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl text-ink dark:text-gray-100 font-normal">
                  Ready to Build with Us?
                </h3>
                <p className="text-xs text-warm-500 dark:text-gray-300 font-sans leading-relaxed">
                  Join the SIG channel on our branch Discord server, access curated repositories, and team up for national hackathons.
                </p>
                <div className="pt-2">
                  <Link
                    href="/opportunities"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-mono text-xs font-bold rounded-lg shadow-xs transition-colors"
                  >
                    <span>Apply for Member Track</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
