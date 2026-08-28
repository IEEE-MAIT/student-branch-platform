import React from 'react';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';
import { Container } from './Container';
import { ThemeToggle } from './ThemeToggle';
import {
  FaLinkedinIn,
  FaInstagram,
  FaXTwitter,
  FaGithub,
} from 'react-icons/fa6';
import {
  FiExternalLink,
  FiArrowRight,
  FiMapPin,
  FiMail,
  FiGlobe,
  FiZap,
  FiCpu,
  FiShield,
} from 'react-icons/fi';

/**
 * @file src/components/layout/Footer.tsx
 * @description Modern, aesthetic & professional institutional footer for IEEE MAIT.
 * 
 * Features:
 * - Pre-footer Action Banner with instant Join and Support pathways.
 * - 4-Column Responsive Layout with structured hierarchy and rich typography.
 * - Branded social media channels for Student Branch, EDS, and WIE units.
 * - Dynamic copyright year and legal IEEE trademark compliance.
 * - Accessible dark/light mode toggle integration.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-gray-950 text-white relative overflow-hidden border-t border-gray-800/80"
      aria-label="Institutional Footer"
    >
      {/* Subtle Background Radial Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-radial from-sky-500/5 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <Container size="wide">
        {/* ---------------------------------------------------- */}
        {/* PRE-FOOTER CALL-TO-ACTION BANNER */}
        {/* ---------------------------------------------------- */}
        <div className="pt-14 pb-12 border-b border-gray-800/80">
          <div className="rounded-2xl bg-gradient-to-r from-gray-900 via-gray-900 to-sky-950/40 border border-gray-800 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="space-y-2 max-w-2xl relative z-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-mono text-[10px] font-semibold uppercase tracking-wider">
                  <FiGlobe className="w-3 h-3 text-sky-400" />
                  <span>IEEE Region 10 · Delhi Section</span>
                </span>
                <span className="font-mono text-[11px] text-gray-400">
                  Branch Code: STB03681 · Est. 2005
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight">
                Advancing Technology for Humanity.
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
                Join Maharaja Agrasen Institute of Technology’s premier engineering society. Connect with global research networks, hands-on hardware labs, and competitive programming pods.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10">
              <Link
                href="/join"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00629B] to-[#007CBD] hover:from-[#004975] hover:to-[#00629B] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-102 active:scale-98 transition-all"
              >
                <span>Join IEEE MAIT</span>
                <FiArrowRight className="w-4 h-4 text-sky-200" />
              </Link>
              <a
                href="https://www.ieee.org/membership/join/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-mono text-xs font-semibold transition-all"
              >
                <span>IEEE.org Portal</span>
                <FiExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* MAIN 4-COLUMN FOOTER NAVIGATION */}
        {/* ---------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-14 border-b border-gray-800/80">
          {/* Column 1: Institutional Core */}
          <div className="space-y-5">
            <Link
              href="/"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-lg group"
            >
              <Image
                src="/ieee_mait_sb_dark_mode_logo.png"
                alt="IEEE MAIT Student Branch Logo"
                width={280}
                height={70}
                className="w-auto h-12 object-contain opacity-95 group-hover:opacity-100 transition-opacity"
                unoptimized
              />
            </Link>

            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Official chartered student branch at Maharaja Agrasen Institute of Technology, dedicated to fostering technological innovation, academic excellence, and student leadership since 2005.
            </p>

            <div className="space-y-2 text-xs text-gray-400 font-sans">
              <div className="flex items-start gap-2">
                <FiMapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>PSP Area, Sector-22, Rohini, Delhi-110086</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <a
                  href="mailto:mait.ieee.sb@gmail.com"
                  className="text-gray-300 hover:text-sky-400 font-mono text-[11px] transition-colors"
                >
                  mait.ieee.sb@gmail.com
                </a>
              </div>
            </div>

            {/* Social Channels Strip */}
            <div className="space-y-2 pt-1">
              <span className="font-mono text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Connect Across Channels
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="https://www.linkedin.com/company/ieee-mait"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="IEEE MAIT LinkedIn"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#0A66C2] border border-white/10 hover:border-transparent flex items-center justify-center text-gray-300 hover:text-white transition-all shadow-xs"
                  title="IEEE MAIT LinkedIn"
                >
                  <FaLinkedinIn className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.instagram.com/ieeemait/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="IEEE MAIT Instagram"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#E4405F] border border-white/10 hover:border-transparent flex items-center justify-center text-gray-300 hover:text-white transition-all shadow-xs"
                  title="IEEE MAIT Instagram (@ieeemait)"
                >
                  <FaInstagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://x.com/IEEE_MAIT"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="IEEE MAIT on X"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-black border border-white/10 hover:border-transparent flex items-center justify-center text-gray-300 hover:text-white transition-all shadow-xs"
                  title="IEEE MAIT on X"
                >
                  <FaXTwitter className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://github.com/IEEE-MAIT"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="IEEE MAIT GitHub"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-gray-800 border border-white/10 hover:border-transparent flex items-center justify-center text-gray-300 hover:text-white transition-all shadow-xs"
                  title="IEEE MAIT Open Source GitHub"
                >
                  <FaGithub className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.instagram.com/wie.mait/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WIE AG MAIT Instagram"
                  className="px-2.5 h-8 rounded-lg bg-purple-500/10 hover:bg-purple-600 border border-purple-500/20 hover:border-transparent flex items-center gap-1.5 text-purple-300 hover:text-white font-mono text-[11px] font-semibold transition-all shadow-xs"
                  title="IEEE WIE Affinity Group Instagram (@wie.mait)"
                >
                  <FiZap className="w-3 h-3" />
                  <span>WIE</span>
                </a>
                <a
                  href="https://www.instagram.com/ieee_eds_mait_official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="IEEE EDS MAIT Instagram"
                  className="px-2.5 h-8 rounded-lg bg-sky-500/10 hover:bg-sky-600 border border-sky-500/20 hover:border-transparent flex items-center gap-1.5 text-sky-300 hover:text-white font-mono text-[11px] font-semibold transition-all shadow-xs"
                  title="IEEE EDS Chapter Instagram (@ieee_eds_mait_official)"
                >
                  <FiCpu className="w-3 h-3" />
                  <span>EDS</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Chartered Communities & SIGs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                Chartered Units & Hubs
              </h4>
            </div>
            <ul className="space-y-2.5 text-xs text-gray-400 font-sans">
              <li>
                <Link
                  href="/chapters"
                  className="hover:text-white transition-colors flex items-center justify-between group py-1"
                >
                  <span className="group-hover:text-white text-gray-300">All Units Overview</span>
                  <FiArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-sky-400 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/chapters/sb"
                  className="hover:text-white transition-colors flex items-center justify-between group py-1"
                >
                  <span>IEEE MAIT Student Branch</span>
                  <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-gray-300">
                    Parent
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/chapters/eds"
                  className="hover:text-white transition-colors flex items-center justify-between group py-1"
                >
                  <span>IEEE EDS Chapter</span>
                  <span className="text-[10px] font-mono bg-sky-950 text-sky-300 border border-sky-800/60 px-1.5 py-0.5 rounded">
                    Hardware
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/chapters/wie"
                  className="hover:text-white transition-colors flex items-center justify-between group py-1"
                >
                  <span>IEEE WIE Affinity Group</span>
                  <span className="text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800/60 px-1.5 py-0.5 rounded">
                    Mentorship
                  </span>
                </Link>
              </li>
              <li className="pt-2 border-t border-gray-800/70">
                <Link
                  href="/sigs"
                  className="hover:text-white transition-colors flex items-center justify-between group py-1"
                >
                  <span>Special Interest Groups (SIGs)</span>
                  <span className="text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800/60 px-1.5 py-0.5 rounded">
                    Pods
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-white transition-colors flex items-center justify-between group py-1"
                >
                  <span>Technical Projects Hub</span>
                  <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                    Builds
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ieee-blue" />
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                Platform Navigation
              </h4>
            </div>
            <ul className="space-y-2.5 text-xs text-gray-400 font-sans">
              <li>
                <Link href="/events" className="hover:text-white transition-colors block py-1">
                  Events & Technical Workshops
                </Link>
              </li>
              <li>
                <Link href="/people" className="hover:text-white transition-colors block py-1">
                  People & Leadership Directory
                </Link>
              </li>
              <li>
                <Link href="/people/archive" className="hover:text-white transition-colors block py-1">
                  Historical Past ExeComs (2005–Present)
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-white transition-colors block py-1">
                  Achievements & Honors Ledger
                </Link>
              </li>
              <li>
                <Link href="/publications" className="hover:text-white transition-colors block py-1">
                  Articles, Tech Tuesday & Reports
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors block py-1">
                  Documentary Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition-colors block py-1">
                  Search Platform (⌘K)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Institutional Resources & Theme Control */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                Resources & Governance
              </h4>
            </div>
            <ul className="space-y-2.5 text-xs text-gray-400 font-sans">
              <li>
                <Link href="/resources" className="hover:text-white transition-colors block py-1">
                  Digital Library & Newsletters
                </Link>
              </li>
              <li>
                <Link href="/about/history" className="hover:text-white transition-colors block py-1">
                  20-Year Milestones Timeline
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-white transition-colors block py-1">
                  Opportunities & Fellowships
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors block py-1">
                  Contact & Inquiries
                </Link>
              </li>
              <li className="pt-2 border-t border-gray-800/70">
                <a
                  href="https://www.ieee.org/membership/join/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-mono font-semibold transition-all"
                  title="Donate / Support IEEE MAIT Student Branch"
                >
                  <span>Donate to Branch</span>
                  <FiExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </li>

              {/* Clean Theme Switcher Row */}
              <li className="pt-3 border-t border-gray-800/70 flex items-center justify-between">
                <span className="font-mono text-[11px] text-gray-400">Interface Theme</span>
                <ThemeToggle showLabel className="bg-white/10 hover:bg-white/20 border-white/10 text-white hover:text-sky-300" />
              </li>
            </ul>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* LEGAL DISCLAIMERS & COPYRIGHT STRIP */}
        {/* ---------------------------------------------------- */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div className="text-center md:text-left space-y-0.5">
            <p className="font-medium text-gray-300">
              IEEE MAIT Student Branch · Maharaja Agrasen Institute of Technology
            </p>
            <p className="text-gray-400 font-mono text-[11px]">
              PSP Area, Sector-22, Rohini, Delhi-110086 · Affiliated with IEEE Delhi Section (Region 10)
            </p>
          </div>

          <div className="text-center md:text-right space-y-0.5 font-sans">
            <p className="text-gray-300">© {currentYear} IEEE MAIT Student Branch. All rights reserved.</p>
            <p className="text-[11px] text-gray-400">
              IEEE is a registered trademark of the Institute of Electrical and Electronics Engineers, Inc.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};
