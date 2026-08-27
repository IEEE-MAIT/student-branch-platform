'use client';

import React, { useState, useEffect } from 'react';
import Link from '@/components/ui/AppLink';
import { Badge } from '@/components/ui/Badge';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [organisation, setOrganisation] = useState('IEEE');
  const [category, setCategory] = useState('Scholarship');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [deadline, setDeadline] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState('Active');
  const [featured, setFeatured] = useState(false);

  const loadData = () => {
    fetch('/api/admin/opportunities')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setOpportunities(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    try {
      const res = await fetch('/api/admin/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          organisation,
          category,
          description,
          eligibility,
          deadline,
          link: link || null,
          status,
          featured,
        }),
      });

      const data: any = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Opportunity "${title}" published.` });
        setTitle('');
        setSlug('');
        setDescription('');
        setEligibility('');
        setDeadline('');
        setLink('');
        setFeatured(false);
        loadData();
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to create opportunity.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error publishing opportunity.' });
    }
  };

  const handleDelete = async (id: string, oppTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${oppTitle}"?`)) return;

    try {
      const res = await fetch(`/api/admin/opportunities?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg({ type: 'success', text: `Opportunity "${oppTitle}" removed.` });
        loadData();
      } else {
        const data: any = await res.json();
        setMsg({ type: 'error', text: data.error || 'Failed to delete opportunity.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error deleting opportunity.' });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal mb-1">
          Opportunities & Grants CMS
        </h2>
        <p className="font-sans text-xs text-warm-400 dark:text-gray-400">
          Publish and manage IEEE scholarships, research fellowships, travel grants, hackathons, and volunteer openings.
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
          Post New Grant or Opportunity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Opportunity Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. IEEE Richard E. Merwin Student Scholarship"
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
              placeholder="ieee-richard-e-merwin-scholarship-2026"
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Awarding Organisation / Society *</label>
            <input
              type="text"
              required
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              placeholder="e.g. IEEE Computer Society"
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Opportunity Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100"
            >
              <option value="Scholarship">Scholarship</option>
              <option value="Fellowship">Research Fellowship</option>
              <option value="Grant">Conference Travel Grant</option>
              <option value="Competition">Hackathon / Competition</option>
              <option value="Volunteer">Branch Volunteer Call</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Overview Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details on award monetary value, scope, and instructions..."
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 font-sans"
            />
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Eligibility Criteria</label>
            <input
              type="text"
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              placeholder="e.g. Undergraduate IEEE members with GPA >= 3.0"
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Application Deadline</label>
            <input
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="e.g. 30 September 2026"
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Official Application Link</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100"
            >
              <option value="Active">Active / Accepting Applications</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="oppFeatured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded text-ieee-blue focus:ring-ieee-blue"
            />
            <label htmlFor="oppFeatured" className="text-ink dark:text-gray-200 font-medium cursor-pointer">
              Feature at top of Opportunities Portal
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-mono text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            <span>Publish Opportunity</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Opportunities List */}
      <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-warm-200 dark:border-gray-800 flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink dark:text-gray-200">
            Recorded Opportunities &amp; Grants ({opportunities.length})
          </span>
          <Link href="/opportunities" target="_blank" className="inline-flex items-center gap-1 text-xs font-mono text-ieee-blue dark:text-sky-400 hover:underline">
            <span>View Public Portal</span>
            <FiExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center font-mono text-xs text-warm-400">Loading opportunities...</div>
        ) : opportunities.length === 0 ? (
          <div className="p-8 text-center font-mono text-xs text-warm-400">No opportunities created yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-warm-50/70 dark:bg-gray-800/70 font-mono text-[11px] text-warm-500 dark:text-gray-400 uppercase tracking-wider border-b border-warm-200 dark:border-gray-800">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Organisation</th>
                  <th className="p-3.5">Deadline</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100 dark:divide-gray-800">
                {opportunities.map((o) => (
                  <tr key={o.id} className="hover:bg-warm-50/40 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-semibold text-ink dark:text-gray-100">{o.title}</div>
                      <div className="font-mono text-[11px] text-warm-400 dark:text-gray-400">/{o.slug}</div>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="ieee">{o.category}</Badge>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-warm-500 dark:text-gray-400">
                      {o.organisation}
                    </td>
                    <td className="p-3.5 font-mono text-[11px]">
                      {o.deadline || 'Rolling'}
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2 font-mono">
                      {o.link && (
                        <a
                          href={o.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-ieee-blue dark:text-sky-400 hover:underline"
                        >
                          <span>Link</span>
                          <FiExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(o.id, o.title)}
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
