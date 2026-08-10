'use client';

import React, { useState, useEffect } from 'react';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [unit, setUnit] = useState('IEEE MAIT SB');
  const [category, setCategory] = useState('Workshop');
  const [status, setStatus] = useState('upcoming');
  const [description, setDescription] = useState('');

  const loadEvents = () => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data: any) => {
        if (Array.isArray(data)) setEvents(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          date,
          time,
          venue,
          unit,
          category,
          status,
          description,
        }),
      });
      const data: any = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Event created successfully!` });
        setTitle('');
        setSlug('');
        setDescription('');
        loadEvents();
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to create event.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error creating event.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event record?')) return;
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg({ type: 'success', text: 'Event deleted successfully.' });
        loadEvents();
      } else {
        const data: any = await res.json();
        setMsg({ type: 'error', text: data.error || 'Delete failed.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error deleting event.' });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-ink font-normal mb-1">Manage Events & Workshops</h2>
        <p className="font-sans text-xs text-warm-400">
          Add new upcoming workshops, technical seminars, or past event records.
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

      {/* Create Form */}
      <form onSubmit={handleCreate} className="p-6 border border-warm-200 bg-warm-100/20 rounded-[2px] space-y-4">
        <h3 className="font-serif text-lg text-ink font-normal border-b border-warm-200 pb-2">
          Create New Event
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Event Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Machine Learning Workshop 2026"
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
              placeholder="ml-workshop-2026 (auto-generated if empty)"
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Date</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="AUG 20, 2026"
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Time</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="2:00 PM – 4:00 PM IST"
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Venue</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Seminar Hall, Block A, MAIT"
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Organizing Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 border rounded-[2px]"
            >
              <option value="IEEE MAIT SB">IEEE MAIT SB</option>
              <option value="WIE Affinity Group">WIE Affinity Group</option>
              <option value="EDS Chapter">EDS Chapter</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-[2px]"
            >
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Panel">Panel</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-[2px]"
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past / Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs text-warm-400 mb-1">Event Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Overview of topics covered, prerequisites, registration process..."
            className="w-full px-3 py-2 border rounded-[2px] text-xs font-sans"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-ieee-blue text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px]"
        >
          Publish Event Record →
        </button>
      </form>

      {/* Events Table */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg text-ink font-normal">Existing Event Records ({events.length})</h3>

        {loading ? (
          <p className="font-mono text-xs text-warm-300">Loading records...</p>
        ) : (
          <div className="border border-warm-200 overflow-x-auto rounded-[2px]">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-warm-100/60 font-mono text-[10px] uppercase text-warm-400 border-b border-warm-200">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-200">
                {events.map((evt: any) => (
                  <tr key={evt.id} className="hover:bg-warm-100/30">
                    <td className="p-3 font-medium text-ink">{evt.title}</td>
                    <td className="p-3 font-mono text-[11px] text-warm-400">{evt.unit}</td>
                    <td className="p-3 font-mono text-[11px] text-warm-400">{evt.date || '—'}</td>
                    <td className="p-3">
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded-[2px] uppercase ${
                          evt.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-warm-200 text-warm-400'
                        }`}
                      >
                        {evt.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(evt.id)}
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
