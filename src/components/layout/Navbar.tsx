'use client';

/**
 * @file src/components/layout/Navbar.tsx
 * @description Main sticky global navigation bar for IEEE MAIT Student Branch website.
 * 
 * BRAND COMPLIANCE & CLEAR SPACE RULES:
 * - Displays the official IEEE MAIT identifier with strict clear space rules.
 * - Divider line separates the IEEE identifier from MAIT institutional context.
 * - Enforces active route highlighting in IEEE Blue (#00629B).
 * - Provides accessible mobile drawer navigation and desktop dropdowns.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 */

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Container } from './Container';
import { Button } from '../ui/Button';

/**
 * Global Navigation Header Component.
 */
export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        router.push('/search');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  /**
   * Helper to check if a route path is currently active.
   * @param path Target route URL
   */
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  /**
   * Generates active navigation link styling.
   * @param path Target route URL
   */
  const linkClasses = (path: string) =>
    `transition-colors ${
      isActive(path)
        ? 'text-ieee-blue font-semibold border-b-2 border-ieee-blue pb-1'
        : 'text-ink hover:text-ieee-blue'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-warm-200">
      <Container size="wide">
        <div className="flex items-center justify-between h-20">
          {/* IEEE + MAIT Co-Branding Header */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="flex flex-col justify-center py-2">
              <Image 
                src="/main_student_branch_logo.png" 
                alt="IEEE MAIT Student Branch Logo" 
                width={300} 
                height={80} 
                className="w-auto h-14 object-contain group-hover:opacity-90 transition-opacity"
                priority
              />
            </div>
            <div className="hidden sm:block h-8 w-[1px] bg-warm-200" />
            <div className="hidden md:flex flex-col text-xs text-warm-400 leading-tight">
              <span>Maharaja Agrasen Institute of Technology</span>
              <span className="text-[10px] text-warm-300">PSP Area, Sector-22, Rohini, Delhi</span>
            </div>
          </Link>

          {/* Desktop Navigation Link Menu */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {/* About Sub-menu Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <Link href="/about" className={`${linkClasses('/about')} flex items-center gap-1`}>
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

            <Link href="/people" className={linkClasses('/people')}>
              People
            </Link>

            <Link href="/chapters" className={linkClasses('/chapters')}>
              Chapters
            </Link>

            <Link href="/events" className={linkClasses('/events')}>
              Events
            </Link>

            <Link href="/achievements" className={linkClasses('/achievements')}>
              Achievements
            </Link>

            <Link href="/stories" className={linkClasses('/stories')}>
              Stories
            </Link>

            <Link href="/gallery" className={linkClasses('/gallery')}>
              Gallery
            </Link>

            <Link 
              href="/search" 
              className="flex items-center gap-2 text-ink hover:text-ieee-blue transition-all duration-200 group p-1.5 px-2.5 border border-warm-200 hover:border-ieee-blue/40 rounded-lg bg-warm-50/50 hover:bg-white shadow-sm"
              aria-label="Search"
            >
              <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-warm-200 rounded text-[10px] text-warm-400 group-hover:text-ieee-blue group-hover:border-ieee-blue/30 font-sans font-medium transition-colors shadow-sm">
                <span className="text-[11px] leading-none">⌘</span>K
              </kbd>
            </Link>
          </nav>

          {/* Primary Call To Action */}
          <div className="hidden sm:flex items-center gap-4">
            <Button href="/join" variant="primary" size="md">
              Join IEEE MAIT
            </Button>
          </div>

          {/* Mobile Menu Toggle Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-ink hover:text-ieee-blue focus:outline-none"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
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

      {/* Mobile Drawer Menu */}
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
