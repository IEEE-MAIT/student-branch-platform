'use client';

/**
 * @file src/components/layout/Navbar.tsx
 * @description Global sticky navigation header for IEEE MAIT Student Branch platform.
 * 
 * SPECIFICATIONS & ACCESSIBILITY:
 * - IEEE MAIT official co-branding with institutional clear-space separation.
 * - Desktop Dropdowns for 'About' and 'Communities & SIGs'.
 * - Direct navigation for Events, Achievements, Publications, Gallery, Projects, Opportunities, People, and Resources.
 * - External Donate button with link icon.
 * - ThemeToggle component for instant Light/Dark switching.
 * - Command-K / Ctrl+K quick search trigger.
 * - Responsive mobile drawer with accordions and accessible 48px touch targets.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Container } from './Container';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [communitiesDropdownOpen, setCommunitiesDropdownOpen] = useState(false);

  // Mobile drawer accordions
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileCommunitiesOpen, setMobileCommunitiesOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
    setCommunitiesDropdownOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Global Keyboard shortcuts & Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        router.push('/search');
      }
      if (e.key === 'Escape') {
        setAboutDropdownOpen(false);
        setCommunitiesDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const linkClasses = (path: string) =>
    `transition-colors duration-200 ${
      isActive(path)
        ? 'text-ieee-blue dark:text-sky-400 font-semibold border-b-2 border-ieee-blue dark:border-sky-400 pb-1'
        : 'text-ink dark:text-gray-200 hover:text-ieee-blue dark:hover:text-sky-400'
    }`;

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-warm-200 dark:border-gray-800 transition-colors duration-200"
    >
      <Container size="wide">
        <div className="flex items-center justify-between h-20">
          {/* IEEE + MAIT Co-Branding Identity */}
          <Link
            href="/"
            className="flex items-center gap-3.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue rounded"
          >
            <div className="flex flex-col justify-center py-1">
              <Image 
                src="/ieee_mait_sb_light_mode_logo.png" 
                alt="IEEE MAIT Student Branch Logo" 
                width={300} 
                height={80} 
                className="w-auto h-12 sm:h-14 object-contain group-hover:opacity-90 transition-opacity dark:hidden"
                priority
                unoptimized
              />
              <Image 
                src="/ieee_mait_sb_dark_mode_logo.png" 
                alt="IEEE MAIT Student Branch Logo" 
                width={300} 
                height={80} 
                className="w-auto h-12 sm:h-14 object-contain group-hover:opacity-90 transition-opacity hidden dark:block"
                priority
                unoptimized
              />
            </div>
            <div className="hidden sm:block h-7 w-[1px] bg-warm-200 dark:bg-gray-800" aria-hidden="true" />
            <div className="hidden md:flex items-center">
              <span className="font-mono text-xs text-warm-400 dark:text-gray-400 tracking-tight">Delhi, India · Est. since 2005</span>
            </div>
          </Link>

          {/* Desktop Navigation Link Menu */}
          <nav className="hidden xl:flex items-center gap-5 2xl:gap-6 text-sm font-medium" aria-label="Main Navigation">
            {/* 1. About Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className={`${linkClasses('/about')} flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue rounded px-1`}
                aria-expanded={aboutDropdownOpen}
                aria-haspopup="true"
                aria-label="About Menu"
              >
                <span>About</span>
                <svg
                  className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180 text-ieee-blue dark:text-sky-400' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {aboutDropdownOpen && (
                <div 
                  className="absolute top-full left-0 w-64 bg-white dark:bg-gray-900 border border-warm-200 dark:border-gray-800 shadow-xl py-2 rounded-lg z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                  aria-label="About IEEE MAIT Submenu"
                >
                  <Link 
                    href="/about" 
                    role="menuitem"
                    className="block px-4 py-2.5 text-xs hover:bg-ieee-subtle dark:hover:bg-gray-800 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors text-ink dark:text-gray-200"
                  >
                    <div className="font-semibold">About IEEE MAIT</div>
                    <div className="text-[11px] text-warm-400 dark:text-gray-400 font-normal">Mission, governance & branch charter</div>
                  </Link>
                  <Link 
                    href="/about/ieee" 
                    role="menuitem"
                    className="block px-4 py-2.5 text-xs hover:bg-ieee-subtle dark:hover:bg-gray-800 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors text-ink dark:text-gray-200 border-t border-warm-100 dark:border-gray-800"
                  >
                    <div className="font-semibold">Global IEEE & Delhi Section</div>
                    <div className="text-[11px] text-warm-400 dark:text-gray-400 font-normal">Region 10 & international network</div>
                  </Link>
                  <Link 
                    href="/about/history" 
                    role="menuitem"
                    className="block px-4 py-2.5 text-xs hover:bg-ieee-subtle dark:hover:bg-gray-800 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors text-ink dark:text-gray-200 border-t border-warm-100 dark:border-gray-800"
                  >
                    <div className="font-semibold">20-Year Milestones</div>
                    <div className="text-[11px] text-warm-400 dark:text-gray-400 font-normal">Institutional timeline since 2005</div>
                  </Link>
                  <Link 
                    href="/about/impact" 
                    role="menuitem"
                    className="block px-4 py-2.5 text-xs hover:bg-ieee-subtle dark:hover:bg-gray-800 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors text-ink dark:text-gray-200 border-t border-warm-100 dark:border-gray-800"
                  >
                    <div className="font-semibold">Branch Impact</div>
                    <div className="text-[11px] text-warm-400 dark:text-gray-400 font-normal">Community reach & engineering outcomes</div>
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Communities & SIGs Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setCommunitiesDropdownOpen(true)}
              onMouseLeave={() => setCommunitiesDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCommunitiesDropdownOpen(!communitiesDropdownOpen)}
                className={`${linkClasses('/chapters')} flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue rounded px-1`}
                aria-expanded={communitiesDropdownOpen}
                aria-haspopup="true"
                aria-label="Communities Menu"
              >
                <span>Communities</span>
                <svg
                  className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${communitiesDropdownOpen ? 'rotate-180 text-ieee-blue dark:text-sky-400' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {communitiesDropdownOpen && (
                <div 
                  className="absolute top-full left-0 w-72 bg-white dark:bg-gray-900 border border-warm-200 dark:border-gray-800 shadow-xl py-2 rounded-lg z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                  aria-label="Communities & Chapters Submenu"
                >
                  <Link 
                    href="/chapters" 
                    role="menuitem"
                    className="block px-4 py-2.5 text-xs hover:bg-ieee-subtle dark:hover:bg-gray-800 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors text-ink dark:text-gray-200"
                  >
                    <div className="font-semibold">All Units & SIGs Overview</div>
                    <div className="text-[11px] text-warm-400 dark:text-gray-400 font-normal">Student Branch, Chapters, Affinity Groups & SIGs</div>
                  </Link>
                  <Link 
                    href="/chapters/sb" 
                    role="menuitem"
                    className="block px-4 py-2.5 text-xs hover:bg-ieee-subtle dark:hover:bg-gray-800 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors text-ink dark:text-gray-200 border-t border-warm-100 dark:border-gray-800"
                  >
                    <div className="font-semibold flex items-center justify-between">
                      <span>IEEE MAIT SB (Parent)</span>
                      <span className="font-mono text-[10px] bg-ieee-subtle dark:bg-sky-950 text-ieee-blue dark:text-sky-400 px-1.5 py-0.5 rounded">Core</span>
                    </div>
                    <div className="text-[11px] text-warm-400 dark:text-gray-400 font-normal">Flagship operations, IEEE Day & fests</div>
                  </Link>
                  <Link 
                    href="/chapters/eds" 
                    role="menuitem"
                    className="block px-4 py-2.5 text-xs hover:bg-ieee-subtle dark:hover:bg-gray-800 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors text-ink dark:text-gray-200 border-t border-warm-100 dark:border-gray-800"
                  >
                    <div className="font-semibold flex items-center justify-between">
                      <span>IEEE EDS Chapter</span>
                      <span className="font-mono text-[10px] bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded">Hardware & VLSI</span>
                    </div>
                    <div className="text-[11px] text-warm-400 dark:text-gray-400 font-normal">Semiconductors, KiCad PCB & microelectronics</div>
                  </Link>
                  <Link 
                    href="/chapters/wie" 
                    role="menuitem"
                    className="block px-4 py-2.5 text-xs hover:bg-ieee-subtle dark:hover:bg-gray-800 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors text-ink dark:text-gray-200 border-t border-warm-100 dark:border-gray-800"
                  >
                    <div className="font-semibold flex items-center justify-between">
                      <span>IEEE WIE Affinity Group</span>
                      <span className="font-mono text-[10px] bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded">Mentorship</span>
                    </div>
                    <div className="text-[11px] text-warm-400 dark:text-gray-400 font-normal">Women in engineering leadership circle</div>
                  </Link>
                </div>
              )}
            </div>

            {/* Direct Links */}
            <Link href="/events" className={linkClasses('/events')}>
              Events
            </Link>

            <Link href="/achievements" className={linkClasses('/achievements')}>
              Achievements
            </Link>

            <Link href="/stories" className={linkClasses('/stories')}>
              Publications
            </Link>

            <Link href="/gallery" className={linkClasses('/gallery')}>
              Gallery
            </Link>

            <Link href="/people" className={linkClasses('/people')}>
              People
            </Link>

            <Link href="/resources" className={linkClasses('/resources')}>
              Resources
            </Link>

            {/* Command-K Search Trigger */}
            <Link 
              href="/search" 
              className="flex items-center gap-2 text-ink dark:text-gray-300 hover:text-ieee-blue dark:hover:text-sky-400 transition-all duration-200 group p-1.5 px-2.5 border border-warm-200 dark:border-gray-800 hover:border-ieee-blue/40 rounded-lg bg-warm-50/70 dark:bg-gray-900/70 hover:bg-white dark:hover:bg-gray-800 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue shrink-0"
              aria-label="Search Platform (Shortcut ⌘K or Ctrl+K)"
            >
              <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <kbd className="hidden 2xl:flex items-center gap-0.5 px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded text-[10px] text-warm-400 dark:text-gray-400 group-hover:text-ieee-blue dark:group-hover:text-sky-400 font-sans font-medium transition-colors shadow-xs">
                <span className="text-[11px] leading-none">⌘</span>K
              </kbd>
            </Link>
          </nav>

          {/* Primary Action Buttons */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Join CTA */}
            <Button href="/join" variant="primary" size="md">
              JOIN →
            </Button>
          </div>

          {/* Mobile Menu Controls */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink dark:text-gray-200 hover:text-ieee-blue dark:hover:text-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue rounded min-h-[48px] min-w-[48px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
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
        </div>
      </Container>

      {/* Mobile Drawer Menu with Accordions and 48px Touch Targets */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 pt-3 pb-8 space-y-2 shadow-2xl max-h-[calc(100vh-5rem)] overflow-y-auto">
          {/* Quick Search on Mobile */}
          <div className="pt-2 pb-1">
            <Link
              href="/search"
              className="flex items-center justify-between px-3 py-2.5 border border-warm-200 dark:border-gray-800 rounded-lg bg-warm-50 dark:bg-gray-900 text-sm text-warm-400 dark:text-gray-400 min-h-[48px]"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search events, people, publications...</span>
              </div>
              <span className="font-mono text-[10px] text-warm-400 border border-warm-200 dark:border-gray-700 px-1.5 py-0.5 rounded bg-white dark:bg-gray-800">⌘K</span>
            </Link>
          </div>

          <div className="font-mono text-[11px] text-warm-400 dark:text-gray-500 uppercase tracking-widest px-2 pt-3">Navigation</div>

          {/* 1. About Accordion */}
          <div className="border border-warm-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
              className="w-full flex items-center justify-between px-3 py-3 text-base font-medium text-ink dark:text-gray-200 bg-warm-50/50 dark:bg-gray-900/50 hover:bg-warm-100 dark:hover:bg-gray-800 min-h-[48px]"
              aria-expanded={mobileAboutOpen}
            >
              <span>About IEEE MAIT</span>
              <svg
                className={`w-4 h-4 text-warm-400 transition-transform duration-200 ${mobileAboutOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileAboutOpen && (
              <div className="bg-white dark:bg-gray-900 px-3 py-2 space-y-1 border-t border-warm-200 dark:border-gray-800 text-sm">
                <Link
                  href="/about"
                  className="block py-2.5 px-2 hover:text-ieee-blue dark:hover:text-sky-400 min-h-[44px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About IEEE MAIT Overview
                </Link>
                <Link
                  href="/about/ieee"
                  className="block py-2.5 px-2 hover:text-ieee-blue dark:hover:text-sky-400 border-t border-warm-100 dark:border-gray-800 min-h-[44px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Global IEEE & Delhi Section
                </Link>
                <Link
                  href="/about/history"
                  className="block py-2.5 px-2 hover:text-ieee-blue dark:hover:text-sky-400 border-t border-warm-100 dark:border-gray-800 min-h-[44px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  20-Year Milestones (Est. 2005)
                </Link>
                <Link
                  href="/about/impact"
                  className="block py-2.5 px-2 hover:text-ieee-blue dark:hover:text-sky-400 border-t border-warm-100 dark:border-gray-800 min-h-[44px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Branch Impact & Outcomes
                </Link>
              </div>
            )}
          </div>

          {/* 2. Communities Accordion */}
          <div className="border border-warm-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setMobileCommunitiesOpen(!mobileCommunitiesOpen)}
              className="w-full flex items-center justify-between px-3 py-3 text-base font-medium text-ink dark:text-gray-200 bg-warm-50/50 dark:bg-gray-900/50 hover:bg-warm-100 dark:hover:bg-gray-800 min-h-[48px]"
              aria-expanded={mobileCommunitiesOpen}
            >
              <span>Communities & Chapters</span>
              <svg
                className={`w-4 h-4 text-warm-400 transition-transform duration-200 ${mobileCommunitiesOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileCommunitiesOpen && (
              <div className="bg-white dark:bg-gray-900 px-3 py-2 space-y-1 border-t border-warm-200 dark:border-gray-800 text-sm">
                <Link
                  href="/chapters"
                  className="block py-2.5 px-2 hover:text-ieee-blue dark:hover:text-sky-400 min-h-[44px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Units & SIGs Overview
                </Link>
                <Link
                  href="/chapters/sb"
                  className="block py-2.5 px-2 hover:text-ieee-blue dark:hover:text-sky-400 border-t border-warm-100 dark:border-gray-800 min-h-[44px] flex items-center justify-between"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>IEEE MAIT SB (Parent)</span>
                  <span className="font-mono text-[10px] bg-ieee-subtle dark:bg-sky-950 text-ieee-blue dark:text-sky-400 px-1.5 py-0.5 rounded">Core</span>
                </Link>
                <Link
                  href="/chapters/eds"
                  className="block py-2.5 px-2 hover:text-ieee-blue dark:hover:text-sky-400 border-t border-warm-100 dark:border-gray-800 min-h-[44px] flex items-center justify-between"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>IEEE EDS Chapter</span>
                  <span className="font-mono text-[10px] bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded">Hardware</span>
                </Link>
                <Link
                  href="/chapters/wie"
                  className="block py-2.5 px-2 hover:text-ieee-blue dark:hover:text-sky-400 border-t border-warm-100 dark:border-gray-800 min-h-[44px] flex items-center justify-between"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>IEEE WIE Affinity Group</span>
                  <span className="font-mono text-[10px] bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded">Mentorship</span>
                </Link>
              </div>
            )}
          </div>

          {/* Direct Mobile Links with Accessible Heights */}
          <Link
            href="/events"
            className="block px-3 py-3 text-base font-medium hover:text-ieee-blue dark:hover:text-sky-400 min-h-[48px] flex items-center rounded-lg hover:bg-warm-50 dark:hover:bg-gray-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            Events & Workshops
          </Link>
          <Link
            href="/achievements"
            className="block px-3 py-3 text-base font-medium hover:text-ieee-blue dark:hover:text-sky-400 min-h-[48px] flex items-center rounded-lg hover:bg-warm-50 dark:hover:bg-gray-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            Achievements Ledger
          </Link>
          <Link
            href="/stories"
            className="block px-3 py-3 text-base font-medium hover:text-ieee-blue dark:hover:text-sky-400 min-h-[48px] flex items-center rounded-lg hover:bg-warm-50 dark:hover:bg-gray-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            Publications & Stories
          </Link>
          <Link
            href="/gallery"
            className="block px-3 py-3 text-base font-medium hover:text-ieee-blue dark:hover:text-sky-400 min-h-[48px] flex items-center rounded-lg hover:bg-warm-50 dark:hover:bg-gray-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            Photo Gallery
          </Link>
          <Link
            href="/people"
            className="block px-3 py-3 text-base font-medium hover:text-ieee-blue dark:hover:text-sky-400 min-h-[48px] flex items-center rounded-lg hover:bg-warm-50 dark:hover:bg-gray-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            People & Leadership
          </Link>
          <Link
            href="/resources"
            className="block px-3 py-3 text-base font-medium hover:text-ieee-blue dark:hover:text-sky-400 min-h-[48px] flex items-center rounded-lg hover:bg-warm-50 dark:hover:bg-gray-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            Digital Library & Resources
          </Link>

          {/* Join CTA */}
          <div className="pt-3 px-1">
            <Button href="/join" variant="primary" size="lg" className="w-full justify-center min-h-[48px]">
              JOIN →
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
