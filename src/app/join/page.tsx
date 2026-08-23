/**
 * @file src/app/join/page.tsx
 * @description High-Conversion 3-Tier Membership Gateway & Onboarding Funnel.
 * 
 * STRUCTURE:
 * 1. Breadcrumb & Value Proposition Header
 * 2. 3-Tier Guided Onboarding Funnel:
 *    - Tier 1: Global IEEE Membership (ieee.org + 50% discount)
 *    - Tier 2: IEEE MAIT Branch Registration (Google Form & Society Affiliation)
 *    - Tier 3: Working Committee Recruitment (Technical, PR, Creative, Content, Logistics)
 * 3. Member Benefits Matrix (4 Pillars)
 * 4. Interactive FAQ Accordion
 * 5. High-Conversion Assistance & Action Bar
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

export const metadata = {
  title: 'Join IEEE MAIT Student Branch | Membership & Recruitment',
  description: 'Join the IEEE MAIT Student Branch ecosystem. Follow our 3-tier guided onboarding process to activate Global IEEE membership, branch lab access, and volunteer committee recruitment.',
};

export default function JoinPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white page-enter">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Membership Gateway' },
            ]}
          />

          <SectionHeading
            category="Membership Gateway"
            title="Join IEEE MAIT Student Branch"
            subtitle="Become part of a global technical society of 460,000+ engineers while unlocking hands-on laboratory workshops, hardware project mentorship, and executive leadership tracks at MAIT Delhi."
          />

          {/* ---------------------------------------------------- */}
          {/* 3-TIER GUIDED ONBOARDING FUNNEL */}
          {/* ---------------------------------------------------- */}
          <div className="pt-4 space-y-12">
            <div className="border-b border-warm-200 pb-3">
              <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block">
                Onboarding Roadmap
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-0.5">
                3-Tier Membership Pathway
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* TIER 1: Global IEEE Membership */}
              <div className="border border-warm-200 bg-white rounded-[2px] p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:border-ieee-blue/40 transition-all group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-ieee-blue bg-ieee-subtle px-2.5 py-1 rounded-[2px]">
                      Tier 01
                    </span>
                    <span className="font-mono text-[11px] text-warm-400">Global Enrollment</span>
                  </div>

                  <h3 className="font-serif text-2xl text-ink font-normal group-hover:text-ieee-blue transition-colors">
                    Global IEEE Membership
                  </h3>

                  <p className="text-xs sm:text-sm text-warm-400 font-sans leading-relaxed">
                    Create an account on <strong>ieee.org</strong>, select student membership, and choose <strong>Maharaja Agrasen Institute of Technology</strong> as your university branch.
                  </p>

                  <div className="border-t border-warm-100 pt-3 space-y-2 text-xs font-sans text-ink">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>50% Future50 Student Discount</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>IEEE Xplore Digital Library Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Official @ieee.org Email Alias</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://www.ieee.org/membership/join/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-ieee-blue hover:bg-ieee-dark text-white text-xs font-mono font-semibold rounded-[2px] transition-colors"
                  >
                    <span>Join on IEEE.org ↗</span>
                  </a>
                </div>
              </div>

              {/* TIER 2: Local Branch Registration */}
              <div className="border border-ieee-blue/40 bg-ieee-subtle/20 rounded-[2px] p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:shadow-md transition-all group relative">
                <div className="absolute -top-3 right-6 bg-ieee-blue text-white font-mono text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-[2px]">
                  Required for Lab Access
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-ieee-blue bg-white border border-ieee-blue/30 px-2.5 py-1 rounded-[2px]">
                      Tier 02
                    </span>
                    <span className="font-mono text-[11px] text-warm-400">Campus Verification</span>
                  </div>

                  <h3 className="font-serif text-2xl text-ink font-normal group-hover:text-ieee-blue transition-colors">
                    MAIT Branch Verification
                  </h3>

                  <p className="text-xs sm:text-sm text-warm-400 font-sans leading-relaxed">
                    Submit your official 8-digit IEEE Member # via our campus registration form to verify your status with branch records and community channels.
                  </p>

                  <div className="border-t border-ieee-blue/10 pt-3 space-y-2 text-xs font-sans text-ink">
                    <div className="flex items-center gap-2">
                      <span className="text-ieee-blue font-bold">✓</span>
                      <span>Hardware & ECE Lab Bench Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-ieee-blue font-bold">✓</span>
                      <span>EDS Chapter & WIE Community Enrollment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-ieee-blue font-bold">✓</span>
                      <span>Free Entry to Technical Workshops</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://forms.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-ink hover:bg-warm-500 text-white text-xs font-mono font-semibold rounded-[2px] transition-colors"
                  >
                    <span>Submit Verification Form →</span>
                  </a>
                </div>
              </div>

              {/* TIER 3: Working Committee Recruitment */}
              <div className="border border-warm-200 bg-white rounded-[2px] p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:border-ieee-blue/40 transition-all group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-warm-500 bg-warm-100 px-2.5 py-1 rounded-[2px]">
                      Tier 03
                    </span>
                    <span className="font-mono text-[11px] text-warm-400">Leadership Track</span>
                  </div>

                  <h3 className="font-serif text-2xl text-ink font-normal group-hover:text-ieee-blue transition-colors">
                    Working Committee Recruitment
                  </h3>

                  <p className="text-xs sm:text-sm text-warm-400 font-sans leading-relaxed">
                    Join one of our 5 active working committees to contribute directly to hackathon organizing, web platforms, hardware labs, and public relations.
                  </p>

                  <div className="border-t border-warm-100 pt-3 space-y-2 text-xs font-sans text-ink">
                    <div className="flex items-center gap-2">
                      <span className="text-warm-400 font-bold">●</span>
                      <span>Technical Team (Web, Hardware, TinyML)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-warm-400 font-bold">●</span>
                      <span>PR, Sponsorships & Corporate Relations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-warm-400 font-bold">●</span>
                      <span>Design, Media, Content & Event Logistics</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-warm-300 hover:border-ieee-blue text-ink hover:text-ieee-blue text-xs font-mono font-semibold rounded-[2px] transition-colors"
                  >
                    <span>Recruitment Inquiries →</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* VALUE PROPOSITION MATRIX */}
            {/* ---------------------------------------------------- */}
            <section className="border-t border-warm-200 pt-16 space-y-8">
              <div>
                <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block mb-1">
                  Membership Benefits
                </span>
                <h2 className="font-serif text-3xl text-ink font-normal">
                  Why Engineers Choose IEEE MAIT
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 border border-warm-200 bg-warm-50/50 rounded-[2px] space-y-2.5">
                  <span className="font-mono text-xs font-bold text-ieee-blue uppercase">01 · Global Network</span>
                  <h4 className="font-serif text-xl text-ink font-normal">460K+ Technologists</h4>
                  <p className="text-xs text-warm-400 font-sans leading-relaxed">
                    Collaborate with engineers, IEEE Fellows, and student branches across 160+ countries globally.
                  </p>
                </div>

                <div className="p-6 border border-warm-200 bg-warm-50/50 rounded-[2px] space-y-2.5">
                  <span className="font-mono text-xs font-bold text-ieee-blue uppercase">02 · Lab & Hardware</span>
                  <h4 className="font-serif text-xl text-ink font-normal">Bench & Kit Access</h4>
                  <p className="text-xs text-warm-400 font-sans leading-relaxed">
                    Hands-on access to STM32, ESP32, oscilloscopes, and KiCad multi-layer PCB design workshops.
                  </p>
                </div>

                <div className="p-6 border border-warm-200 bg-warm-50/50 rounded-[2px] space-y-2.5">
                  <span className="font-mono text-xs font-bold text-ieee-blue uppercase">03 · Mentorship</span>
                  <h4 className="font-serif text-xl text-ink font-normal">WIE & EDS Tracks</h4>
                  <p className="text-xs text-warm-400 font-sans leading-relaxed">
                    Personalized 1-on-1 guidance from senior students and faculty advisors for research papers and travel grants.
                  </p>
                </div>

                <div className="p-6 border border-warm-200 bg-warm-50/50 rounded-[2px] space-y-2.5">
                  <span className="font-mono text-xs font-bold text-ieee-blue uppercase">04 · Verified Honors</span>
                  <h4 className="font-serif text-xl text-ink font-normal">Executive Credentials</h4>
                  <p className="text-xs text-warm-400 font-sans leading-relaxed">
                    Verified branch leadership records recognized in higher education applications and corporate technical roles.
                  </p>
                </div>
              </div>
            </section>

            {/* ---------------------------------------------------- */}
            {/* INTERACTIVE FAQ ACCORDION */}
            {/* ---------------------------------------------------- */}
            <section className="border-t border-warm-200 pt-16 space-y-8">
              <div>
                <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest block mb-1">
                  Common Inquiries
                </span>
                <h2 className="font-serif text-3xl text-ink font-normal">
                  Frequently Asked Questions
                </h2>
              </div>

              <JoinFaqAccordion />
            </section>

            {/* ---------------------------------------------------- */}
            {/* HIGH CONVERSION ASSISTANCE BANNER */}
            {/* ---------------------------------------------------- */}
            <div className="p-8 sm:p-10 border border-ieee-blue/20 bg-ieee-subtle/30 rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ieee-blue block">
                  Support Desk
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                  Need Help with IEEE Registration?
                </h3>
                <p className="text-xs sm:text-sm text-warm-400 font-sans leading-relaxed">
                  Our membership team offers guided registration sessions and coupon code assistance. Reach out to our campus desk or email us anytime.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button href="/contact" variant="primary" size="md">
                  Contact Support Desk →
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
