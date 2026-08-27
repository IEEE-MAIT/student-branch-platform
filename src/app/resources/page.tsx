/**
 * @file src/app/resources/page.tsx
 * @description Digital Library & Resources Repository.
 * 
 * ORGANIZED SECTIONS:
 * 1. Branch Newsletters & Annual Activity Reports
 * 2. Technical Workshop Slide Decks & Starter Kits (KiCad, Embedded Systems, AI/ML)
 * 3. Brand Assets & Identity Toolkit (Vector Logos, Color Palettes, Presentation Templates)
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
import { Button } from '@/components/ui/Button';
import { getDynamicResources } from '@/lib/api';
import type { Metadata } from 'next';
import Link from '@/components/ui/AppLink';

export const revalidate = 3600; // ISR Cache 1 hour

export const metadata: Metadata = {
  title: 'Digital Library & Resources | IEEE MAIT Student Branch',
  description:
    'Download IEEE MAIT branch newsletters, annual activity reports, technical workshop slide decks, and official brand assets.',
};

const SEED_RESOURCES = [
  {
    id: 'r1',
    title: 'IEEE MAIT Newsletter — Volume 3, Issue 2',
    type: 'Newsletter',
    publishedDate: 'JUL 2026',
    description: 'Bi-annual branch newsletter covering student technical competitions, member spotlights, and project chronicles.',
    fileUrl: '/resources/newsletter-vol3-issue2.pdf',
    status: 'published',
  },
  {
    id: 'r2',
    title: 'IEEE MAIT Newsletter — Volume 3, Issue 1',
    type: 'Newsletter',
    publishedDate: 'JAN 2026',
    description: 'First issue of 2026 covering new academic session roadmap, KiCad bootcamp highlights, and WIE symposium.',
    fileUrl: '/resources/newsletter-vol3-issue1.pdf',
    status: 'published',
  },
  {
    id: 'r3',
    title: 'Annual Activity & Transition Report 2025–26',
    type: 'AnnualReport',
    publishedDate: 'MAY 2026',
    description: 'Full institutional report: 18 events, 150+ enrolled members, financial audit summary, and Delhi Section achievements.',
    fileUrl: '/resources/annual-report-2025-26.pdf',
    status: 'published',
  },
  {
    id: 'r4',
    title: 'Annual Activity & Transition Report 2024–25',
    type: 'AnnualReport',
    publishedDate: 'MAY 2025',
    description: 'Institutional summary covering the 2024–25 academic year, student paper publications, and branch officer transitions.',
    fileUrl: '/resources/annual-report-2024-25.pdf',
    status: 'published',
  },
  {
    id: 'r5',
    title: 'IEEE Student Membership & Onboarding Guide',
    type: 'Document',
    publishedDate: 'AUG 2025',
    description: 'Step-by-step walkthrough for joining IEEE.org, activating 50% student discounts, and registering with MAIT Student Branch.',
    fileUrl: '/resources/membership-guide-2025.pdf',
    status: 'published',
  },
  {
    id: 'r6',
    title: 'IEEE MAIT Branch Operational Constitution',
    type: 'Document',
    publishedDate: 'JAN 2024',
    description: 'Governing document for IEEE MAIT Student Branch bylaws, executive committee responsibilities, and electoral protocols.',
    fileUrl: '/resources/branch-constitution.pdf',
    status: 'published',
  },
];

const TECHNICAL_KITS = [
  {
    title: 'KiCad 4-Layer PCB Starter Template & Design Rules',
    category: 'Hardware Design',
    author: 'IEEE EDS Chapter',
    description: 'Custom KiCad 8.0 project template pre-configured with JLCPCB 4-layer design rules, standard 0805 component footprint libraries, and Gerber export settings.',
    link: 'https://github.com/IEEE-MAIT',
    tag: 'KiCad Template',
  },
  {
    title: 'Embedded STM32 & ESP32-S3 Firmware Framework',
    category: 'Embedded Systems',
    author: 'Technical Team',
    description: 'FreeRTOS starter workspace with DMA UART telemetry, FreeRTOS task scheduling, and I2C sensor drivers for student hardware projects.',
    link: 'https://github.com/IEEE-MAIT',
    tag: 'C/C++ Framework',
  },
  {
    title: 'PyTorch Deep Learning & TinyML Workshop Notebooks',
    category: 'Machine Learning',
    author: 'EDS Technical Lead',
    description: 'Jupyter coding notebooks covering convolutional neural networks, 8-bit quantization for microcontroller deployment, and dataset augmentation.',
    link: 'https://github.com/IEEE-MAIT',
    tag: 'Jupyter Notebooks',
  },
  {
    title: 'Linux CLI & Git Collaboration Essentials',
    category: 'Software Engineering',
    author: 'Webmaster Lead',
    description: 'Concise reference sheet for Git branching strategies, pull request workflows, SSH key management, and Linux terminal productivity.',
    link: 'https://github.com/IEEE-MAIT',
    tag: 'Quick Reference',
  },
];

const BRAND_ASSETS = [
  {
    title: 'IEEE MAIT Student Branch Logo (Light Mode)',
    format: 'PNG (Transparent)',
    description: 'Official IEEE MAIT Student Branch co-branded logo on transparent background for light surfaces.',
    url: '/ieee_mait_sb_light_mode_logo.png',
  },
  {
    title: 'IEEE MAIT Student Branch Logo (Dark Mode)',
    format: 'PNG (Transparent)',
    description: 'Official IEEE MAIT Student Branch co-branded logo with high-contrast radiant white & cyan styling for dark surfaces.',
    url: '/ieee_mait_sb_dark_mode_logo.png',
  },
  {
    title: 'IEEE EDS Chapter MAIT Logo (Light Mode)',
    format: 'PNG (Transparent)',
    description: 'Official IEEE Electron Devices Society MAIT Student Chapter emblem for light layouts.',
    url: '/eds_mait_sb_light_mode_logo.png',
  },
  {
    title: 'IEEE EDS Chapter MAIT Logo (Dark Mode)',
    format: 'PNG (Transparent)',
    description: 'Official IEEE Electron Devices Society MAIT Student Chapter emblem for dark layouts.',
    url: '/eds_mait_sb_dark_mode_logo.png',
  },
  {
    title: 'IEEE WIE Affinity Group Logo (Light Mode)',
    format: 'PNG (Transparent)',
    description: 'Official IEEE Women in Engineering MAIT Affinity Group emblem in signature purple.',
    url: '/wie_mait_light_mode_logo.png',
  },
  {
    title: 'IEEE WIE Affinity Group Logo (Dark Mode)',
    format: 'PNG (Transparent)',
    description: 'Official IEEE Women in Engineering MAIT Affinity Group emblem for dark layouts.',
    url: '/wie_mait_dark_mode_logo.png',
  },
  {
    title: 'MAIT Institutional College Logo (Light & Dark)',
    format: 'PNG (High Res)',
    description: 'Official Maharaja Agrasen Institute of Technology university crest in light and dark variants.',
    url: '/mait_logo_light_mode.png',
  },
  {
    title: 'Brand Design System & Color Tokens',
    format: 'Design Spec / CSS Tokens',
    description: 'Official IEEE Blue (#00629B), MAIT Burgundy (#8B2332), WIE Purple (#7C3AED), and EDS Cyan (#0284C7) variables.',
    url: '/about',
  },
];

export default async function ResourcesPage() {
  const dbResources = await getDynamicResources();
  const resources = dbResources.length > 0 ? dbResources : SEED_RESOURCES;

  const newsletters = resources.filter((r: any) => r.type === 'Newsletter');
  const annualReports = resources.filter((r: any) => r.type === 'AnnualReport');
  const documents = resources.filter((r: any) => r.type === 'Document' || r.type === 'Other');

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white page-enter">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Digital Library & Resources' },
            ]}
          />

          <SectionHeading
            category="Institutional Repository"
            title="Digital Library & Resources"
            subtitle="Explore published branch newsletters, annual activity reports, technical workshop slide decks, and official IEEE brand assets."
          />

          {/* Quick Navigation Jump Bar */}
          <div className="flex flex-wrap items-center gap-2 pb-8 mb-12 border-b border-warm-200">
            <span className="font-mono text-xs font-semibold text-warm-400 uppercase tracking-wider mr-2">
              Browse Sections:
            </span>
            <a
              href="#reports"
              className="px-3 py-1.5 font-mono text-xs bg-warm-100/80 hover:bg-ieee-subtle hover:text-ieee-blue border border-warm-200 rounded-[2px] transition-colors"
            >
              01 · Newsletters & Reports
            </a>
            <a
              href="#technical-kits"
              className="px-3 py-1.5 font-mono text-xs bg-warm-100/80 hover:bg-ieee-subtle hover:text-ieee-blue border border-warm-200 rounded-[2px] transition-colors"
            >
              02 · Technical Kits & Slide Decks
            </a>
            <a
              href="#brand-toolkit"
              className="px-3 py-1.5 font-mono text-xs bg-warm-100/80 hover:bg-ieee-subtle hover:text-ieee-blue border border-warm-200 rounded-[2px] transition-colors"
            >
              03 · Brand Identity Toolkit
            </a>
          </div>

          <div className="space-y-16">
            {/* ---------------------------------------------------- */}
            {/* SECTION 1: NEWSLETTERS & ANNUAL REPORTS */}
            {/* ---------------------------------------------------- */}
            <section id="reports" className="space-y-8">
              <div className="border-b border-warm-200 pb-3">
                <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                  Publications
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-0.5">
                  Newsletters & Annual Activity Reports
                </h2>
                <p className="text-sm text-warm-400 font-sans mt-1">
                  Official publications documenting branch activities, financial audits, and technical milestones.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Newsletters Column */}
                <div className="space-y-4">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ieee-blue">
                    Branch Newsletters
                  </h3>
                  <div className="border border-warm-200 bg-white rounded-[2px] divide-y divide-warm-200">
                    {newsletters.map((r: any) => (
                      <div key={r.id} className="p-5 hover:bg-warm-50/50 transition-colors flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[11px] text-warm-400">{r.publishedDate}</span>
                            <span className="font-mono text-[10px] bg-ieee-subtle text-ieee-blue px-2 py-0.5 rounded-[2px]">
                              PDF Publication
                            </span>
                          </div>
                          <h4 className="font-serif text-lg text-ink font-normal mt-1">{r.title}</h4>
                          <p className="text-xs text-warm-400 font-sans mt-1">{r.description}</p>
                        </div>
                        <div className="pt-1">
                          <a
                            href={r.fileUrl || '#'}
                            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-ieee-blue hover:underline"
                          >
                            <span>Download Issue (PDF) ↓</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Annual Activity Reports Column */}
                <div className="space-y-4">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ieee-blue">
                    Annual Activity Reports
                  </h3>
                  <div className="border border-warm-200 bg-white rounded-[2px] divide-y divide-warm-200">
                    {annualReports.map((r: any) => (
                      <div key={r.id} className="p-5 hover:bg-warm-50/50 transition-colors flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[11px] text-warm-400">{r.publishedDate}</span>
                            <span className="font-mono text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-[2px]">
                              Institutional Record
                            </span>
                          </div>
                          <h4 className="font-serif text-lg text-ink font-normal mt-1">{r.title}</h4>
                          <p className="text-xs text-warm-400 font-sans mt-1">{r.description}</p>
                        </div>
                        <div className="pt-1">
                          <a
                            href={r.fileUrl || '#'}
                            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-ieee-blue hover:underline"
                          >
                            <span>Download Report (PDF) ↓</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Branch Governing Documents */}
              {documents.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ieee-blue">
                    Governing Documents & Member Guides
                  </h3>
                  <div className="border border-warm-200 bg-white rounded-[2px] divide-y divide-warm-200">
                    {documents.map((r: any) => (
                      <div key={r.id} className="p-5 hover:bg-warm-50/50 transition-colors flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                        <div>
                          <span className="font-mono text-[11px] text-warm-400 block mb-0.5">{r.publishedDate}</span>
                          <h4 className="font-serif text-base text-ink font-normal">{r.title}</h4>
                          <p className="text-xs text-warm-400 font-sans mt-0.5">{r.description}</p>
                        </div>
                        <a
                          href={r.fileUrl || '#'}
                          className="font-mono text-xs font-semibold text-ieee-blue hover:underline shrink-0"
                        >
                          Download Document ↓
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* ---------------------------------------------------- */}
            {/* SECTION 2: TECHNICAL KITS & SLIDE DECKS */}
            {/* ---------------------------------------------------- */}
            <section id="technical-kits" className="border-t border-warm-200 pt-16 space-y-8">
              <div className="border-b border-warm-200 pb-3">
                <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                  Engineering Library
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-0.5">
                  Workshop Slide Decks & Starter Kits
                </h2>
                <p className="text-sm text-warm-400 font-sans mt-1">
                  Verified hardware project templates, firmware frameworks, and machine learning tutorial notebooks curated by MAIT technical leads.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {TECHNICAL_KITS.map((kit, idx) => (
                  <div
                    key={idx}
                    className="border border-warm-200 bg-white rounded-[2px] p-6 flex flex-col justify-between space-y-4 hover:border-ieee-blue/40 transition-all group"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-semibold text-ieee-blue bg-ieee-subtle px-2 py-0.5 rounded-[2px]">
                          {kit.category}
                        </span>
                        <span className="font-mono text-[10px] text-warm-400">
                          {kit.author}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl text-ink font-normal group-hover:text-ieee-blue transition-colors">
                        {kit.title}
                      </h3>
                      <p className="text-xs text-warm-400 font-sans leading-relaxed">
                        {kit.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-warm-100 flex items-center justify-between">
                      <span className="font-mono text-[11px] text-warm-400 bg-warm-100/70 px-2 py-0.5 rounded-[2px]">
                        {kit.tag}
                      </span>
                      <a
                        href={kit.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs font-semibold text-ieee-blue hover:underline"
                      >
                        Access Repository ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ---------------------------------------------------- */}
            {/* SECTION 3: BRAND ASSETS & IDENTITY TOOLKIT */}
            {/* ---------------------------------------------------- */}
            <section id="brand-toolkit" className="border-t border-warm-200 pt-16 space-y-8">
              <div className="border-b border-warm-200 pb-3">
                <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                  Media & Creative
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-0.5">
                  Brand Identity Toolkit & Vectors
                </h2>
                <p className="text-sm text-warm-400 font-sans mt-1">
                  Official high-resolution logos, emblem guidelines, and presentation templates for IEEE MAIT student organizers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {BRAND_ASSETS.map((asset, idx) => (
                  <div
                    key={idx}
                    className="border border-warm-200 bg-warm-50/50 rounded-[2px] p-6 flex flex-col justify-between space-y-4 hover:bg-white hover:shadow-xs transition-all"
                  >
                    <div className="space-y-2">
                      <span className="font-mono text-[10px] uppercase font-bold text-ieee-blue bg-white border border-warm-200 px-2 py-0.5 rounded-[2px] inline-block">
                        {asset.format}
                      </span>
                      <h4 className="font-serif text-lg text-ink font-normal leading-snug">
                        {asset.title}
                      </h4>
                      <p className="text-xs text-warm-400 font-sans leading-relaxed">
                        {asset.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-warm-200">
                      <a
                        href={asset.url}
                        download
                        className="font-mono text-xs font-semibold text-ieee-blue hover:underline"
                      >
                        Download Asset ↓
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
