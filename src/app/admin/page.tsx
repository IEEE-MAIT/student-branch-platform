'use client';

/**
 * @file src/app/admin/page.tsx
 * @description Secure JWT-Authenticated Officer Portal & Site-Wide Audit History Ledger for IEEE MAIT.
 * 
 * AUDIT & CHANGE HISTORY SPECIFICATIONS:
 * - Fetches `/api/audit-logs` history ledger displaying Who modified What and When.
 * - Displays timestamp, officer email, action badge (`CREATE`, `UPDATE`, `DELETE`), and change description.
 * - Super Admin Officer Creation Panel & Collections Overview.
 * 
 * @author IEEE MAIT Webmaster & Security Engineering
 * @license MIT
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { PersonCategory } from '@/lib/data';

interface OfficerInfo {
  userId?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  category: string;
  createdAt?: string;
  createdBy?: string;
}

interface AuditLogItem {
  id: string;
  timestamp: string;
  performedBy: string;
  actionType: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: string;
  entityTitle: string;
  changeSummary: string;
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentOfficer, setCurrentOfficer] = useState<OfficerInfo | null>(null);
  const [officersList, setOfficersList] = useState<OfficerInfo[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Login Form State
  const [email, setEmail] = useState<string>('mait.ieee.sb@gmail.com');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Officer Creation Form State (Super Admin Only)
  const [newOfficerName, setNewOfficerName] = useState<string>('');
  const [newOfficerEmail, setNewOfficerEmail] = useState<string>('');
  const [newOfficerPassword, setNewOfficerPassword] = useState<string>('Officer@2026');
  const [newOfficerRole, setNewOfficerRole] = useState<'Executive Officer' | 'Webmaster' | 'Content Editor'>('Executive Officer');
  const [newOfficerCategory, setNewOfficerCategory] = useState<PersonCategory>(PersonCategory.SEC);
  const [createMsg, setCreateMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check active JWT session & fetch audit logs on mount
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.officer) {
          setIsAuthenticated(true);
          setCurrentOfficer(data.officer);
          if (data.officersList) setOfficersList(data.officersList);
        } else {
          setIsAuthenticated(false);
          setCurrentOfficer(null);
        }
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setLoading(false));

    // Fetch Audit Logs
    fetch('/api/audit-logs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAuditLogs(data);
      })
      .catch((err) => console.warn('[Audit Logs] Fetch failed:', err));
  }, []);

  const refreshAuditLogs = () => {
    fetch('/api/audit-logs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAuditLogs(data);
      });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Authentication failed.');
        return;
      }

      setIsAuthenticated(true);
      setCurrentOfficer(data.officer);
      setPassword('');

      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      if (sessionData.officersList) setOfficersList(sessionData.officersList);
      refreshAuditLogs();
    } catch {
      setLoginError('Server network connection error.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
    setCurrentOfficer(null);
    setOfficersList([]);
    setPassword('');
  };

  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateMsg(null);

    try {
      const res = await fetch('/api/auth/create-officer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newOfficerName,
          email: newOfficerEmail,
          password: newOfficerPassword,
          role: newOfficerRole,
          category: newOfficerCategory,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCreateMsg({ type: 'error', text: data.error || 'Failed to create officer.' });
        return;
      }

      setCreateMsg({ type: 'success', text: `Officer "${data.officer.name}" created successfully!` });
      setNewOfficerName('');
      setNewOfficerEmail('');

      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      if (sessionData.officersList) setOfficersList(sessionData.officersList);
      refreshAuditLogs();
    } catch {
      setCreateMsg({ type: 'error', text: 'Server network error creating officer.' });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="py-24 text-center font-mono text-sm text-warm-400">
          Loading JWT Session & Audit History...
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-200 pb-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="ieee">IEEE MAIT Audit Engine</Badge>
                <Badge variant={isAuthenticated ? 'ieee' : 'neutral'}>
                  {isAuthenticated ? `JWT Session: ${currentOfficer?.role}` : 'JWT Protected'}
                </Badge>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
                Site-Wide Change History & Governance Ledger
              </h1>
            </div>

            <div className="bg-warm-100/80 border border-warm-200 px-4 py-2 rounded-[2px] font-mono text-xs flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-ink font-semibold">Audit Logging:</span>
              <span className="text-emerald-700 font-bold">Active ✓</span>
            </div>
          </div>

          {/* Conditional View: Login Form vs Authenticated Portal */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto my-8 border border-warm-200 bg-white p-8 rounded-[2px] shadow-sm space-y-6">
              <div className="space-y-2 border-b border-warm-200 pb-4">
                <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-wider block">
                  JWT Security Authentication
                </span>
                <h3 className="font-serif text-2xl text-ink font-normal">
                  Log In to Admin Portal
                </h3>
                <p className="text-xs text-warm-400 font-sans">
                  Enter your officer credentials to access change history logs and management tools.
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
                    className="w-full px-3 py-2 border border-warm-300 rounded-[2px] focus:outline-none focus:border-ieee-blue text-sm font-mono"
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
                    placeholder="Admin@2026"
                    className="w-full px-3 py-2 border border-warm-300 rounded-[2px] focus:outline-none focus:border-ieee-blue text-sm font-mono"
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
                Default Super Admin: <code className="text-ieee-blue">mait.ieee.sb@gmail.com</code> / <code className="text-ieee-blue">Admin@2026</code>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Authenticated Session Bar */}
              <div className="bg-ieee-subtle border border-ieee-blue/30 p-4 rounded-[2px] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <div className="flex items-center gap-2 text-ieee-blue">
                  <span className="font-bold">Logged In Officer:</span>
                  <span className="underline font-semibold">{currentOfficer?.email}</span>
                  <span className="bg-ieee-blue text-white px-2 py-0.5 text-[10px] uppercase font-bold rounded-[2px]">
                    {currentOfficer?.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-white border border-warm-300 text-ink hover:text-red-700 hover:border-red-300 transition-colors rounded-[2px]"
                >
                  🔒 Clear JWT Cookie (Logout)
                </button>
              </div>

              {/* SITE-WIDE CHANGE HISTORY LEDGER TABLE (Who, When, What) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-warm-200 pb-2">
                  <div>
                    <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-wider block">
                      Audit Governance
                    </span>
                    <h3 className="font-serif text-2xl text-ink font-normal">
                      Site-Wide Change History Ledger ({auditLogs.length})
                    </h3>
                  </div>
                  <button
                    onClick={refreshAuditLogs}
                    className="px-3 py-1 bg-warm-100 border border-warm-200 hover:border-ieee-blue font-mono text-xs rounded-[2px] transition-colors"
                  >
                    🔄 Refresh Logs
                  </button>
                </div>

                <div className="border border-warm-200 rounded-[2px] bg-white overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs">
                    <thead className="bg-warm-100/70 border-b border-warm-200 font-mono text-warm-400 uppercase text-[11px]">
                      <tr>
                        <th className="p-3">Timestamp (When)</th>
                        <th className="p-3">Officer (Who)</th>
                        <th className="p-3">Action</th>
                        <th className="p-3">Target Entity</th>
                        <th className="p-3">Change Summary (What Changed)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-warm-200">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-warm-100/30">
                          <td className="p-3 font-mono text-warm-400 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="p-3 font-mono text-ieee-blue font-semibold whitespace-nowrap">
                            {log.performedBy}
                          </td>
                          <td className="p-3 font-mono whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase ${
                                log.actionType === 'CREATE'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : log.actionType === 'UPDATE'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : 'bg-red-100 text-red-800 border border-red-300'
                              }`}
                            >
                              {log.actionType}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-ink whitespace-nowrap">
                            [{log.entityType}] {log.entityTitle}
                          </td>
                          <td className="p-3 text-ink-muted leading-relaxed max-w-md">
                            {log.changeSummary}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SUPER ADMIN OFFICER REGISTRATION FORM */}
              {currentOfficer?.role === 'Super Admin' && (
                <div className="border border-warm-200 bg-warm-100/40 p-6 rounded-[2px] space-y-6">
                  <div className="border-b border-warm-200 pb-3">
                    <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-wider block">
                      Super Admin Authority
                    </span>
                    <h3 className="font-serif text-2xl text-ink font-normal">
                      Register New Branch Officer
                    </h3>
                    <p className="text-xs text-warm-400 font-sans mt-1">
                      Super Admin permission granted to add executive committee officers, webmasters, and content editors to the database.
                    </p>
                  </div>

                  {createMsg && (
                    <div
                      className={`p-3 text-xs font-mono rounded-[2px] ${
                        createMsg.type === 'success'
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                          : 'bg-red-50 border border-red-200 text-red-700'
                      }`}
                    >
                      {createMsg.type === 'success' ? '✓ ' : '⚠️ '}
                      {createMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleCreateOfficer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans text-xs">
                    <div className="space-y-1">
                      <label className="font-mono text-ink font-semibold block uppercase">Officer Full Name</label>
                      <input
                        type="text"
                        value={newOfficerName}
                        onChange={(e) => setNewOfficerName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3 py-2 bg-white border border-warm-300 rounded-[2px] focus:outline-none focus:border-ieee-blue"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-ink font-semibold block uppercase">Officer Email</label>
                      <input
                        type="email"
                        value={newOfficerEmail}
                        onChange={(e) => setNewOfficerEmail(e.target.value)}
                        placeholder="officer@mait.ac.in"
                        className="w-full px-3 py-2 bg-white border border-warm-300 rounded-[2px] focus:outline-none focus:border-ieee-blue font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-ink font-semibold block uppercase">Temporary Password</label>
                      <input
                        type="text"
                        value={newOfficerPassword}
                        onChange={(e) => setNewOfficerPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-warm-300 rounded-[2px] focus:outline-none focus:border-ieee-blue font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-ink font-semibold block uppercase">Assigned Role</label>
                      <select
                        value={newOfficerRole}
                        onChange={(e) => setNewOfficerRole(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-warm-300 rounded-[2px] focus:outline-none focus:border-ieee-blue font-mono"
                      >
                        <option value="Executive Officer">Executive Officer</option>
                        <option value="Webmaster">Webmaster</option>
                        <option value="Content Editor">Content Editor</option>
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-mono text-ink font-semibold block uppercase">Official Category</label>
                      <select
                        value={newOfficerCategory}
                        onChange={(e) => setNewOfficerCategory(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-warm-300 rounded-[2px] focus:outline-none focus:border-ieee-blue font-mono"
                      >
                        {Object.values(PersonCategory).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-ieee-blue text-white font-mono text-xs font-bold rounded-[2px] hover:bg-ieee-dark transition-colors uppercase tracking-wider"
                      >
                        + Register Officer in Database
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* REGISTERED OFFICERS DIRECTORY TABLE */}
              {officersList.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl text-ink font-normal border-b border-warm-200 pb-2">
                    Registered Branch Officers Directory ({officersList.length})
                  </h3>
                  <div className="border border-warm-200 rounded-[2px] bg-white overflow-x-auto">
                    <table className="w-full text-left font-sans text-xs">
                      <thead className="bg-warm-100/70 border-b border-warm-200 font-mono text-warm-400 uppercase text-[11px]">
                        <tr>
                          <th className="p-3">Name</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Registered By</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-warm-200">
                        {officersList.map((off, idx) => (
                          <tr key={off.id || idx} className="hover:bg-warm-100/30">
                            <td className="p-3 font-semibold text-ink">{off.name}</td>
                            <td className="p-3 font-mono text-ieee-blue">{off.email}</td>
                            <td className="p-3 font-mono">
                              <span className="bg-ieee-subtle border border-ieee-blue/20 px-2 py-0.5 rounded-[2px]">
                                {off.role}
                              </span>
                            </td>
                            <td className="p-3 text-warm-400">{off.category}</td>
                            <td className="p-3 font-mono text-warm-400">{off.createdBy || 'Super Admin'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </>
  );
}
