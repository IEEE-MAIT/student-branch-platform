'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-warm-200">
      <Container size="wide">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Co-Branding */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="flex flex-col">
              <span className="font-sans font-bold text-xl tracking-tight text-ieee-blue group-hover:text-ieee-dark transition-colors">
                IEEE <span className="font-normal text-ink">MAIT</span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-warm-300">
                Student Branch · Est. 2005
              </span>
            </div>
            <div className="hidden sm:block h-8 w-[1px] bg-warm-200" />
            <div className="hidden md:flex flex-col text-xs text-warm-400 leading-tight">
              <span>Maharaja Agrasen Institute of Technology</span>
              <span className="text-[10px] text-warm-300">PSP Area, Sector-22, Rohini, Delhi</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-ink">
            {/* About Dropdown */}
            <div 
              className="relative py-2"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <Link href="/about" className="hover:text-ieee-blue flex items-center gap-1 transition-colors">
                About
                <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 w-56 bg-white border border-warm-200 shadow-lg py-2 rounded-[2px] z-50">
                  <Link href="/about" className="block px-4 py-2 text-xs hover:bg-ieee-subtle hover:text-ieee-blue transition-colors">
                    About IEEE MAIT
                  </Link>
                  <Link href="/about/ieee" className="block px-4 py-2 text-xs hover:bg-ieee-subtle hover:text-ieee-blue transition-colors">
                    About Global IEEE
                  </Link>
                  <Link href="/about/history" className="block px-4 py-2 text-xs hover:bg-ieee-subtle hover:text-ieee-blue transition-colors">
                    History & Milestones
                  </Link>
                  <Link href="/about/impact" className="block px-4 py-2 text-xs hover:bg-ieee-subtle hover:text-ieee-blue transition-colors">
                    Branch Impact
                  </Link>
                </div>
              )}
            </div>

            <Link href="/people" className="hover:text-ieee-blue transition-colors">
              People
            </Link>

            <Link href="/chapters" className="hover:text-ieee-blue transition-colors">
              Chapters
            </Link>

            <Link href="/events" className="hover:text-ieee-blue transition-colors">
              Events
            </Link>

            <Link href="/achievements" className="hover:text-ieee-blue transition-colors">
              Achievements
            </Link>

            <Link href="/stories" className="hover:text-ieee-blue transition-colors">
              Stories
            </Link>

            <Link href="/gallery" className="hover:text-ieee-blue transition-colors">
              Gallery
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-4">
            <Button href="/join" variant="primary" size="md">
              Join IEEE MAIT
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-ink hover:text-ieee-blue focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </Container>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-warm-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="font-mono text-[11px] text-warm-300 uppercase tracking-widest px-2 pt-2">Navigation</div>
          <Link 
            href="/about" 
            className="block px-2 py-1.5 text-base font-medium hover:text-ieee-blue"
            onClick={() => setMobileMenuOpen(false)}
          >
            About IEEE MAIT
          </Link>
          <Link 
            href="/people" 
            className="block px-2 py-1.5 text-base font-medium hover:text-ieee-blue"
            onClick={() => setMobileMenuOpen(false)}
          >
            People & Leadership
          </Link>
          <Link 
            href="/chapters" 
            className="block px-2 py-1.5 text-base font-medium hover:text-ieee-blue"
            onClick={() => setMobileMenuOpen(false)}
          >
            Chapters & AGs
          </Link>
          <Link 
            href="/events" 
            className="block px-2 py-1.5 text-base font-medium hover:text-ieee-blue"
            onClick={() => setMobileMenuOpen(false)}
          >
            Events & Workshops
          </Link>
          <Link 
            href="/achievements" 
            className="block px-2 py-1.5 text-base font-medium hover:text-ieee-blue"
            onClick={() => setMobileMenuOpen(false)}
          >
            Achievements
          </Link>
          <Link 
            href="/stories" 
            className="block px-2 py-1.5 text-base font-medium hover:text-ieee-blue"
            onClick={() => setMobileMenuOpen(false)}
          >
            Stories & Reports
          </Link>
          <Link 
            href="/gallery" 
            className="block px-2 py-1.5 text-base font-medium hover:text-ieee-blue"
            onClick={() => setMobileMenuOpen(false)}
          >
            Photo Gallery
          </Link>
          <div className="pt-2">
            <Button href="/join" variant="primary" size="md" className="w-full">
              Join IEEE MAIT
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
