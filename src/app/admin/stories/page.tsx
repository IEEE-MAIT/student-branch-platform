'use client';

import React, { useState, useEffect } from 'react';
import Link from '@/components/ui/AppLink';
import { Badge } from '@/components/ui/Badge';
import { FiArrowRight, FiExternalLink, FiTrash2 } from 'react-icons/fi';

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Tech Tuesday');
  const [readTime, setReadTime] = useState('5 min read');
  const [excerpt, setExcerpt] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const loadStories = () => {
    fetch('/api/publications')
      .then((res) => res.json())
      .then((data: any) => {
        if (Array.isArray(data)) setStories(data);
      })
      .catch(() => {
        fetch('/api/stories')
          .then((res) => res.json())
          .then((data: any) => {
            if (Array.isArray(data)) setStories(data);
          });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStories();
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
      const res = await fetch('/api/admin/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          author,
          date,
          category,
          readTime,
          excerpt,
          contentHtml,
          coverImage: coverImage || null,
        }),
      });
      const data: any = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Publication '${title}' published!` });
        setTitle('');
        setSlug('');
        setAuthor('');
        setExcerpt('');
        setContentHtml('');
        setCoverImage('');
        loadStories();
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to publish story.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error publishing publication.' });
    }
  };

  const handleDelete = async (id: string, storyTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${storyTitle}"?`)) return;
    try {
      const res = await fetch(`/api/admin/stories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg({ type: 'success', text: `Publication "${storyTitle}" removed.` });
        loadStories();
      } else {
        const data: any = await res.json();
        setMsg({ type: 'error', text: data.error || 'Delete failed.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error deleting publication.' });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal mb-1">
          Publications & Tech Tuesday CMS
        </h2>
        <p className="font-sans text-xs text-warm-400 dark:text-gray-400">
          Publish technical articles, weekly Tech Tuesday digests, branch newsletters, and research publications.
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
          Publish New Article / Digest Issue
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Publication Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Applied Neural Networks Workshop Series"
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
              placeholder="applied-neural-networks-workshop-series"
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Author / Editorial Desk</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. IEEE MAIT Editorial Board"
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Publication Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100"
            >
              <option value="Tech Tuesday">Tech Tuesday Digest</option>
              <option value="Technical Article">Technical Article</option>
              <option value="Branch Newsletter">Branch Newsletter</option>
              <option value="Event Report">Event Report / Retrospective</option>
              <option value="Spotlight">Student & Officer Spotlight</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Publish Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Read Time Estimate</label>
            <input
              type="text"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="5 min read"
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Cover Image URL (Optional)</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Excerpt / Brief Abstract *</label>
            <input
              type="text"
              required
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A concise 1-2 sentence overview for cards and meta descriptions..."
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-ink dark:text-gray-200 mb-1">Article Body Content (Markdown / HTML) *</label>
            <textarea
              rows={6}
              required
              value={contentHtml}
              onChange={(e) => setContentHtml(e.target.value)}
              placeholder="Full article content in Markdown or HTML..."
              className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 font-mono text-xs"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-mono text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            <span>Publish Article</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Publications List */}
      <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-warm-200 dark:border-gray-800 flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink dark:text-gray-200">
            Recorded Publications ({stories.length})
          </span>
          <Link href="/publications" target="_blank" className="inline-flex items-center gap-1 text-xs font-mono text-ieee-blue dark:text-sky-400 hover:underline">
            <span>View Public Hub</span>
            <FiExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center font-mono text-xs text-warm-400">Loading publications...</div>
        ) : stories.length === 0 ? (
          <div className="p-8 text-center font-mono text-xs text-warm-400">No publications recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-warm-50/70 dark:bg-gray-800/70 font-mono text-[11px] text-warm-500 dark:text-gray-400 uppercase tracking-wider border-b border-warm-200 dark:border-gray-800">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Author</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100 dark:divide-gray-800">
                {stories.map((item: any) => (
                  <tr key={item.id} className="hover:bg-warm-50/40 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-semibold text-ink dark:text-gray-100">{item.title}</div>
                      <div className="font-mono text-[11px] text-warm-400 dark:text-gray-400">/publications/{item.slug}</div>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="ieee">{item.category || item.type || 'Tech Digest'}</Badge>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-warm-500 dark:text-gray-400">
                      {item.author || 'IEEE MAIT'}
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-warm-500 dark:text-gray-400">
                      {item.date || '—'}
                    </td>
                    <td className="p-3.5 text-right space-x-2 font-mono">
                      <Link
                        href={`/publications/${item.slug}`}
                        target="_blank"
                        className="text-ieee-blue dark:text-sky-400 hover:underline"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.title)}
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
