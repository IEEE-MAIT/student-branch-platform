/**
 * @file src/app/sigs/[slug]/page.tsx
 * @description Special Interest Group (SIG) Detail & Learning Hub Page.
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

export async function generateStaticParams() {
  const sigs = await getDynamicSIGs();
  return sigs.map((sig: any) => ({
    slug: sig.slug,
  }));
}

interface SIGPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR Cache

export async function generateMetadata({ params }: SIGPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const sig = await getDynamicSIGBySlug(resolvedParams.slug);
  if (!sig) return { title: 'SIG Not Found — IEEE MAIT' };

  return {
    title: `${sig.name} (SIG) | IEEE MAIT`,
    description: sig.description || `Special Interest Group at IEEE MAIT Student Branch focused on ${sig.name}.`,
  };
}

export default async function SIGDetailPage({ params }: SIGPageProps) {
  const resolvedParams = await params;
  const sig = await getDynamicSIGBySlug(resolvedParams.slug);

  if (!sig) {
    notFound();
  }

  const allProjects = await getDynamicProjects();
  // Filter projects associated with this SIG or matched by tags/slug
  const sigProjects = allProjects.filter((p: any) => {
    if (p.sigId === sig.id) return true;
    const pSlug = (p.slug || '').toLowerCase();
    const pTags = (p.tags || []).map((t: string) => t.toLowerCase());
    if (sig.slug === 'hardware' && (pSlug.includes('rover') || pTags.includes('hardware') || pTags.includes('kicad pcb'))) return true;
    if (sig.slug === 'ai-ml' && (pSlug.includes('acoustic') || pTags.includes('edge ai') || pTags.includes('tensorflow lite'))) return true;
    if (sig.slug === 'development' && (pSlug.includes('platform') || pTags.includes('next.js') || pTags.includes('typescript'))) return true;
    if (sig.slug === 'dsa' && (pTags.includes('algorithms') || pTags.includes('verilog'))) return true;
    return false;
  });

  const accentColor = sig.accentColor || '#0284C7';

  // Custom tracks data per SIG
  const syllabusTracks = [
    {
      phase: 'Phase 01',
      title: 'Foundations & Core Principles',
      duration: 'Weeks 1–4',
      topics:
        sig.slug === 'dsa'
          ? ['Complexity Analysis (Big-O)', 'Array & String Manipulation', 'HashMaps & Two Pointers', 'Recursion & Backtracking']
          : sig.slug === 'ai-ml'
          ? ['Linear Algebra & Vector Calculus', 'Python for Data Science (NumPy/Pandas)', 'Supervised vs Unsupervised Models', 'PyTorch Tensor Fundamentals']
          : sig.slug === 'hardware'
          ? ['Circuit Theory & Schematic Entry', 'KiCad 8 PCB Layout & DRC Rules', 'Soldering & SMT Component Assembly', 'Oscilloscopes & Logic Analyzers']
          : ['TypeScript & Modern ESNext Syntax', 'React 19 & Next.js App Router', 'PostgreSQL & Prisma ORM Schema Design', 'Git & GitHub Collaboration Workflows'],
    },
    {
      phase: 'Phase 02',
      title: 'Applied Engineering & System Design',
      duration: 'Weeks 5–8',
      topics:
        sig.slug === 'dsa'
          ? ['Trees, Tries & Binary Search Trees', 'Graph Algorithms (BFS/DFS, Dijkstra, MST)', 'Dynamic Programming & Memoization', 'Bit Manipulation & Number Theory']
          : sig.slug === 'ai-ml'
          ? ['Convolutional Neural Networks (CNNs)', 'Transformer Architectures & Attention', 'Model Quantization (TinyML)', 'Fine-Tuning Open LLMs (HuggingFace)']
          : sig.slug === 'hardware'
          ? ['Microcontroller Architecture (STM32 & ESP32)', 'Communication Protocols (I2C, SPI, UART, CAN)', 'Motor Drivers & Sensor Integration', 'FreeRTOS Multi-Tasking']
          : ['REST & Edge APIs Architecture', 'Authentication & JWT / Session Security', 'Tailwind CSS Design Systems', 'Containerization with Docker & CI/CD'],
    },
    {
      phase: 'Phase 03',
      title: 'Capstones, Open-Source & Hackathons',
      duration: 'Weeks 9–12',
      topics:
        sig.slug === 'dsa'
          ? ['IEEE Extreme Global CP Mock Contests', 'Advanced DP on Trees & Graphs', 'System Design Interview Patterns', 'Competitive Team Strategy']
          : sig.slug === 'ai-ml'
          ? ['Edge-AI Hardware Deployment', 'Autonomous Computer Vision Pipelines', 'Research Paper Implementation & ArXiv Submissions', 'Kaggle Grandmaster Challenges']
          : sig.slug === 'hardware'
          ? ['Autonomous Robotics Chassis Fabrication', 'Solar Power Distribution Units', 'Telemetry & Real-Time RF ISM Transceivers', 'IEEE Hardware Design Contests']
          : ['Production Deployment on Cloudflare Edge', 'High-Concurrency Database Optimization', 'Open-Source Contribution Mentorship', 'Hackathon Project Pitching'],
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
              { label: 'Special Interest Groups', href: '/sigs' },
              { label: sig.name },
            ]}
          />

          {/* Hero Header */}
          <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-8 sm:p-10 mb-12 shadow-sm relative overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-2"
              style={{ backgroundColor: accentColor }}
            />

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="ieee">Special Interest Group</Badge>
                  <span
                    className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    Active Technical Circle
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink dark:text-gray-100 font-normal leading-tight">
                  {sig.name}
                </h1>

                <p className="text-base text-warm-500 dark:text-gray-300 font-sans leading-relaxed">
                  {sig.description}
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
                <Link
                  href="/opportunities"
                  className="px-6 py-3 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-mono text-xs font-bold rounded-lg text-center shadow-xs transition-colors"
                >
                  Join This SIG →
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
                      Curriculum & Learning Track
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
                      className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-6 space-y-4 hover:border-ieee-blue/40 transition-colors"
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
                        SIG Projects & Repositories
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {sigProjects.map((proj: any) => (
                      <div
                        key={proj.id}
                        className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-6 flex flex-col justify-between space-y-4 hover:shadow-md hover:border-ieee-blue/40 transition-all group"
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
                                {t}
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
                              className="text-warm-400 hover:text-ink dark:hover:text-white flex items-center gap-1"
                            >
                              <span>GitHub ↗</span>
                            </a>
                          ) : (
                            <span className="text-warm-400">Institutional Repo</span>
                          )}

                          <Link
                            href={`/projects/${proj.slug}`}
                            className="text-ieee-blue dark:text-sky-400 font-semibold hover:underline"
                          >
                            Case Study →
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
              <div className="border border-warm-200 dark:border-gray-800 bg-warm-50/60 dark:bg-gray-900/60 rounded-xl p-6 space-y-4">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue dark:text-sky-400 block">
                  Meeting Cadence
                </span>
                <h3 className="font-serif text-xl text-ink dark:text-gray-100 font-normal">
                  Weekly Practical Sessions
                </h3>

                <div className="space-y-3 text-xs font-mono text-warm-500 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📅</span>
                    <span>Every Saturday · 4:00 PM – 6:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">📍</span>
                    <span>Lab 402, Block 4, MAIT Campus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">🌐</span>
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
              <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-6 space-y-4">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue dark:text-sky-400 block">
                  Starter Kit & Tools
                </span>
                <h3 className="font-serif text-xl text-ink dark:text-gray-100 font-normal">
                  Curated Tooling Stack
                </h3>

                <ul className="space-y-2.5 text-xs font-mono text-warm-600 dark:text-gray-300">
                  <li className="flex items-center justify-between p-2 rounded-lg bg-warm-50/70 dark:bg-gray-800/70 border border-warm-200/50 dark:border-gray-700/50">
                    <span>{sig.slug === 'dsa' ? 'LeetCode Curated 150 Patterns' : sig.slug === 'development' ? 'Next.js + TypeScript Sandbox' : sig.slug === 'ai-ml' ? 'PyTorch & HuggingFace Starter' : 'KiCad 8.0 & STM32 HAL Guide'}</span>
                    <span className="text-ieee-blue dark:text-sky-400 font-bold">Docs ↗</span>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded-lg bg-warm-50/70 dark:bg-gray-800/70 border border-warm-200/50 dark:border-gray-700/50">
                    <span>{sig.slug === 'dsa' ? 'CP Algorithms Handbook' : sig.slug === 'development' ? 'PostgreSQL & Prisma ORM Guide' : sig.slug === 'ai-ml' ? 'Edge TinyML Audio Benchmark' : 'Verilog RV32I Testbench Suite'}</span>
                    <span className="text-ieee-blue dark:text-sky-400 font-bold">Repo ↗</span>
                  </li>
                </ul>
              </div>

              {/* Join SIG CTA */}
              <div className="border border-ieee-blue/30 dark:border-sky-800 bg-ieee-subtle/40 dark:bg-sky-950/40 rounded-xl p-6 space-y-4 text-center">
                <span className="text-3xl">🚀</span>
                <h3 className="font-serif text-xl text-ink dark:text-gray-100 font-normal">
                  Ready to Build with Us?
                </h3>
                <p className="text-xs text-warm-500 dark:text-gray-300 font-sans leading-relaxed">
                  Join the SIG channel on our branch Discord server, access curated repositories, and team up for national hackathons.
                </p>
                <div className="pt-2">
                  <Link
                    href="/opportunities"
                    className="w-full inline-block py-2.5 px-4 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-mono text-xs font-bold rounded-lg shadow-xs transition-colors"
                  >
                    Apply for Member Track →
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
