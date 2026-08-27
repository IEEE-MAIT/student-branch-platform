'use client';

import React, { useState, useEffect } from 'react';
import Link from '@/components/ui/AppLink';

export default function AdminSIGsPage() {
  const [sigs, setSigs] = useState<any[]>([]);
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [accentColor, setAccentColor] = useState('#00629B');
  const [memberCount, setMemberCount] = useState(40);
  const [leadId, setLeadId] = useState('');

  const loadData = () => {
    Promise.all([
      fetch('/api/admin/sigs').then((r) => r.json()).catch(() => []),
      fetch('/api/admin/people').then((r) => r.json()).catch(() => []),
    ]).then(([sigsList, peopleList]) => {
      if (Array.isArray(sigsList)) setSigs(sigsList);
      if (Array.isArray(peopleList)) setPeople(peopleList);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    try {
      const res = await fetch('/api/admin/sigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          description,
          accentColor,
          memberCount: Number(memberCount),
          leadId: leadId || null,
        }),
      });

      const data: any = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Special Interest Group "${name}" created.` });
        setName('');
        setSlug('');
        setDescription('');
        setLeadId('');
        loadData();
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to create SIG.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error creating SIG.' });
    }
  };

  const handleDelete = async (id: string, sigName: string) => {
    if (!confirm(`Are you sure you want to delete "${sigName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/sigs?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg({ type: 'success', text: `SIG "${sigName}" removed.` });
        loadData();
      } else {
        const data: any = await res.json();
        setMsg({ type: 'error', text: data.error || 'Failed to delete SIG.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error deleting SIG.' });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal mb-1">
          Special Interest Groups (SIGs) CMS
        </h2>
        <p className="font-sans text-xs text-warm-400 dark:text-gray-400">
          Manage technical wings, leads, focus areas, syllabus tracks, and membership quotas.
        </p>
      </div>

      {msg && (
        <div
          className={`p-3 text-xs font-mono rounded-lg border ${
            msg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Creation Form */}
      <form onSubmit={handleCreate} className="p-6 border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl space-y-4 shadow-xs">
        <h3 className="font-serif text-lg text-ink dark:text-gray-100 font-normal border-b border-warm-100 dark:border-gray-800 pb-2">
          Create New Special Interest Group
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">SIG Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Artificial Intelligence & Machine Learning"
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">URL Slug *</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ai-ml"
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Mission & Focus Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Core focus, weekly syllabus track, and technical objectives..."
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 font-sans"
            />
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Accent Color Code (Hex)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-9 h-9 rounded-lg border border-warm-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Member Count / Active Pod Size</label>
            <input
              type="number"
              value={memberCount}
              onChange={(e) => setMemberCount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Designated Lead (Optional)</label>
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100"
            >
              <option value="">None / Open for Assignment</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-mono text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            Create SIG →
          </button>
        </div>
      </form>

      {/* SIGs Table */}
      <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-warm-200 dark:border-gray-800 flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink dark:text-gray-200">
            Active Special Interest Groups ({sigs.length})
          </span>
          <Link href="/sigs" target="_blank" className="text-xs font-mono text-ieee-blue dark:text-sky-400 hover:underline">
            View Public Hub ↗
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center font-mono text-xs text-warm-400">Loading SIGs...</div>
        ) : sigs.length === 0 ? (
          <div className="p-8 text-center font-mono text-xs text-warm-400">No SIGs created yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-warm-50/70 dark:bg-gray-800/70 font-mono text-[11px] text-warm-500 dark:text-gray-400 uppercase tracking-wider border-b border-warm-200 dark:border-gray-800">
                <tr>
                  <th className="p-3.5">Group Name</th>
                  <th className="p-3.5">Lead</th>
                  <th className="p-3.5">Active Pod Size</th>
                  <th className="p-3.5">Color Accent</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100 dark:divide-gray-800">
                {sigs.map((s) => (
                  <tr key={s.id} className="hover:bg-warm-50/40 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-semibold text-ink dark:text-gray-100">{s.name}</div>
                      <div className="font-mono text-[11px] text-warm-400 dark:text-gray-400">/sigs/{s.slug}</div>
                    </td>
                    <td className="p-3.5 font-mono text-[11px]">
                      {s.lead?.name || 'Unassigned'}
                    </td>
                    <td className="p-3.5 font-mono">
                      {s.memberCount} Members
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: s.accentColor }} />
                        <span className="font-mono text-[11px] text-warm-500 dark:text-gray-400">{s.accentColor}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-right space-x-2 font-mono">
                      <Link
                        href={`/sigs/${s.slug}`}
                        target="_blank"
                        className="text-ieee-blue dark:text-sky-400 hover:underline"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id, s.name)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
