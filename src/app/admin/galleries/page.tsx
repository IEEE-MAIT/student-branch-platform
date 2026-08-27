'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';

export default function AdminGalleriesPage() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('Events');
  const [coverImage, setCoverImage] = useState('');
  const [description, setDescription] = useState('');

  const loadGalleries = () => {
    fetch('/api/admin/galleries')
      .then((res) => res.json())
      .then((data: any) => {
        if (Array.isArray(data)) setGalleries(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadGalleries();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch('/api/admin/galleries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          date,
          category,
          coverImage,
          description,
        }),
      });
      const data: any = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Gallery album '${title}' created!` });
        setTitle('');
        setSlug('');
        setCoverImage('');
        setDescription('');
        loadGalleries();
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to create gallery album.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error creating gallery.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery album?')) return;
    try {
      const res = await fetch(`/api/admin/galleries?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg({ type: 'success', text: 'Gallery album deleted.' });
        loadGalleries();
      } else {
        const data: any = await res.json();
        setMsg({ type: 'error', text: data.error || 'Delete failed.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error.' });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-ink font-normal mb-1">Manage Photo Albums & Galleries</h2>
        <p className="font-sans text-xs text-warm-400">
          Create documentary photo albums for workshops, hackathons, and celebrations.
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
          Create New Photo Album
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Album Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="IEEE Day 2025 Opening Ceremony"
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
              placeholder="ieee-day-2025-opening"
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Event Date</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="OCT 2025"
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
              <option value="Events">Events</option>
              <option value="Workshops">Workshops</option>
              <option value="Hackathons">Hackathons</option>
              <option value="Celebrations">Celebrations</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-mono text-xs text-warm-400 mb-1">Cover Image URL</label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs text-warm-400 mb-1">Album Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Documentary record of the event..."
            className="w-full px-3 py-2 border rounded-[2px] font-sans text-xs"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-ieee-blue text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px]"
        >
          <span>Create Album</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* List */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg text-ink font-normal">Photo Albums ({galleries.length})</h3>

        {loading ? (
          <p className="font-mono text-xs text-warm-300">Loading albums...</p>
        ) : (
          <div className="border border-warm-200 overflow-x-auto rounded-[2px]">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-warm-100/60 font-mono text-[10px] uppercase text-warm-400 border-b border-warm-200">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-200">
                {galleries.map((item: any) => (
                  <tr key={item.id} className="hover:bg-warm-100/30">
                    <td className="p-3 font-medium text-ink">{item.title}</td>
                    <td className="p-3 font-mono text-xs text-warm-400">{item.category}</td>
                    <td className="p-3 font-mono text-[11px] text-warm-400">{item.date || '—'}</td>
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
