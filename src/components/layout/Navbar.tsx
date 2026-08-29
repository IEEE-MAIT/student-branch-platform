'use client';

/**
 * @file src/components/layout/Navbar.tsx
 * @description Modern, sleek institutional navigation bar for IEEE MAIT Student Branch.
 * 
 * SPECIFICATIONS:
 * - Pure, clean IEEE MAIT Student Branch Logo on the left.
 * - Rounded capsule pill-style desktop navigation bar with debounced hover dropdowns.
 * - Search bar pill with Cmd+K trigger and direct JOIN CTA.
 * - Mobile responsive drawer menu with accordion sub-sections.
 * - Uses react-icons for modern, unified icon system.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Container } from './Container';
import { ThemeToggle } from './ThemeToggle';
import { FiChevronDown, FiSearch, FiMenu, FiX, FiArrowRight } from 'react-icons/fi';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [communitiesDropdownOpen, setCommunitiesDropdownOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileCommunitiesOpen, setMobileCommunitiesOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const aboutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const communitiesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
    setCommunitiesDropdownOpen(false);
    setMobileAboutOpen(false);
    setMobileCommunitiesOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setAboutDropdownOpen(false);
        setCommunitiesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Keyboard navigation: Escape key closes menus, Cmd+K / Ctrl+K opens search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAboutDropdownOpen(false);
        setCommunitiesDropdownOpen(false);
        setMobileMenuOpen(false);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        router.push('/search');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  // Debounced mouse enter/leave handlers
  const handleAboutEnter = () => {
    if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    setAboutDropdownOpen(true);
  };

  const handleAboutLeave = () => {
    aboutTimeoutRef.current = setTimeout(() => {
      setAboutDropdownOpen(false);
    }, 200);
  };

  const handleCommunitiesEnter = () => {
    if (communitiesTimeoutRef.current) clearTimeout(communitiesTimeoutRef.current);
    setCommunitiesDropdownOpen(true);
  };

  const handleCommunitiesLeave = () => {
    communitiesTimeoutRef.current = setTimeout(() => {
      setCommunitiesDropdownOpen(false);
    }, 200);
  };

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navPillClasses = (path: string) =>
    `px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
      isActive(path)
        ? 'bg-ieee-subtle dark:bg-sky-950/80 text-ieee-blue dark:text-sky-400 font-bold shadow-xs'
        : 'text-gray-700 dark:text-gray-200 hover:text-ieee-blue dark:hover:text-sky-400 hover:bg-warm-100/80 dark:hover:bg-gray-800/80'
    }`;

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 bg-white/85 dark:bg-gray-950/85 backdrop-blur-xl border-b border-warm-200/80 dark:border-gray-800/80 transition-all duration-300"
    >
      <Container size="wide">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* IEEE MAIT Pure Logo Brand Identity */}
          <Link
            href="/"
            className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue rounded-lg py-1"
            aria-label="IEEE MAIT Student Branch Home"
          >
            <div className="relative flex items-center">
              <Image 
                src="/ieee_mait_sb_light_mode_logo.png" 
                alt="IEEE MAIT Student Branch Logo" 
                width={300} 
                height={75} 
                className="w-auto h-10 sm:h-11 object-contain group-hover:opacity-90 transition-opacity dark:hidden"
                priority
                unoptimized
              />
              <Image 
                src="/ieee_mait_sb_dark_mode_logo.png" 
                alt="IEEE MAIT Student Branch Logo" 
                width={300} 
                height={75} 
                className="w-auto h-10 sm:h-11 object-contain group-hover:opacity-90 transition-opacity hidden dark:block"
                priority
                unoptimized
              />
            </div>
          </Link>

          {/* Desktop Modern Capsule Navigation Menu */}
          <nav className="hidden xl:flex items-center gap-1.5 2xl:gap-2 p-1 bg-warm-50/60 dark:bg-gray-900/60 border border-warm-200/60 dark:border-gray-800/60 rounded-full shadow-xs" aria-label="Main Navigation">
            {/* 1. About Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleAboutEnter}
              onMouseLeave={handleAboutLeave}
            >
              <button
                type="button"
                onClick={() => setAboutDropdownOpen((prev) => !prev)}
                className={`${navPillClasses('/about')} flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue`}
                aria-expanded={aboutDropdownOpen}
                aria-haspopup="true"
                aria-label="About Menu"
              >
                <span>About</span>
                <FiChevronDown
                  className={`w-3 h-3 opacity-60 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180 text-ieee-blue dark:text-sky-400 opacity-100' : ''}`}
                />
              </button>

              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div 
                    className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-warm-200/80 dark:border-gray-800/80 shadow-2xl p-1.5 rounded-2xl"
                    role="menu"
                    aria-label="About IEEE MAIT Submenu"
                  >
                    <Link 
                      href="/about" 
                      role="menuitem"
                      onClick={() => setAboutDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs hover:bg-warm-100 dark:hover:bg-gray-800 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors text-ink dark:text-gray-200"
                    >
                      <div className="font-semibold">About IEEE MAIT</div>
                      <div className="text-[11px] text-warm-400 dark:text-gray-400 font-normal">Mission, governance & branch charter</div>
                    </Link>
                    <Link 
                      href="/about/ieee" 
                      role="menuitem"
                      onClick={() => setAboutDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs hover:bg-warm-100 dark:hover:bg-gray-800 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors text-ink dark:text-gray-200"
                    >
                      <div className="font-semibold">Global IEEE & Delhi Section</div>
                      <div className="text-[11px] text-warm-400 dark:text-gray-400 font-normal">Region 10 & international network</div>
                    </Link>
                    <Link 
                      href="/about/history" 
                      role="menuitem"
                      onClick={() => setAboutDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs hover:bg-warm-100 dark:hover:bg-gray-800 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors text-ink dark:text-gray-200"
                    >
                      <div className="font-semibold">20-Year Milestones</div>
                      <div className="text-[11px] text-warm-400 dark:text-gray-400 font-normal">Institutional timeline since 2005</div>
                    </Link>
                    <Link 
                      href="/about/impact" 
                      role="menuitem"
                      onClick={() => setAboutDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs hover:bg-warm-100 dark:hover:bg-gray-800 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors text-ink dark:text-gray-200"
                    >
                      <div className="font-semibold">Branch Impact</div>
                      <div className="text-[11px] text-warm-400 dark:text-gray-400 font-normal">Community reach & engineering outcomes</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Communities & SIGs Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleCommunitiesEnter}
              onMouseLeave={handleCommunitiesLeave}
            >
              <button
                type="button"
                onClick={() => setCommunitiesDropdownOpen((prev) => !prev)}
                className={`${navPillClasses('/chapters')} flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue`}
                aria-expanded={communitiesDropdownOpen}
                aria-haspopup="true"
                aria-label="Communities Menu"
              >
                <span>Communities</span>
                <FiChevronDown
                  className={`w-3 h-3 opacity-60 transition-transform duration-200 ${communitiesDropdownOpen ? 'rotate-180 text-ieee-blue dark:text-sky-400 opacity-100' : ''}`}
                />
              </button>

              {communitiesDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div 
                    className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-warm-200/80 dark:border-gray-800/80 shadow-2xl p-1.5 rounded-2xl"
                    role="menu"
                    aria-label="Communities & Chapters Submenu"
                  >
                    <Link 
                      href="/chapters" 
                      role="menuitem"
                      onClick={() => setCommunitiesDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs hover:bg-warm-100 dark:hover:bg-gray-800 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors text-ink dark:text-gray-200"
                    >
                      <div className="font-semibold">All Units & SIGs Overview</div>
                      <div className="text-[11px] text-warm-400 dark:text-gray-400 font-normal">Student Branch, Chapters, Affinity Groups & SIGs</div>
                    </Link>
                    <Link 
                      href="/chapters/sb" 
                      role="menuitem"
                      onClick={() => setCommunitiesDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs hover:bg-warm-100 dark:hover:bg-gray-800 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors text-ink dark:text-gray-200"
                    >
                      <div className="font-semibold flex items-center justify-between">
                        <span>IEEE MAIT SB (Parent)</span>
                        <span className="font-mono text-[10px] bg-ieee-subtle dark:bg-sky-950 text-ieee-blue dark:text-sky-400 px-2 py-0.5 rounded-full">Core</span>
                      </div>
                      <div className="text-[11px] text-warm-400 dark:text-gray-400 font-normal">Flagship operations, IEEE Day & symposiums</div>
                    </Link>
                    <Link 
                      href="/chapters/eds" 
                      role="menuitem"
                      onClick={() => setCommunitiesDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs hover:bg-warm-100 dark:hover:bg-gray-800 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors text-ink dark:text-gray-200"
                    >
                      <div className="font-semibold flex items-center justify-between">
                        <span>IEEE EDS Chapter</span>
                        <span className="font-mono text-[10px] bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full">Hardware</span>
                      </div>
                      <div className="text-[11px] text-warm-400 dark:text-gray-400 font-normal">Semiconductors, KiCad PCB & microelectronics</div>
                    </Link>
                    <Link 
                      href="/chapters/wie" 
                      role="menuitem"
                      onClick={() => setCommunitiesDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs hover:bg-warm-100 dark:hover:bg-gray-800 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors text-ink dark:text-gray-200"
                    >
                      <div className="font-semibold flex items-center justify-between">
                        <span>IEEE WIE Affinity Group</span>
                        <span className="font-mono text-[10px] bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">Mentorship</span>
                      </div>
                      <div className="text-[11px] text-warm-400 dark:text-gray-400 font-normal">Women in engineering leadership circle</div>
                    </Link>
                    <div className="border-t border-warm-200/60 dark:border-gray-800 my-1"></div>
                    <Link 
                      href="/gallery" 
                      role="menuitem"
                      onClick={() => setCommunitiesDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs hover:bg-warm-100 dark:hover:bg-gray-800 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors text-ink dark:text-gray-200"
                    >
                      <div className="font-semibold flex items-center justify-between">
                        <span>Photo Gallery & Archives</span>
                        <span className="font-mono text-[10px] bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">Media</span>
                      </div>
                      <div className="text-[11px] text-warm-400 dark:text-gray-400 font-normal">Documentary photography & event photo albums</div>
                    </Link>
                    <Link 
                      href="/projects" 
                      role="menuitem"
                      onClick={() => setCommunitiesDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs hover:bg-warm-100 dark:hover:bg-gray-800 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors text-ink dark:text-gray-200"
                    >
                      <div className="font-semibold flex items-center justify-between">
                        <span>Technical Projects Hub</span>
                        <span className="font-mono text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">Builds</span>
                      </div>
                      <div className="text-[11px] text-warm-400 dark:text-gray-400 font-normal">Robotics, Edge AI & Open Source systems</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Links */}
            <Link href="/events" className={navPillClasses('/events')}>
              Events
            </Link>

            <Link href="/achievements" className={navPillClasses('/achievements')}>
              Achievements
            </Link>

            <Link href="/publications" className={navPillClasses('/publications')}>
              Publications
            </Link>

            <Link href="/sigs" className={navPillClasses('/sigs')}>
              SIGs
            </Link>

            <Link href="/people" className={navPillClasses('/people')}>
              People
            </Link>

            <Link href="/resources" className={navPillClasses('/resources')}>
              Resources
            </Link>
          </nav>

          {/* Right Action Area (Theme Toggle + Search Capsule + Modern JOIN CTA) */}
          <div className="hidden xl:flex items-center gap-2.5 shrink-0">
            {/* Minimalist Theme Toggle Button */}
            <ThemeToggle variant="nav" />

            {/* Command-K Search Capsule */}
            <Link 
              href="/search" 
              className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-ieee-blue dark:hover:text-sky-400 px-3 py-1.5 border border-warm-200/80 dark:border-gray-800/80 hover:border-ieee-blue/40 rounded-full bg-warm-50/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-800 shadow-xs transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue shrink-0"
              aria-label="Search Platform (Shortcut ⌘K or Ctrl+K)"
            >
              <FiSearch className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
              <span className="hidden 2xl:inline">Search...</span>
              <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-md text-[10px] text-warm-400 dark:text-gray-400 font-mono shadow-xs">
                ⌘K
              </kbd>
            </Link>

            {/* Modern Radiant JOIN CTA Button */}
            <Link
              href="/join"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-[#00629B] to-[#007CBD] dark:from-[#007CBD] dark:to-[#0284C7] hover:from-[#004975] hover:to-[#00629B] dark:hover:from-[#00629B] dark:hover:to-[#007CBD] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shrink-0"
            >
              <span>JOIN</span>
              <FiArrowRight className="w-3.5 h-3.5 text-sky-200" />
            </Link>
          </div>

          {/* Mobile Action Area (Theme Toggle + Search + Menu Toggle) */}
          <div className="xl:hidden flex items-center gap-1 sm:gap-1.5">
            <ThemeToggle variant="nav" />
            <Link 
              href="/search"
              aria-label="Quick Search"
              className="p-2 text-ink dark:text-gray-200 hover:text-ieee-blue dark:hover:text-sky-400 rounded-full hover:bg-warm-100 dark:hover:bg-gray-900"
            >
              <FiSearch className="w-4.5 h-4.5" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink dark:text-gray-200 hover:text-ieee-blue dark:hover:text-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue rounded-full hover:bg-warm-100 dark:hover:bg-gray-900 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer Menu with Smooth Rounded Cards */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-warm-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl px-4 pt-3 pb-8 space-y-2 shadow-2xl max-h-[calc(100vh-4.5rem)] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
          {/* Quick Search on Mobile */}
          <div className="pt-2 pb-1">
            <Link
              href="/search"
              className="flex items-center justify-between px-4 py-2.5 border border-warm-200 dark:border-gray-800 rounded-xl bg-warm-50 dark:bg-gray-900 text-sm text-warm-400 dark:text-gray-400 min-h-[44px]"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center gap-2">
                <FiSearch className="w-4 h-4 text-warm-400" />
                <span>Search events, people, publications...</span>
              </div>
              <span className="font-mono text-[10px] text-warm-400 border border-warm-200 dark:border-gray-700 px-1.5 py-0.5 rounded bg-white dark:bg-gray-800">⌘K</span>
            </Link>
          </div>

          <div className="font-mono text-[11px] text-warm-400 dark:text-gray-500 uppercase tracking-widest px-2 pt-3">Navigation</div>

          {/* 1. About Accordion */}
          <div className="border border-warm-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-ink dark:text-gray-200 bg-warm-50/50 dark:bg-gray-900/50 hover:bg-warm-100 dark:hover:bg-gray-800 min-h-[48px] cursor-pointer"
              aria-expanded={mobileAboutOpen}
            >
              <span>About IEEE MAIT</span>
              <FiChevronDown
                className={`w-4 h-4 text-warm-400 transition-transform duration-200 ${mobileAboutOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {mobileAboutOpen && (
              <div className="bg-white dark:bg-gray-900 px-4 py-2 space-y-1 border-t border-warm-200 dark:border-gray-800 text-sm">
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
          <div className="border border-warm-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setMobileCommunitiesOpen(!mobileCommunitiesOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-ink dark:text-gray-200 bg-warm-50/50 dark:bg-gray-900/50 hover:bg-warm-100 dark:hover:bg-gray-800 min-h-[48px] cursor-pointer"
              aria-expanded={mobileCommunitiesOpen}
            >
              <span>Communities & Chapters</span>
              <FiChevronDown
                className={`w-4 h-4 text-warm-400 transition-transform duration-200 ${mobileCommunitiesOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {mobileCommunitiesOpen && (
              <div className="bg-white dark:bg-gray-900 px-4 py-2 space-y-1 border-t border-warm-200 dark:border-gray-800 text-sm">
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
                  <span className="font-mono text-[10px] bg-ieee-subtle dark:bg-sky-950 text-ieee-blue dark:text-sky-400 px-1.5 py-0.5 rounded-full">Core</span>
                </Link>
                <Link
                  href="/chapters/eds"
                  className="block py-2.5 px-2 hover:text-ieee-blue dark:hover:text-sky-400 border-t border-warm-100 dark:border-gray-800 min-h-[44px] flex items-center justify-between"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>IEEE EDS Chapter</span>
                  <span className="font-mono text-[10px] bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded-full">Hardware</span>
                </Link>
                <Link
                  href="/chapters/wie"
                  className="block py-2.5 px-2 hover:text-ieee-blue dark:hover:text-sky-400 border-t border-warm-100 dark:border-gray-800 min-h-[44px] flex items-center justify-between"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>IEEE WIE Affinity Group</span>
                  <span className="font-mono text-[10px] bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded-full">Mentorship</span>
                </Link>
                <Link
                  href="/gallery"
                  className="block py-2.5 px-2 hover:text-ieee-blue dark:hover:text-sky-400 border-t border-warm-100 dark:border-gray-800 min-h-[44px] flex items-center justify-between"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Photo Gallery & Archives</span>
                  <span className="font-mono text-[10px] bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full">Media</span>
                </Link>
                <Link
                  href="/projects"
                  className="block py-2.5 px-2 hover:text-ieee-blue dark:hover:text-sky-400 border-t border-warm-100 dark:border-gray-800 min-h-[44px] flex items-center justify-between"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Technical Projects Hub</span>
                  <span className="font-mono text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">Builds</span>
                </Link>
              </div>
            )}
          </div>

          {/* Direct Mobile Links */}
          <Link
            href="/events"
            className="block px-4 py-3 text-base font-medium hover:text-ieee-blue dark:hover:text-sky-400 min-h-[48px] flex items-center rounded-xl hover:bg-warm-50 dark:hover:bg-gray-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            Events & Workshops
          </Link>
          <Link
            href="/achievements"
            className="block px-4 py-3 text-base font-medium hover:text-ieee-blue dark:hover:text-sky-400 min-h-[48px] flex items-center rounded-xl hover:bg-warm-50 dark:hover:bg-gray-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            Achievements Ledger
          </Link>
          <Link
            href="/publications"
            className="block px-4 py-3 text-base font-medium hover:text-ieee-blue dark:hover:text-sky-400 min-h-[48px] flex items-center rounded-xl hover:bg-warm-50 dark:hover:bg-gray-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            Publications & Digest
          </Link>
          <Link
            href="/sigs"
            className="block px-4 py-3 text-base font-medium hover:text-ieee-blue dark:hover:text-sky-400 min-h-[48px] flex items-center rounded-xl hover:bg-warm-50 dark:hover:bg-gray-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            Special Interest Groups (SIGs)
          </Link>
          <Link
            href="/people"
            className="block px-4 py-3 text-base font-medium hover:text-ieee-blue dark:hover:text-sky-400 min-h-[48px] flex items-center rounded-xl hover:bg-warm-50 dark:hover:bg-gray-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            People & Leadership
          </Link>
          <Link
            href="/resources"
            className="block px-4 py-3 text-base font-medium hover:text-ieee-blue dark:hover:text-sky-400 min-h-[48px] flex items-center rounded-xl hover:bg-warm-50 dark:hover:bg-gray-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            Digital Library & Resources
          </Link>

          {/* Theme Switcher & Join CTA on Mobile */}
          <div className="pt-3 px-1 space-y-2.5">
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-warm-50 dark:bg-gray-900 border border-warm-200/80 dark:border-gray-800 rounded-xl">
              <span className="text-xs font-medium text-warm-700 dark:text-gray-300">Appearance Theme</span>
              <ThemeToggle variant="default" showLabel />
            </div>

            <Link
              href="/join"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#00629B] to-[#007CBD] dark:from-[#007CBD] dark:to-[#0284C7] text-white font-bold uppercase tracking-wider text-sm shadow-md"
            >
              <span>JOIN</span>
              <FiArrowRight className="w-4 h-4 text-sky-200" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
