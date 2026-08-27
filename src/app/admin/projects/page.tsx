'use client';

import React, { useState, useEffect } from 'react';
import Link from '@/components/ui/AppLink';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [sigs, setSigs] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('2026');
  const [status, setStatus] = useState('Ongoing');
  const [tagsInput, setTagsInput] = useState('STM32, FreeRTOS, Embedded C');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [sigId, setSigId] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [featured, setFeatured] = useState(false);

  const loadData = () => {
    Promise.all([
      fetch('/api/admin/projects').then((r) => r.json()).catch(() => []),
      fetch('/api/admin/sigs').then((r) => r.json()).catch(() => []),
      fetch('/api/admin/chapters').then((r) => r.json()).catch(() => []),
    ]).then(([projs, sigsList, chaps]) => {
      if (Array.isArray(projs)) setProjects(projs);
      if (Array.isArray(sigsList)) setSigs(sigsList);
      if (Array.isArray(chaps)) setChapters(chaps);
      setLoading(false);
    });
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

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          summary,
          description,
          year,
          status,
          tags,
          githubUrl: githubUrl || null,
          demoUrl: demoUrl || null,
          sigId: sigId || null,
          chapterId: chapterId || null,
          featured,
        }),
      });

      const data: any = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Project "${title}" published successfully.` });
        setTitle('');
        setSlug('');
        setSummary('');
        setDescription('');
        setGithubUrl('');
        setDemoUrl('');
        setSigId('');
        setChapterId('');
        setFeatured(false);
        loadData();
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to create project.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error submitting project.' });
    }
  };

  const handleDelete = async (id: string, projectTitle: string) => {
    if (!confirm(`Are you sure you want to move "${projectTitle}" to the recycle bin?`)) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg({ type: 'success', text: `Project "${projectTitle}" removed.` });
        loadData();
      } else {
        const data: any = await res.json();
        setMsg({ type: 'error', text: data.error || 'Failed to delete project.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error deleting project.' });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal mb-1">
          Technical Projects CMS
        </h2>
        <p className="font-sans text-xs text-warm-400 dark:text-gray-400">
          Manage student engineering builds, hardware schematics, firmware repositories, and case studies.
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
          Publish New Technical Build
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Autonomous Solar Quadruped Rover"
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
              placeholder="autonomous-solar-quadruped-rover"
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">One-Line Summary *</label>
            <input
              type="text"
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary of hardware architecture and capabilities..."
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Detailed Technical Narrative & Specs</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed system architecture, signal flow, microcontrollers used, and experimental results..."
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 font-sans"
            />
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Associated SIG (Optional)</label>
            <select
              value={sigId}
              onChange={(e) => setSigId(e.target.value)}
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100"
            >
              <option value="">None / Branch Independent</option>
              {sigs.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Associated Chapter (Optional)</label>
            <select
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100"
            >
              <option value="">None / Parent SB</option>
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100"
            >
              <option value="Ongoing">Ongoing / Active Development</option>
              <option value="Completed">Completed / Production Ready</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Year</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">GitHub Repository URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/IEEE-MAIT/..."
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Live Demo / Documentation URL</label>
            <input
              type="url"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="ESP32, TinyML, FreeRTOS, KiCad"
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 font-mono"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded text-ieee-blue focus:ring-ieee-blue"
            />
            <label htmlFor="featured" className="text-ink dark:text-gray-200 font-medium cursor-pointer">
              Feature on Homepage & Projects Spotlight
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-mono text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            <span>Publish Project</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Projects Roster Table */}
      <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-warm-200 dark:border-gray-800 flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink dark:text-gray-200">
            Recorded Technical Projects ({projects.length})
          </span>
          <Link href="/projects" target="_blank" className="inline-flex items-center gap-1 text-xs font-mono text-ieee-blue dark:text-sky-400 hover:underline">
            <span>View Public Portal</span>
            <FiExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center font-mono text-xs text-warm-400">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center font-mono text-xs text-warm-400">No projects recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-warm-50/70 dark:bg-gray-800/70 font-mono text-[11px] text-warm-500 dark:text-gray-400 uppercase tracking-wider border-b border-warm-200 dark:border-gray-800">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">SIG / Chapter</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Year</th>
                  <th className="p-3.5">Featured</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100 dark:divide-gray-800">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-warm-50/40 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-semibold text-ink dark:text-gray-100">{p.title}</div>
                      <div className="font-mono text-[11px] text-warm-400 dark:text-gray-400">/{p.slug}</div>
                    </td>
                    <td className="p-3.5 font-mono text-[11px]">
                      {p.sig?.name || p.chapter?.name || 'Parent Branch'}
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-warm-100 dark:bg-gray-800 text-warm-600 dark:text-gray-300">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono">{p.year}</td>
                    <td className="p-3.5 font-mono">
                      {p.featured ? <span className="text-amber-600 font-bold">★ Yes</span> : 'No'}
                    </td>
                    <td className="p-3.5 text-right space-x-2 font-mono">
                      <Link
                        href={`/projects/${p.slug}`}
                        target="_blank"
                        className="text-ieee-blue dark:text-sky-400 hover:underline"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.title)}
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
