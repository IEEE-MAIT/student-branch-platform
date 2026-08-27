import React from 'react';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';
import { Container } from './Container';
import { ThemeToggle } from './ThemeToggle';

/**
 * @file src/components/layout/Footer.tsx
 * @description Global institutional footer component for IEEE MAIT Student Branch.
 * 
 * LEGAL COMPLIANCE & BRAND SPECIFICATIONS:
 * - 4 Structured Columns:
 *   1. Institutional Identity, Campus Coordinates & Social Accounts.
 *   2. Communities & SIGs (Parent SB, EDS Chapter, WIE Affinity Group, SIGs).
 *   3. Quick Navigation (Events, Leadership, Achievements, Gallery, Publications).
 *   4. Resources, Support, Theme Switcher & Officer Access.
 * - Dynamic copyright year evaluation (`new Date().getFullYear()`).
 * - Enforces required IEEE trademark disclaimer text and institutional attribution.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 dark:bg-black text-white pt-16 pb-12 border-t border-gray-800" aria-label="Institutional Footer">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Column 1: Institutional Identity */}
          <div className="space-y-4">
            <Link href="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-light rounded">
              <Image 
                src="/ieee_mait_sb_dark_mode_logo.png" 
                alt="IEEE MAIT Student Branch Logo" 
                width={300} 
                height={80} 
                className="w-auto h-14 object-contain opacity-95 hover:opacity-100 transition-opacity"
                unoptimized
              />
            </Link>
            <div className="accent-rule bg-ieee-blue my-2" aria-hidden="true" />
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-[11px] text-sky-400">
              <span>📍 Delhi, India · Est. since 2005</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-sans mt-2">
              IEEE Student Branch at Maharaja Agrasen Institute of Technology. Advancing technological innovation, research excellence, and empowering student engineers since 2005.
            </p>
            <div className="space-y-1.5 pt-1 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Campus:</span>
                <span>PSP Area, Sector-22, Rohini, Delhi-110086</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Section:</span>
                <span className="text-sky-400 font-mono text-[11px]">IEEE Delhi Section (Region 10)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Email:</span>
                <a 
                  href="mailto:mait.ieee.sb@gmail.com" 
                  className="text-sky-400 hover:underline font-mono text-[11px]"
                >
                  mait.ieee.sb@gmail.com
                </a>
              </div>
            </div>

            {/* Official Social Links in Footer */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/ieee-mait"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IEEE MAIT LinkedIn"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0A66C2] flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/ieeemait/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IEEE MAIT Instagram"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#DD2A7B] flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://x.com/IEEE_MAIT"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IEEE MAIT on X"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-black flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/wie.mait/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WIE AG MAIT Instagram"
                className="w-8 h-8 rounded-full bg-purple-900/40 hover:bg-purple-600 flex items-center justify-center text-purple-200 transition-colors"
                title="WIE AG MAIT"
              >
                <span className="text-[10px] font-bold">WIE</span>
              </a>
              <a
                href="https://www.instagram.com/ieee_eds_mait_official/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IEEE EDS MAIT Instagram"
                className="w-8 h-8 rounded-full bg-sky-900/40 hover:bg-sky-600 flex items-center justify-center text-sky-200 transition-colors"
                title="IEEE EDS MAIT"
              >
                <span className="text-[10px] font-bold">EDS</span>
              </a>
            </div>
          </div>

          {/* Column 2: Communities & SIGs */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-normal text-white">Communities & SIGs</h3>
            <div className="accent-rule bg-ieee-blue my-2" aria-hidden="true" />
            <ul className="space-y-2.5 text-sm text-gray-400 font-sans">
              <li>
                <Link href="/chapters" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>All Units Overview</span>
                  <span className="text-[11px] font-mono text-gray-500 group-hover:text-sky-400">Overview →</span>
                </Link>
              </li>
              <li>
                <Link href="/chapters/sb" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>IEEE MAIT Student Branch</span>
                  <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-gray-300">Parent</span>
                </Link>
              </li>
              <li>
                <Link href="/chapters/eds" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>IEEE EDS Chapter</span>
                  <span className="text-[10px] font-mono bg-sky-900/40 px-1.5 py-0.5 rounded text-sky-300">Hardware</span>
                </Link>
              </li>
              <li>
                <Link href="/chapters/wie" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>IEEE WIE Affinity Group</span>
                  <span className="text-[10px] font-mono bg-purple-900/40 px-1.5 py-0.5 rounded text-purple-300">Mentorship</span>
                </Link>
              </li>
              <li className="pt-2 border-t border-gray-800">
                <Link href="/sigs" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Special Interest Groups (SIGs)</span>
                  <span className="text-[10px] font-mono bg-amber-900/40 px-1.5 py-0.5 rounded text-amber-300">Pods</span>
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Technical Projects Hub</span>
                  <span className="text-[10px] font-mono bg-emerald-900/40 px-1.5 py-0.5 rounded text-emerald-300">Builds</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-normal text-white">Quick Navigation</h3>
            <div className="accent-rule bg-ieee-blue my-2" aria-hidden="true" />
            <ul className="space-y-2.5 text-sm text-gray-400 font-sans">
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
                <Link href="/publications" className="hover:text-white transition-colors">
                  Publications & Tech Tuesday
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Documentary Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-sky-400 hover:underline font-medium flex items-center gap-1">
                  <span>Join IEEE MAIT →</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources, Support & Theme Switcher */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-normal text-white">Resources & Support</h3>
            <div className="accent-rule bg-ieee-blue my-2" aria-hidden="true" />
            <ul className="space-y-2.5 text-sm text-gray-400 font-sans">
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Digital Library & Newsletters
                </Link>
              </li>
              <li>
                <Link href="/about/history" className="hover:text-white transition-colors">
                  20-Year Milestones (Est. 2005)
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-white transition-colors">
                  Opportunities, Grants & Fellowships
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
              <li className="pt-1">
                <a
                  href="https://www.ieee.org/membership/join/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-mono font-semibold transition-all"
                  title="Donate / Support IEEE MAIT Student Branch"
                >
                  <span>Donate to Branch</span>
                  <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
              <li className="pt-2 border-t border-gray-800 flex items-center justify-between">
                <Link href="/admin" className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Officer Portal</span>
                </Link>

                {/* Theme Toggle Button in Footer */}
                <div className="flex items-center">
                  <ThemeToggle showLabel className="bg-white/10 hover:bg-white/20 border-white/10 text-white hover:text-sky-300" />
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimers & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div className="text-center md:text-left">
            <p className="font-medium text-gray-300">
              IEEE MAIT Student Branch · Maharaja Agrasen Institute of Technology
            </p>
            <p className="text-gray-400 mt-0.5 font-mono text-[11px]">
              Delhi, India · Established since 2005 · Affiliated with IEEE Delhi Section · Region 10
            </p>
          </div>
          <div className="text-center md:text-right space-y-0.5 font-sans">
            <p>© {currentYear} IEEE MAIT Student Branch. All rights reserved.</p>
            <p className="text-[11px] text-gray-500">
              IEEE is a registered trademark of the Institute of Electrical and Electronics Engineers, Inc.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};
