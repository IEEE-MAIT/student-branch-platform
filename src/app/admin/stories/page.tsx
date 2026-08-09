'use client';

import React, { useState, useEffect } from 'react';

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('Technical');
  const [readTime, setReadTime] = useState('5 min read');
  const [excerpt, setExcerpt] = useState('');
  const [contentHtml, setContentHtml] = useState('');

  const loadStories = () => {
    fetch('/api/stories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStories(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch('/api/admin/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          author,
          date,
          category,
          readTime,
          excerpt,
          contentHtml,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Story '${title}' published!` });
        setTitle('');
        setSlug('');
        setExcerpt('');
        setContentHtml('');
        loadStories();
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to publish story.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error publishing story.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    try {
      const res = await fetch(`/api/admin/stories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg({ type: 'success', text: 'Story deleted.' });
        loadStories();
      } else {
        const data = await res.json();
        setMsg({ type: 'error', text: data.error || 'Delete failed.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error.' });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-ink font-normal mb-1">Manage Stories & Articles</h2>
        <p className="font-sans text-xs text-warm-400">
          Publish technical articles, event post-mortems, and branch writeups.
        </p>
      </div>

      {msg && (
        <div
          className={`p-3 font-mono text-xs border ${
            msg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleCreate} className="p-6 border border-warm-200 bg-warm-100/20 rounded-[2px] space-y-4 font-sans text-xs">
        <h3 className="font-serif text-lg text-ink font-normal border-b border-warm-200 pb-2">
          Publish New Article
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Article Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="IEEE Day 2025: Key Takeaways & Highlights"
              className="w-full px-3 py-2 border rounded-[2px]"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ieee-day-2025-highlights"
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Author Name</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="IEEE MAIT Editorial Team"
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Publish Date</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="AUG 2026"
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-[2px]"
            >
              <option value="Technical">Technical</option>
              <option value="Event Report">Event Report</option>
              <option value="Student Spotlight">Student Spotlight</option>
              <option value="Opinion">Opinion</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Read Time Estimate</label>
            <input
              type="text"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="5 min read"
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-mono text-xs text-warm-400 mb-1">Excerpt / Summary</label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief 1-2 sentence teaser shown on index pages..."
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs text-warm-400 mb-1">Article Body Content (HTML / Rich Text) *</label>
          <textarea
            rows={6}
            value={contentHtml}
            onChange={(e) => setContentHtml(e.target.value)}
            placeholder="<p>Full HTML content of the article...</p>"
            className="w-full px-3 py-2 border rounded-[2px] font-mono text-xs"
            required
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-ieee-blue text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px]"
        >
          Publish Story →
        </button>
      </form>

      {/* List */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg text-ink font-normal">Published Stories ({stories.length})</h3>

        {loading ? (
          <p className="font-mono text-xs text-warm-300">Loading stories...</p>
        ) : (
          <div className="border border-warm-200 overflow-x-auto rounded-[2px]">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-warm-100/60 font-mono text-[10px] uppercase text-warm-400 border-b border-warm-200">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-200">
                {stories.map((item) => (
                  <tr key={item.id} className="hover:bg-warm-100/30">
                    <td className="p-3 font-medium text-ink">{item.title}</td>
                    <td className="p-3 font-mono text-xs text-warm-400">{item.author || '—'}</td>
                    <td className="p-3 font-mono text-[11px] text-warm-400">{item.category}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="font-mono text-xs text-red-600 hover:underline"
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
