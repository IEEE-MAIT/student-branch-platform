'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';

export default function AdminMilestonesPage() {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [year, setYear] = useState('2026');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Establishment');
  const [sortOrder, setSortOrder] = useState(2026);
  const [description, setDescription] = useState('');

  const loadMilestones = () => {
    fetch('/api/admin/milestones')
      .then((res) => res.json())
      .then((data: any) => {
        if (Array.isArray(data)) setMilestones(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMilestones();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch('/api/admin/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year,
          title,
          category,
          sortOrder: Number(sortOrder),
          description,
        }),
      });
      const data: any = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Milestone '${title}' added to history!` });
        setTitle('');
        setDescription('');
        loadMilestones();
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to add milestone.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error adding milestone.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this milestone record?')) return;
    try {
      const res = await fetch(`/api/admin/milestones?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg({ type: 'success', text: 'Milestone record deleted.' });
        loadMilestones();
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
        <h2 className="font-serif text-2xl text-ink font-normal mb-1">Manage History & Milestones</h2>
        <p className="font-sans text-xs text-warm-400">
          Record key historical turning points, charter events, and section honors for the /about/history timeline.
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
          Add Historical Milestone
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Milestone Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="IEEE MAIT Student Branch Chartered"
              className="w-full px-3 py-2 border rounded-[2px]"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Year / Date Label *</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2005"
              className="w-full px-3 py-2 border rounded-[2px]"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-[2px]"
            >
              <option value="Establishment">Establishment</option>
              <option value="Award / Recognition">Award / Recognition</option>
              <option value="Chapter Charter">Chapter Charter</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Chronological Sort Order (Numeric)</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              placeholder="2005"
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs text-warm-400 mb-1">Historical Narrative Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Institutional background and context..."
            className="w-full px-3 py-2 border rounded-[2px] font-sans text-xs"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-ieee-blue text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px]"
        >
          <span>Add Milestone</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* List */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg text-ink font-normal">History Timeline Records ({milestones.length})</h3>

        {loading ? (
          <p className="font-mono text-xs text-warm-300">Loading milestones...</p>
        ) : (
          <div className="border border-warm-200 overflow-x-auto rounded-[2px]">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-warm-100/60 font-mono text-[10px] uppercase text-warm-400 border-b border-warm-200">
                <tr>
                  <th className="p-3">Year</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-200">
                {milestones.map((item: any) => (
                  <tr key={item.id} className="hover:bg-warm-100/30">
                    <td className="p-3 font-mono font-bold text-ieee-blue">{item.year}</td>
                    <td className="p-3 font-medium text-ink">{item.title}</td>
                    <td className="p-3 font-mono text-xs text-warm-400">{item.category}</td>
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
