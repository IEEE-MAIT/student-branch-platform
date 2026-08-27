'use client';

/**
 * @file src/app/admin/layout.tsx
 * @description Nested Admin Portal Layout with Sidebar, Session Validation, and RBAC support.
 *
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useEffect, useState } from 'react';
import Link from '@/components/ui/AppLink';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';

const ADMIN_NAV = [
  { label: 'Overview', href: '/admin' },
  { label: 'Events & Workshops', href: '/admin/events' },
  { label: 'Technical Projects', href: '/admin/projects' },
  { label: 'Special Interest Groups', href: '/admin/sigs' },
  { label: 'Opportunities & Grants', href: '/admin/opportunities' },
  { label: 'Achievements Ledger', href: '/admin/achievements' },
  { label: 'People & Roster', href: '/admin/people' },
  { label: 'Publications & Articles', href: '/admin/stories' },
  { label: 'Photo Galleries', href: '/admin/galleries' },
  { label: 'Resources & Documents', href: '/admin/resources' },
  { label: 'Media Library & Assets', href: '/admin/assets' },
  { label: 'Milestones Timeline', href: '/admin/milestones' },
  { label: 'Site Settings', href: '/admin/settings' },
  { label: 'Audit Logs', href: '/admin/audit-logs' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<{ authenticated: boolean; officer?: any } | null>(null);
  const [loading, setLoading] = useState(true);

  // Login form state (if not authenticated)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data: any) => {
        if (data.authenticated) {
          setSession(data);
        } else {
          setSession({ authenticated: false });
        }
      })
      .catch(() => setSession({ authenticated: false }))
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data: any = await res.json();
      if (res.ok && data.success) {
        setSession({ authenticated: true, officer: data.officer });
        router.refresh();
      } else {
        setLoginError(data.error || 'Authentication failed');
      }
    } catch {
      setLoginError('Server error during login.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setSession({ authenticated: false });
    router.push('/admin');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 py-24 text-center font-mono text-xs text-warm-400 dark:text-gray-400 bg-white dark:bg-gray-950 min-h-screen">
          Validating IEEE MAIT Admin Session...
        </main>
        <Footer />
      </>
    );
  }

  // Unauthenticated — render clean login box
  if (!session?.authenticated) {
    return (
      <>
        <Navbar />
        <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 min-h-screen">
          <Container size="narrow">
            <div className="max-w-md mx-auto border border-warm-200 dark:border-gray-800 p-8 rounded-xl bg-white dark:bg-gray-900 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="ieee">IEEE MAIT CMS</Badge>
                <span className="font-mono text-xs text-warm-400 dark:text-gray-400">Protected Portal</span>
              </div>

              <h1 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal mb-2">Officer Authentication</h1>
              <p className="font-sans text-xs text-warm-400 dark:text-gray-400 mb-6">
                Enter your executive credentials to access the CMS portal.
              </p>

              {loginError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs font-mono mb-4 border border-red-200 dark:border-red-800 rounded-lg">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-warm-500 dark:text-gray-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mait.ieee.sb@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 focus:outline-hidden focus:border-ieee-blue dark:focus:border-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-warm-500 dark:text-gray-400 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 focus:outline-hidden focus:border-ieee-blue dark:focus:border-sky-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Authenticate Session →
                </button>
              </form>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  // Authenticated — render layout with persistent navigation sidebar
  return (
    <>
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 bg-white dark:bg-gray-950 min-h-screen">
        <Container size="default">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-200 dark:border-gray-800 pb-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="ieee">IEEE MAIT Command Center</Badge>
                <span className="font-mono text-xs text-ieee-blue dark:text-sky-400 font-semibold">
                  Role: {session.officer?.role || 'Executive Admin'}
                </span>
              </div>
              <h1 className="font-serif text-3xl text-ink dark:text-gray-100 font-normal">
                Administrative CMS Portal
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-warm-400 dark:text-gray-400">
                {session.officer?.email}
              </span>
              <button
                onClick={handleLogout}
                className="font-mono text-xs text-red-600 dark:text-red-400 hover:underline font-semibold cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Grid Layout: Navigation Sidebar + Subpage Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Sidebar Nav */}
            <aside className="md:col-span-3">
              <nav className="space-y-1 border border-warm-200 dark:border-gray-800 rounded-xl p-2 bg-warm-50/50 dark:bg-gray-900/50">
                <div className="px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-warm-400 dark:text-gray-400">
                  CMS Navigation
                </div>
                {ADMIN_NAV.map((item: any) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-3 py-2 text-xs font-mono rounded-lg transition-colors ${
                        isActive
                          ? 'bg-ieee-blue text-white font-bold dark:bg-sky-600'
                          : 'text-warm-600 dark:text-gray-300 hover:bg-warm-100 dark:hover:bg-gray-800 hover:text-ink dark:hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            {/* Main Section */}
            <section className="md:col-span-9">{children}</section>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
