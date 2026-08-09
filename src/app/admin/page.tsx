'use client';

/**
 * @file src/app/admin/page.tsx
 * @description Secure JWT-Authenticated Admin Portal with CMS capabilities.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { PersonCategory } from '@/lib/data';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentOfficer, setCurrentOfficer] = useState<any>(null);
  const [officersList, setOfficersList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'CMS' | 'SECURITY' | 'AUDIT'>('CMS');

  // Login Form State
  const [email, setEmail] = useState<string>('mait.ieee.sb@gmail.com');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // CMS Form States
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState('upcoming');
  const [cmsMsg, setCmsMsg] = useState<{type: 'success'|'error', text: string} | null>(null);

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

    fetch('/api/audit-logs').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setAuditLogs(data);
    });
  }, []);

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
      window.location.reload();
    } catch {
      setLoginError('Server network connection error.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.reload();
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCmsMsg(null);
    try {
      const payload = {
        title: newEventTitle,
        slug: newEventTitle.toLowerCase().replace(/\\s+/g, '-'),
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        venue: 'Main Auditorium',
        unit: 'IEEE MAIT',
        unitSlug: 'sb',
        category: 'Branch Event',
        status: newEventType,
        description: 'Dynamically created event from CMS.',
        imageSrc: '/assets/images/placeholder.jpg',
        registrationLink: '#'
      };

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      if (res.ok) {
        setCmsMsg({ type: 'success', text: 'Event created successfully!' });
        setNewEventTitle('');
      } else {
        setCmsMsg({ type: 'error', text: data.error || 'Failed to create event.' });
      }
    } catch {
      setCmsMsg({ type: 'error', text: 'Network error.' });
    }
  };

  if (loading) {
    return (
      <main className="py-24 text-center font-mono text-sm text-warm-400">Loading JWT Session...</main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-200 pb-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="ieee">IEEE MAIT Command Center</Badge>
                <Badge variant={isAuthenticated ? 'ieee' : 'neutral'}>
                  {isAuthenticated ? `JWT Session: ${currentOfficer?.role}` : 'JWT Protected'}
                </Badge>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
                Administrative CMS Portal
              </h1>
            </div>
          </div>

          {!isAuthenticated ? (
            <div className="max-w-md mx-auto my-8 border border-warm-200 p-8 rounded-[2px] shadow-sm">
              <h3 className="font-serif text-2xl text-ink font-normal mb-4">Log In to Admin Portal</h3>
              {loginError && <div className="p-3 bg-red-50 text-red-700 text-xs mb-4">{loginError}</div>}
              <form onSubmit={handleLogin} className="space-y-4 font-sans text-xs">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 border" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 border" required />
                <button type="submit" className="w-full py-3 bg-ieee-blue text-white font-bold rounded-[2px]">Authenticate</button>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Tabs */}
              <div className="flex border-b border-warm-200">
                {['CMS', 'SECURITY', 'AUDIT'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-3 font-mono text-xs font-bold border-b-2 transition-colors ${activeTab === tab ? 'border-ieee-blue text-ieee-blue' : 'border-transparent text-warm-400 hover:text-ink'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'CMS' && (
                <div className="border border-warm-200 bg-warm-50 p-6">
                  <h3 className="font-serif text-2xl mb-4">Content Management System</h3>
                  {cmsMsg && <div className={`p-3 text-xs mb-4 ${cmsMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>{cmsMsg.text}</div>}
                  
                  <div className="bg-white p-6 border border-warm-200 shadow-sm">
                    <h4 className="font-mono text-sm font-bold text-ieee-blue mb-4">Publish New Event</h4>
                    <form onSubmit={handleCreateEvent} className="space-y-4">
                      <input type="text" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} placeholder="Event Title (e.g. AI Workshop 2026)" className="w-full px-3 py-2 border font-sans text-sm" required />
                      <select value={newEventType} onChange={e => setNewEventType(e.target.value)} className="w-full px-3 py-2 border font-sans text-sm">
                        <option value="upcoming">Upcoming Event</option>
                        <option value="past">Past Event</option>
                      </select>
                      <button type="submit" className="px-6 py-2 bg-ieee-blue text-white font-mono text-xs font-bold">+ Create Event</button>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'SECURITY' && (
                <div className="border border-warm-200 bg-warm-50 p-6">
                  <h3 className="font-serif text-2xl mb-4">Officer Management (Super Admin)</h3>
                  {/* Reduced for brevity; this handles officers */}
                  <table className="w-full text-left font-sans text-xs bg-white border border-warm-200">
                    <thead className="bg-warm-100 uppercase"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th></tr></thead>
                    <tbody>
                      {officersList.map(off => (
                        <tr key={off.id} className="border-t"><td className="p-3">{off.name}</td><td className="p-3">{off.email}</td><td className="p-3">{off.role}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'AUDIT' && (
                <div className="border border-warm-200 bg-warm-50 p-6">
                  <h3 className="font-serif text-2xl mb-4">Site-Wide Audit Ledger</h3>
                  <table className="w-full text-left font-sans text-xs bg-white border border-warm-200">
                    <thead className="bg-warm-100 uppercase"><tr><th className="p-3">Timestamp</th><th className="p-3">Who</th><th className="p-3">Action</th><th className="p-3">Entity</th></tr></thead>
                    <tbody>
                      {auditLogs.map(log => (
                        <tr key={log.id} className="border-t"><td className="p-3">{new Date(log.timestamp).toLocaleString()}</td><td className="p-3 font-semibold text-ieee-blue">{log.performedBy}</td><td className="p-3">{log.actionType}</td><td className="p-3">{log.entityTitle}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="pt-8">
                <button onClick={handleLogout} className="text-red-600 font-mono text-xs underline">Logout Session</button>
              </div>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
