import React from 'react';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';
import { Container } from './Container';

/**
 * @file src/components/layout/Footer.tsx
 * @description Global institutional footer component for IEEE MAIT Student Branch.
 * 
 * LEGAL COMPLIANCE & BRAND SPECIFICATIONS:
 * - 4 Structured Columns:
 *   1. Institutional Identity & Campus Coordinates (Region 10, Delhi Section, Rohini Campus).
 *   2. Communities & Chartered Units (Parent SB, EDS Chapter, WIE Affinity Group).
 *   3. Quick Navigation (Events, Leadership, Achievements, Gallery, Stories).
 *   4. Resources & Governance (Newsletters, Reports, Brand Toolkit, Admin Portal).
 * - Dynamic copyright year evaluation (`new Date().getFullYear()`).
 * - Enforces required IEEE trademark disclaimer text and institutional attribution.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white pt-16 pb-12 border-t border-warm-300/20" aria-label="Institutional Footer">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Institutional Identity */}
          <div className="space-y-4">
            <Link href="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-light rounded">
              <Image 
                src="/main_student_branch_logo.png" 
                alt="IEEE MAIT Student Branch Logo" 
                width={300} 
                height={80} 
                className="w-auto h-14 object-contain filter brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                unoptimized
              />
            </Link>
            <div className="accent-rule bg-ieee-blue my-2" aria-hidden="true" />
            <p className="text-xs text-warm-300 leading-relaxed font-sans">
              IEEE Student Branch at Maharaja Agrasen Institute of Technology. Advancing technological innovation, fostering research excellence, and empowering student engineers since 2005.
            </p>
            <div className="space-y-1.5 pt-1 text-xs text-warm-300">
              <div className="flex items-center gap-2">
                <span className="text-warm-400">Campus:</span>
                <span>PSP Area, Sector-22, Rohini, Delhi-110086</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-warm-400">Section:</span>
                <span className="text-ieee-light font-mono text-[11px]">IEEE Delhi Section (Region 10)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-warm-400">Email:</span>
                <a 
                  href="mailto:mait.ieee.sb@gmail.com" 
                  className="text-ieee-light hover:underline font-mono text-[11px]"
                >
                  mait.ieee.sb@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Communities & Units */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-normal text-white">Communities</h3>
            <div className="accent-rule bg-ieee-blue my-2" aria-hidden="true" />
            <ul className="space-y-2.5 text-sm text-warm-300 font-sans">
              <li>
                <Link href="/chapters" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>All Units Overview</span>
                  <span className="text-[11px] font-mono text-warm-400 group-hover:text-ieee-light">Overview →</span>
                </Link>
              </li>
              <li>
                <Link href="/chapters/sb" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>IEEE MAIT Student Branch</span>
                  <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-warm-300">Parent</span>
                </Link>
              </li>
              <li>
                <Link href="/chapters/eds" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>IEEE EDS Chapter</span>
                  <span className="text-[10px] font-mono bg-ieee-blue/40 px-1.5 py-0.5 rounded text-ieee-light">Hardware</span>
                </Link>
              </li>
              <li>
                <Link href="/chapters/wie" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>IEEE WIE Affinity Group</span>
                  <span className="text-[10px] font-mono bg-purple-900/40 px-1.5 py-0.5 rounded text-purple-300">Mentorship</span>
                </Link>
              </li>
              <li className="pt-2 border-t border-white/10">
                <Link href="/about/impact" className="text-xs text-ieee-light hover:underline flex items-center gap-1">
                  <span>Branch Impact & Record →</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-normal text-white">Quick Navigation</h3>
            <div className="accent-rule bg-ieee-blue my-2" aria-hidden="true" />
            <ul className="space-y-2.5 text-sm text-warm-300 font-sans">
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Events & Technical Workshops
                </Link>
              </li>
              <li>
                <Link href="/people" className="hover:text-white transition-colors">
                  People & Leadership Directory
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-white transition-colors">
                  Achievements & Awards Ledger
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Documentary Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-white transition-colors">
                  Stories & Technical Reports
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-ieee-light hover:underline font-medium flex items-center gap-1">
                  <span>Join IEEE MAIT →</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources & Governance */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-normal text-white">Resources & Governance</h3>
            <div className="accent-rule bg-ieee-blue my-2" aria-hidden="true" />
            <ul className="space-y-2.5 text-sm text-warm-300 font-sans">
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Branch Newsletters & Library
                </Link>
              </li>
              <li>
                <Link href="/about/history" className="hover:text-white transition-colors">
                  20-Year Milestones (Est. 2005)
                </Link>
              </li>
              <li>
                <Link href="/about/ieee" className="hover:text-white transition-colors">
                  Global IEEE & Region 10
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
              <li className="pt-2 border-t border-white/10">
                <Link href="/admin" className="text-xs text-warm-400 hover:text-warm-200 transition-colors flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Officer Portal Login</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimers & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-warm-300/80 gap-4">
          <div className="text-center md:text-left">
            <p className="font-medium text-warm-200">
              IEEE MAIT Student Branch · Maharaja Agrasen Institute of Technology
            </p>
            <p className="text-warm-400 mt-0.5 font-mono text-[11px]">
              Affiliated with IEEE Delhi Section · Region 10 (Asia-Pacific) · Established 2005
            </p>
          </div>
          <div className="text-center md:text-right space-y-0.5 font-sans">
            <p>© {currentYear} IEEE MAIT Student Branch. All rights reserved.</p>
            <p className="text-[11px] text-warm-400">
              IEEE is a registered trademark of the Institute of Electrical and Electronics Engineers, Inc.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};
