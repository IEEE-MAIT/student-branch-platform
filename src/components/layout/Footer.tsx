import React from 'react';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';
import { Container } from './Container';
import { ThemeToggle } from './ThemeToggle';
import { FaLinkedinIn, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { FiExternalLink, FiLock, FiArrowRight, FiMapPin } from 'react-icons/fi';

/**
 * @file src/components/layout/Footer.tsx
 * @description Global institutional footer component for IEEE MAIT Student Branch.
 * 
 * LEGAL COMPLIANCE & BRAND SPECIFICATIONS:
 * - 4 Structured Columns with react-icons.
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
              <FiMapPin className="w-3 h-3 text-sky-400" />
              <span>Delhi, India · Est. since 2005</span>
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
                <FaLinkedinIn className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.instagram.com/ieeemait/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IEEE MAIT Instagram"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#DD2A7B] flex items-center justify-center text-white transition-colors"
              >
                <FaInstagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://x.com/IEEE_MAIT"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IEEE MAIT on X"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-black flex items-center justify-center text-white transition-colors"
              >
                <FaXTwitter className="w-3.5 h-3.5" />
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
                  <span className="text-[11px] font-mono text-gray-500 group-hover:text-sky-400 flex items-center gap-1">
                    <span>Overview</span>
                    <FiArrowRight className="w-3 h-3" />
                  </span>
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
                <Link href="/join" className="text-sky-400 hover:underline font-medium flex items-center gap-1.5">
                  <span>Join IEEE MAIT</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
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
                  <FiExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </li>
              <li className="pt-2 border-t border-gray-800 flex items-center justify-between">
                <Link href="/admin" className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1.5">
                  <FiLock className="w-3.5 h-3.5" />
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
