'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import Link from '@/components/ui/AppLink';
import { FiSearch, FiHome, FiArrowRight } from 'react-icons/fi';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 py-20 sm:py-28 bg-white dark:bg-gray-950 flex items-center min-h-[75vh] page-enter transition-colors duration-200">
        <Container size="narrow" className="text-center space-y-8">
          <div className="space-y-3">
            <span className="font-mono text-xs font-bold text-ieee-blue dark:text-sky-400 uppercase tracking-widest bg-ieee-subtle dark:bg-sky-950/60 px-3 py-1 rounded-full inline-block">
              HTTP 404 — Record Missing
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ink dark:text-gray-100 font-normal tracking-tight">
              Page Not Found
            </h1>

            <p className="text-sm sm:text-base text-warm-500 dark:text-gray-400 font-sans max-w-lg mx-auto leading-relaxed">
              The requested URL could not be located in the IEEE MAIT Student Branch platform. It may have been archived, renamed, or temporarily relocated.
            </p>
          </div>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400 dark:text-gray-500 pointer-events-none">
              <FiSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, SIGs, projects, or people..."
              className="w-full pl-10 pr-24 py-3 bg-warm-50 dark:bg-gray-900 border border-warm-300/80 dark:border-gray-800 rounded-xl text-ink dark:text-gray-100 placeholder:text-warm-400 text-xs font-sans focus:outline-hidden focus:border-ieee-blue dark:focus:border-sky-500 shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-mono text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Search</span>
            </button>
          </form>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button href="/" variant="primary" size="md">
              <span className="flex items-center gap-1.5">
                <FiHome className="w-4 h-4" />
                <span>Return Home</span>
              </span>
            </Button>
            <Button href="/events" variant="secondary" size="md">
              Events & Workshops
            </Button>
            <Button href="/contact" variant="ghost" size="md">
              Contact Desk
            </Button>
          </div>

          {/* Hub Discovery Links */}
          <div className="pt-8 border-t border-warm-100 dark:border-gray-900">
            <span className="font-mono text-[11px] text-warm-400 dark:text-gray-400 uppercase tracking-widest block mb-4">
              Explore Popular Branch Hubs
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
              {[
                { label: 'Technical Projects', href: '/projects' },
                { label: 'Special Interest Groups', href: '/sigs' },
                { label: 'Opportunities & Grants', href: '/opportunities' },
                { label: 'Publications & Digest', href: '/publications' },
                { label: 'Achievements Ledger', href: '/achievements' },
                { label: 'Officer Rosters', href: '/people' },
              ].map((hub) => (
                <Link
                  key={hub.href}
                  href={hub.href}
                  className="px-3 py-1.5 bg-warm-50 dark:bg-gray-900 border border-warm-200 dark:border-gray-800 rounded-full text-warm-600 dark:text-gray-300 hover:border-ieee-blue/40 dark:hover:border-sky-500/40 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors flex items-center gap-1"
                >
                  <span>{hub.label}</span>
                  <FiArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
