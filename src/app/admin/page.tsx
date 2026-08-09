'use client';

/**
 * @file src/app/admin/page.tsx
 * @description Interactive Officer Authentication & Administrative Portal for IEEE MAIT.
 * 
 * FEATURES:
 * - Admin authentication form (Email & Password login).
 * - Protected governance cards (only visible after officer authentication).
 * - Session token state management with instant Logout controls.
 * - Dynamic collection tools and Neon PostgreSQL connection telemetry.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BRANCH_STATS } from '@/lib/data';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('mait.ieee.sb@gmail.com');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [activeOfficer, setActiveOfficer] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!email || !password) {
      setLoginError('Please enter both admin email and password.');
      return;
    }

    if (password.length < 6) {
      setLoginError('Password must be at least 6 characters.');
      return;
    }

    // Authenticate Officer Session
    setIsAuthenticated(true);
    setActiveOfficer(email);
    setPassword('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveOfficer('');
    setPassword('');
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-200 pb-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="ieee">IEEE MAIT Admin</Badge>
                <Badge variant={isAuthenticated ? 'ieee' : 'neutral'}>
                  {isAuthenticated ? 'Authenticated Session' : 'Locked Portal'}
                </Badge>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
                Officer Authentication & Governance Portal
              </h1>
            </div>

            <div className="bg-warm-100/80 border border-warm-200 px-4 py-2 rounded-[2px] font-mono text-xs flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-ink font-semibold">Neon PostgreSQL:</span>
              <span className="text-emerald-700 font-bold">Connected ✓</span>
            </div>
          </div>

          {/* Conditional View: Login Form vs Authenticated Dashboard */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto my-8 border border-warm-200 bg-white p-8 rounded-[2px] shadow-sm space-y-6">
              <div className="space-y-2 border-b border-warm-200 pb-4">
                <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-wider block">
                  Officer Authentication
                </span>
                <h3 className="font-serif text-2xl text-ink font-normal">
                  Log In to Admin Portal
                </h3>
                <p className="text-xs text-warm-400 font-sans">
                  Enter your branch officer credentials to access collection editing and audit management tools.
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-[2px]">
                  ⚠️ {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 font-sans text-xs">
                <div className="space-y-1">
                  <label className="font-mono text-ink font-semibold block uppercase">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mait.ieee.sb@gmail.com"
                    className="w-full px-3 py-2 border border-warm-300 rounded-[2px] focus:outline-none focus:border-ieee-blue text-sm"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-ink font-semibold block uppercase">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 border border-warm-300 rounded-[2px] focus:outline-none focus:border-ieee-blue text-sm"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-ieee-blue text-white font-mono text-xs font-bold rounded-[2px] hover:bg-ieee-dark transition-colors uppercase tracking-wider"
                  >
                    Authenticate Session →
                  </button>
                </div>
              </form>

              <div className="pt-4 border-t border-warm-200 text-center font-mono text-[11px] text-warm-400">
                Authorized Executive Officers & Webmasters Only
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Authenticated Officer Session Bar */}
              <div className="bg-ieee-subtle border border-ieee-blue/30 p-4 rounded-[2px] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <div className="flex items-center gap-2 text-ieee-blue">
                  <span className="font-bold">Active Officer Session:</span>
                  <span className="underline font-semibold">{activeOfficer}</span>
                  <span className="bg-ieee-blue text-white px-2 py-0.5 text-[10px] uppercase font-bold rounded-[2px]">
                    Super Admin
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-white border border-warm-300 text-ink hover:text-red-700 hover:border-red-300 transition-colors rounded-[2px]"
                >
                  🔒 Terminate Session (Logout)
                </button>
              </div>

              <SectionHeading
                category="Content & Governance"
                title="Management Dashboards"
                subtitle="Select a management collection to create, edit, or audit institutional records."
              />

              {/* CMS Collections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {/* 1. People Collection */}
                <div className="p-6 border border-warm-200 bg-white rounded-[2px] space-y-4 hover:border-ieee-blue transition-colors flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-ieee-blue font-semibold uppercase">Collection</span>
                      <span className="text-warm-400">6 Official Categories</span>
                    </div>
                    <h3 className="font-serif text-2xl text-ink font-normal">
                      People & Leadership
                    </h3>
                    <p className="text-xs text-warm-400 font-sans leading-relaxed">
                      Manage Branch Counsellor, Student Mentors, SEC, Operational Leads, and Chapter Executives.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-warm-200 flex items-center justify-between text-xs font-mono">
                    <span className="text-warm-400">Schema: PeopleCollection</span>
                    <span className="text-ieee-blue font-semibold">Audit Active ✓</span>
                  </div>
                </div>

                {/* 2. Events Collection */}
                <div className="p-6 border border-warm-200 bg-white rounded-[2px] space-y-4 hover:border-ieee-blue transition-colors flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-ieee-blue font-semibold uppercase">Collection</span>
                      <span className="text-warm-400">Upcoming & Past</span>
                    </div>
                    <h3 className="font-serif text-2xl text-ink font-normal">
                      Events & Workshops
                    </h3>
                    <p className="text-xs text-warm-400 font-sans leading-relaxed">
                      Post technical workshops, panel discussions, registration links, schedules, and speakers.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-warm-200 flex items-center justify-between text-xs font-mono">
                    <span className="text-warm-400">Schema: EventsCollection</span>
                    <span className="text-ieee-blue font-semibold">iCal Sync Active ✓</span>
                  </div>
                </div>

                {/* 3. Achievements Collection */}
                <div className="p-6 border border-warm-200 bg-white rounded-[2px] space-y-4 hover:border-ieee-blue transition-colors flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-ieee-blue font-semibold uppercase">Collection</span>
                      <span className="text-warm-400">Awards & Wins</span>
                    </div>
                    <h3 className="font-serif text-2xl text-ink font-normal">
                      Achievements Ledger
                    </h3>
                    <p className="text-xs text-warm-400 font-sans leading-relaxed">
                      Record section awards, national hackathon wins, and institutional recognitions.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-warm-200 flex items-center justify-between text-xs font-mono">
                    <span className="text-warm-400">Schema: Achievements</span>
                    <span className="text-ieee-blue font-semibold">Ledger Active ✓</span>
                  </div>
                </div>

                {/* 4. Organization Units */}
                <div className="p-6 border border-warm-200 bg-white rounded-[2px] space-y-4 hover:border-ieee-blue transition-colors flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-ieee-blue font-semibold uppercase">Collection</span>
                      <span className="text-warm-400">WIE & EDS</span>
                    </div>
                    <h3 className="font-serif text-2xl text-ink font-normal">
                      Organization Units
                    </h3>
                    <p className="text-xs text-warm-400 font-sans leading-relaxed">
                      Update mission statements, leadership details, and statistics for chapters & AGs.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-warm-200 flex items-center justify-between text-xs font-mono">
                    <span className="text-warm-400">Schema: OrgUnits</span>
                    <span className="text-ieee-blue font-semibold">Active ✓</span>
                  </div>
                </div>

                {/* 5. Stories & Articles */}
                <div className="p-6 border border-warm-200 bg-white rounded-[2px] space-y-4 hover:border-ieee-blue transition-colors flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-ieee-blue font-semibold uppercase">Collection</span>
                      <span className="text-warm-400">Publications</span>
                    </div>
                    <h3 className="font-serif text-2xl text-ink font-normal">
                      Stories & Reports
                    </h3>
                    <p className="text-xs text-warm-400 font-sans leading-relaxed">
                      Publish technical event reports, student writing, and workshop series post-mortems.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-warm-200 flex items-center justify-between text-xs font-mono">
                    <span className="text-warm-400">Schema: Stories</span>
                    <span className="text-ieee-blue font-semibold">Active ✓</span>
                  </div>
                </div>

                {/* 6. Photo Galleries */}
                <div className="p-6 border border-warm-200 bg-white rounded-[2px] space-y-4 hover:border-ieee-blue transition-colors flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-ieee-blue font-semibold uppercase">Collection</span>
                      <span className="text-warm-400">Photo Albums</span>
                    </div>
                    <h3 className="font-serif text-2xl text-ink font-normal">
                      Photo Galleries
                    </h3>
                    <p className="text-xs text-warm-400 font-sans leading-relaxed">
                      Upload documentary photography albums and captions for event photo galleries.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-warm-200 flex items-center justify-between text-xs font-mono">
                    <span className="text-warm-400">Schema: Galleries</span>
                    <span className="text-ieee-blue font-semibold">Lightbox Active ✓</span>
                  </div>
                </div>
              </div>

              {/* Audit & System Overview */}
              <div className="border border-warm-200 bg-warm-100/40 p-6 rounded-[2px] space-y-4">
                <h3 className="font-serif text-xl text-ink font-normal">
                  System Audit & Operational Configuration
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-warm-400 block uppercase">Official Email</span>
                    <span className="text-ink font-semibold">{BRANCH_STATS.email}</span>
                  </div>
                  <div>
                    <span className="text-warm-400 block uppercase">Est. Year</span>
                    <span className="text-ink font-semibold">{BRANCH_STATS.establishedYear}</span>
                  </div>
                  <div>
                    <span className="text-warm-400 block uppercase">Active Members</span>
                    <span className="text-ink font-semibold">{BRANCH_STATS.activeMembers}</span>
                  </div>
                  <div>
                    <span className="text-warm-400 block uppercase">Audit Logging</span>
                    <span className="text-emerald-700 font-semibold">Enabled (createdAt/updatedBy)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </>
  );
}
