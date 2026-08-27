/**
 * @file src/app/join/page.tsx
 * @description Official Membership Onboarding & Step-by-Step Conversion Portal with react-icons.
 * 
 * LEGAL COMPLIANCE & BRAND SPECIFICATIONS:
 * - Enforces required IEEE Student Membership steps with global portal link (ieee.org).
 * - Clear 3-tier membership guidance (Tier 1: Global IEEE, Tier 2: Branch Verification, Tier 3: ExeCom Recruitment).
 * - Value proposition matrix highlighting IEEE Xplore, Travel Grants, and Lab Access.
 * - Interactive FAQ accordion for freshers and prospective members.
 * - WCAG AA compliant colors, monospaced metadata, and serif editorial headings.
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
import { Button } from '@/components/ui/Button';
import { JoinFaqAccordion } from '@/components/content/JoinFaqAccordion';
import Link from '@/components/ui/AppLink';
import { FiCheck, FiExternalLink, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join IEEE MAIT Student Branch | Membership Registration',
  description:
    'Join IEEE MAIT Student Branch. Access global technical communities, lab equipment, hardware workshops, research fellowships, and leadership opportunities.',
};

export default function JoinPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
        <Container size="default">
          {/* Breadcrumbs */}
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Join IEEE MAIT' },
            ]}
          />

          {/* Hero Header */}
          <SectionHeading
            category="Membership Onboarding"
            title="Join the Global Engineering Network"
            subtitle="Become an active member of IEEE MAIT. Accelerate your career with technical workshops, international conferences, lab access, and executive leadership."
          />

          <div className="space-y-16 pt-8">
            {/* ---------------------------------------------------- */}
            {/* 3-TIER ONBOARDING PATHWAYS */}
            {/* ---------------------------------------------------- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* TIER 1: Global IEEE Membership */}
              <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:border-ieee-blue/40 dark:hover:border-sky-500/40 transition-all group shadow-xs">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-ieee-blue dark:text-sky-400 bg-ieee-subtle dark:bg-sky-950 px-2.5 py-1 rounded-full">
                      Tier 01
                    </span>
                    <span className="font-mono text-[11px] text-warm-400 dark:text-gray-400">Global Registry</span>
                  </div>

                  <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors">
                    Global IEEE Membership
                  </h3>

                  <p className="text-xs sm:text-sm text-warm-500 dark:text-gray-400 font-sans leading-relaxed">
                    Create an account on <strong>ieee.org</strong>, select student membership, and choose <strong>Maharaja Agrasen Institute of Technology</strong> as your university branch.
                  </p>

                  <div className="border-t border-warm-100 dark:border-gray-800 pt-3 space-y-2 text-xs font-sans text-ink dark:text-gray-200">
                    <div className="flex items-center gap-2">
                      <FiCheck className="text-emerald-600 dark:text-emerald-400 shrink-0 w-4 h-4" />
                      <span>50% Future50 Student Discount</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheck className="text-emerald-600 dark:text-emerald-400 shrink-0 w-4 h-4" />
                      <span>IEEE Xplore Digital Library Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheck className="text-emerald-600 dark:text-emerald-400 shrink-0 w-4 h-4" />
                      <span>Official @ieee.org Email Alias</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://www.ieee.org/membership/join/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white text-xs font-mono font-semibold rounded-lg transition-colors shadow-xs"
                  >
                    <span>Join on IEEE.org</span>
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* TIER 2: Local Branch Registration */}
              <div className="border border-ieee-blue/40 dark:border-sky-700 bg-ieee-subtle/20 dark:bg-sky-950/20 rounded-xl p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:shadow-md transition-all group relative shadow-xs">
                <div className="absolute -top-3 right-6 bg-ieee-blue dark:bg-sky-600 text-white font-mono text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  Required for Lab Access
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-ieee-blue dark:text-sky-400 bg-white dark:bg-gray-800 border border-ieee-blue/30 dark:border-sky-700 px-2.5 py-1 rounded-full">
                      Tier 02
                    </span>
                    <span className="font-mono text-[11px] text-warm-400 dark:text-gray-400">Campus Verification</span>
                  </div>

                  <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors">
                    MAIT Branch Verification
                  </h3>

                  <p className="text-xs sm:text-sm text-warm-500 dark:text-gray-400 font-sans leading-relaxed">
                    Submit your official 8-digit IEEE Member # via our campus registration form to verify your status with branch records and community channels.
                  </p>

                  <div className="border-t border-ieee-blue/10 dark:border-sky-800/60 pt-3 space-y-2 text-xs font-sans text-ink dark:text-gray-200">
                    <div className="flex items-center gap-2">
                      <FiCheck className="text-ieee-blue dark:text-sky-400 shrink-0 w-4 h-4" />
                      <span>Hardware & ECE Lab Bench Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheck className="text-ieee-blue dark:text-sky-400 shrink-0 w-4 h-4" />
                      <span>EDS Chapter & WIE Community Enrollment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheck className="text-ieee-blue dark:text-sky-400 shrink-0 w-4 h-4" />
                      <span>Free Entry to Technical Workshops</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://forms.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-ink dark:bg-gray-800 hover:bg-black dark:hover:bg-gray-700 text-white text-xs font-mono font-semibold rounded-lg transition-colors shadow-xs"
                  >
                    <span>Submit Verification Form</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* TIER 3: Working Committee Recruitment */}
              <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:border-ieee-blue/40 dark:hover:border-sky-500/40 transition-all group shadow-xs">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-warm-600 dark:text-gray-300 bg-warm-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                      Tier 03
                    </span>
                    <span className="font-mono text-[11px] text-warm-400 dark:text-gray-400">Leadership Track</span>
                  </div>

                  <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors">
                    Working Committee Recruitment
                  </h3>

                  <p className="text-xs sm:text-sm text-warm-500 dark:text-gray-400 font-sans leading-relaxed">
                    Join one of our 5 active working committees to contribute directly to hackathon organizing, web platforms, hardware labs, and public relations.
                  </p>

                  <div className="border-t border-warm-100 dark:border-gray-800 pt-3 space-y-2 text-xs font-sans text-ink dark:text-gray-200">
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="text-warm-400 dark:text-gray-500 shrink-0 w-3.5 h-3.5" />
                      <span>Technical Team (Web, Hardware, TinyML)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="text-warm-400 dark:text-gray-500 shrink-0 w-3.5 h-3.5" />
                      <span>PR, Sponsorships & Corporate Relations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="text-warm-400 dark:text-gray-500 shrink-0 w-3.5 h-3.5" />
                      <span>Design, Media, Content & Event Logistics</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-warm-300 dark:border-gray-700 hover:border-ieee-blue text-ink dark:text-gray-200 hover:text-ieee-blue dark:hover:text-sky-400 text-xs font-mono font-semibold rounded-lg transition-colors shadow-xs"
                  >
                    <span>Recruitment Inquiries</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* VALUE PROPOSITION MATRIX */}
            {/* ---------------------------------------------------- */}
            <section className="border-t border-warm-200 dark:border-gray-800 pt-16 space-y-8">
              <div>
                <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block mb-1">
                  Membership Benefits
                </span>
                <h2 className="font-serif text-3xl text-ink dark:text-gray-100 font-normal">
                  Why Engineers Choose IEEE MAIT
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/50 rounded-xl space-y-2.5">
                  <span className="font-mono text-xs font-bold text-ieee-blue dark:text-sky-400 uppercase">01 · Global Network</span>
                  <h4 className="font-serif text-xl text-ink dark:text-gray-100 font-normal">460K+ Technologists</h4>
                  <p className="text-xs text-warm-500 dark:text-gray-400 font-sans leading-relaxed">
                    Collaborate with engineers, IEEE Fellows, and student branches across 160+ countries globally.
                  </p>
                </div>

                <div className="p-6 border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/50 rounded-xl space-y-2.5">
                  <span className="font-mono text-xs font-bold text-ieee-blue dark:text-sky-400 uppercase">02 · Lab & Hardware</span>
                  <h4 className="font-serif text-xl text-ink dark:text-gray-100 font-normal">Bench & Kit Access</h4>
                  <p className="text-xs text-warm-500 dark:text-gray-400 font-sans leading-relaxed">
                    Hands-on access to STM32, ESP32, oscilloscopes, and KiCad multi-layer PCB design workshops.
                  </p>
                </div>

                <div className="p-6 border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/50 rounded-xl space-y-2.5">
                  <span className="font-mono text-xs font-bold text-ieee-blue dark:text-sky-400 uppercase">03 · Mentorship</span>
                  <h4 className="font-serif text-xl text-ink dark:text-gray-100 font-normal">WIE & EDS Tracks</h4>
                  <p className="text-xs text-warm-500 dark:text-gray-400 font-sans leading-relaxed">
                    Personalized 1-on-1 guidance from senior students and faculty advisors for research papers and travel grants.
                  </p>
                </div>

                <div className="p-6 border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/50 rounded-xl space-y-2.5">
                  <span className="font-mono text-xs font-bold text-ieee-blue dark:text-sky-400 uppercase">04 · Verified Honors</span>
                  <h4 className="font-serif text-xl text-ink dark:text-gray-100 font-normal">Executive Credentials</h4>
                  <p className="text-xs text-warm-500 dark:text-gray-400 font-sans leading-relaxed">
                    Verified branch leadership records recognized in higher education applications and corporate technical roles.
                  </p>
                </div>
              </div>
            </section>

            {/* ---------------------------------------------------- */}
            {/* INTERACTIVE FAQ ACCORDION */}
            {/* ---------------------------------------------------- */}
            <section className="border-t border-warm-200 dark:border-gray-800 pt-16 space-y-8">
              <div>
                <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block mb-1">
                  Common Inquiries
                </span>
                <h2 className="font-serif text-3xl text-ink dark:text-gray-100 font-normal">
                  Frequently Asked Questions
                </h2>
              </div>

              <JoinFaqAccordion />
            </section>

            {/* ---------------------------------------------------- */}
            {/* HIGH CONVERSION ASSISTANCE BANNER */}
            {/* ---------------------------------------------------- */}
            <div className="p-8 sm:p-10 border border-ieee-blue/20 dark:border-sky-800 bg-ieee-subtle/30 dark:bg-sky-950/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-2 max-w-xl">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ieee-blue dark:text-sky-400 block">
                  Support Desk
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ink dark:text-gray-100 font-normal">
                  Need Help with IEEE Registration?
                </h3>
                <p className="text-xs sm:text-sm text-warm-500 dark:text-gray-300 font-sans leading-relaxed">
                  Our membership team offers guided registration sessions and coupon code assistance. Reach out to our campus desk or email us anytime.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button href="/contact" variant="primary" size="md" className="flex items-center gap-1.5">
                  <span>Contact Support Desk</span>
                  <FiArrowRight className="w-4 h-4" />
                </Button>
                <Button href="/chapters" variant="secondary" size="md">
                  Explore Communities
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
