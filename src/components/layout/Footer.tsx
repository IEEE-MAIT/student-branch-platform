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
import { FiExternalLink, FiMapPin, FiMail, FiSearch, FiArrowRight } from 'react-icons/fi';

/**
 * @file src/components/layout/Footer.tsx
 * @description Modern, premium institutional footer for IEEE MAIT Student Branch.
 * 
 * DESIGN SPECIFICATIONS:
 * 1. Prominent Top Logo Showcase: Displays IEEE MAIT SB, WIE, and EDS logos in full clarity.
 * 2. Balanced 4-Column Directory: Structured links for Communities, Platform, Resources, and IEEE Global.
 * 3. Minimal Bottom Bar: Copyright, legal trademark disclaimers, utility search, and high-contrast theme switcher.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-gray-950 dark:bg-black text-white border-t border-gray-800 relative"
      aria-label="Institutional Footer"
    >
      <Container size="default">
        {/* ---------------------------------------------------- */}
        {/* TOP TIER: PROMINENT CHARTERED LOGOS & BADGE */}
        {/* ---------------------------------------------------- */}
        <div className="py-8 border-b border-gray-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Prominent High-Resolution Logos Showcase */}
          <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
            <Link
              href="/"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded transition-transform hover:scale-[1.02]"
              aria-label="IEEE MAIT Student Branch"
              title="IEEE MAIT Student Branch"
            >
              <Image
                src="/ieee_mait_sb_dark_mode_logo.png"
                alt="IEEE MAIT Student Branch Logo"
                width={240}
                height={60}
                className="w-auto h-10 sm:h-12 object-contain"
                unoptimized
              />
            </Link>

            <div className="h-8 w-px bg-gray-800 hidden sm:block" aria-hidden="true" />

            <Link
              href="/chapters/wie"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded transition-transform hover:scale-[1.02]"
              aria-label="IEEE WIE Affinity Group MAIT"
              title="IEEE Women in Engineering (WIE) Affinity Group"
            >
              <Image
                src="/wie_mait_dark_mode_logo.png"
                alt="IEEE WIE Affinity Group MAIT Logo"
                width={160}
                height={48}
                className="w-auto h-9 sm:h-10 object-contain"
                unoptimized
              />
            </Link>

            <div className="h-8 w-px bg-gray-800 hidden sm:block" aria-hidden="true" />

            <Link
              href="/chapters/eds"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded transition-transform hover:scale-[1.02]"
              aria-label="IEEE EDS Chapter MAIT"
              title="IEEE Electron Devices Society (EDS) Chapter"
            >
              <Image
                src="/eds_mait_sb_dark_mode_logo.png"
                alt="IEEE EDS Chapter MAIT Logo"
                width={160}
                height={48}
                className="w-auto h-9 sm:h-10 object-contain"
                unoptimized
              />
            </Link>
          </div>

          {/* Institutional Charter Pill & Join CTA */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <div className="hidden xl:flex flex-col text-right font-mono text-[11px] text-gray-400 leading-tight">
              <span className="text-gray-300 font-semibold">STB03681 · Est. 2005</span>
              <span>IEEE Delhi Section · Region 10</span>
            </div>
            <Link
              href="/join"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ieee-blue hover:bg-[#004975] text-white font-mono text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <span>Join IEEE MAIT</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* MAIN 4-COLUMN DIRECTORY */}
        {/* ---------------------------------------------------- */}
        <div className="py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 border-b border-gray-800/80">
          {/* Column 1: Institutional Core & Contact */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-medium text-white">
                IEEE Student Branch
              </h4>
              <p className="text-xs text-gray-400 font-sans">
                Maharaja Agrasen Institute of Technology, Delhi
              </p>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              Dedicated to advancing technological innovation, academic research, hardware prototyping, and student leadership since 2005.
            </p>

            <div className="space-y-1 text-xs text-gray-300 font-sans pt-1">
              <div className="flex items-start gap-2">
                <FiMapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>PSP Area, Sector-22, Rohini, Delhi 110086</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <a
                  href="mailto:mait.ieee.sb@gmail.com"
                  className="text-gray-200 hover:text-sky-400 font-mono text-xs transition-colors"
                >
                  mait.ieee.sb@gmail.com
                </a>
              </div>
            </div>

            {/* Social Icons Strip */}
            <div className="pt-2 flex items-center gap-2">
              <a
                href="https://www.linkedin.com/company/ieee-mait"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IEEE MAIT on LinkedIn"
                className="w-8 h-8 rounded-lg bg-gray-900 hover:bg-[#0A66C2] border border-gray-800 hover:border-transparent text-gray-300 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                title="LinkedIn: IEEE MAIT"
              >
                <FaLinkedinIn className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.instagram.com/ieeemait/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IEEE MAIT on Instagram"
                className="w-8 h-8 rounded-lg bg-gray-900 hover:bg-[#E4405F] border border-gray-800 hover:border-transparent text-gray-300 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                title="Instagram: @ieeemait"
              >
                <FaInstagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://x.com/IEEE_MAIT"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IEEE MAIT on X"
                className="w-8 h-8 rounded-lg bg-gray-900 hover:bg-black border border-gray-800 hover:border-transparent text-gray-300 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                title="X: @IEEE_MAIT"
              >
                <FaXTwitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://github.com/IEEE-MAIT"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IEEE MAIT on GitHub"
                className="w-8 h-8 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-transparent text-gray-300 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                title="GitHub: IEEE-MAIT"
              >
                <FaGithub className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Communities & Hubs */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-100">
              Communities & Units
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-gray-300 font-sans">
              <li>
                <Link href="/chapters/sb" className="hover:text-white transition-colors block">
                  Main Student Branch (SB)
                </Link>
              </li>
              <li>
                <Link href="/chapters/eds" className="hover:text-white transition-colors block">
                  EDS Technical Chapter
                </Link>
              </li>
              <li>
                <Link href="/chapters/wie" className="hover:text-white transition-colors block">
                  WIE Affinity Group
                </Link>
              </li>
              <li>
                <Link href="/sigs" className="hover:text-white transition-colors block">
                  Special Interest Groups (SIGs)
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors block">
                  Student Technical Projects
                </Link>
              </li>
              <li>
                <Link href="/people" className="hover:text-white transition-colors block">
                  People & Leadership Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Archives */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-100">
              Platform & Archives
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-gray-300 font-sans">
              <li>
                <Link href="/events" className="hover:text-white transition-colors block">
                  Events & Workshops
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-white transition-colors block">
                  Awards & Achievements
                </Link>
              </li>
              <li>
                <Link href="/publications" className="hover:text-white transition-colors block">
                  Publications & Tech Tuesday
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors block">
                  Documentary Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/people/archive" className="hover:text-white transition-colors block">
                  Leadership Archive (2005–Present)
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors block">
                  Resources & Documents
                </Link>
              </li>
              <li>
                <Link href="/about/history" className="hover:text-white transition-colors block">
                  Milestones & History
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: IEEE Global & Affiliations */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-100">
              IEEE Global Network
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-gray-300 font-sans">
              <li>
                <a
                  href="https://www.ieee.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>IEEE.org Portal</span>
                  <FiExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://ieeedelhi.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>IEEE Delhi Section</span>
                  <FiExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://ieeer10.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>IEEE Region 10 (Asia-Pacific)</span>
                  <FiExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://ieeexplore.ieee.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>IEEE Xplore Digital Library</span>
                  <FiExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://spectrum.ieee.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>IEEE Spectrum Magazine</span>
                  <FiExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ieee.org/membership/join/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Join IEEE Global Membership</span>
                  <FiExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* BOTTOM BAR: COPYRIGHT, UTILITIES & THEME TOGGLE */}
        {/* ---------------------------------------------------- */}
        <div className="py-5 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div className="text-center md:text-left space-y-0.5">
            <p className="text-gray-300 font-medium">
              © {currentYear} IEEE MAIT Student Branch. All rights reserved.
            </p>
            <p className="text-[11px] text-gray-400">
              IEEE is a registered trademark of the Institute of Electrical and Electronics Engineers, Inc.
            </p>
          </div>

          <div className="flex items-center gap-5 flex-wrap justify-center text-xs">
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/search" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <FiSearch className="w-3 h-3" />
              <span>Search (⌘K)</span>
            </Link>
            <ThemeToggle variant="footer" showLabel />
          </div>
        </div>
      </Container>
    </footer>
  );
};
