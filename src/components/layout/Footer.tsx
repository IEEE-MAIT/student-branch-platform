import React from 'react';
import Link from 'next/link';
import { Container } from './Container';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white pt-16 pb-12 border-t border-warm-300/20">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: About */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-normal text-white">About</h3>
            <div className="accent-rule bg-ieee-blue my-2" />
            <ul className="space-y-2.5 text-sm text-warm-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About IEEE MAIT
                </Link>
              </li>
              <li>
                <Link href="/about/ieee" className="hover:text-white transition-colors">
                  About Global IEEE
                </Link>
              </li>
              <li>
                <Link href="/about/history" className="hover:text-white transition-colors">
                  History & Milestones (Est. 2005)
                </Link>
              </li>
              <li>
                <Link href="/about/impact" className="hover:text-white transition-colors">
                  Branch Impact & Record
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-normal text-white">Quick Links</h3>
            <div className="accent-rule bg-ieee-blue my-2" />
            <ul className="space-y-2.5 text-sm text-warm-300">
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Upcoming & Past Events
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-white transition-colors">
                  Achievements Ledger
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-ieee-light hover:underline font-medium">
                  Join IEEE MAIT →
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Branch
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-normal text-white">Connect</h3>
            <div className="accent-rule bg-ieee-blue my-2" />
            <ul className="space-y-2.5 text-sm text-warm-300">
              <li>
                <a href="mailto:mait.ieee.sb@gmail.com" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>Email:</span>
                  <span className="font-mono text-xs text-ieee-light">mait.ieee.sb@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com/IEEE-MAIT" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  GitHub (Open Source)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Institutional Context */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-normal text-white">IEEE MAIT</h3>
            <div className="accent-rule bg-ieee-blue my-2" />
            <p className="text-xs text-warm-300 leading-relaxed">
              IEEE Student Branch at Maharaja Agrasen Institute of Technology, Delhi. Advancing technology, building community, and fostering technical excellence since 2005.
            </p>
            <div className="pt-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ieee-light bg-ieee-dark/50 px-2.5 py-1 rounded-[2px] inline-block">
                Delhi Section · Region 10
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Legal Trademarks */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-warm-300/80 gap-4">
          <div>
            <p>
              IEEE MAIT Student Branch · Maharaja Agrasen Institute of Technology
            </p>
            <p className="text-warm-300/60 mt-0.5">
              PSP Area, Plot No-1, Sector-22, Rohini, Delhi-110086
            </p>
          </div>
          <div className="text-center md:text-right space-y-0.5">
            <p>© {currentYear} IEEE MAIT Student Branch. All rights reserved.</p>
            <p className="text-[11px] text-warm-300/50">
              IEEE is a registered trademark of the Institute of Electrical and Electronics Engineers, Inc.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};
