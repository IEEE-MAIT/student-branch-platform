'use client';

import React, { useState, useEffect } from 'react';

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [year, setYear] = useState('2026');
  const [title, setTitle] = useState('');
  const [conferredBy, setConferredBy] = useState('IEEE Delhi Section');
  const [unitOrTeam, setUnitOrTeam] = useState('IEEE MAIT SB');
  const [category, setCategory] = useState('Branch Honor');
  const [description, setDescription] = useState('');

  const loadAchievements = () => {
    fetch('/api/achievements')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAchievements(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch('/api/admin/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, title, conferredBy, unitOrTeam, category, description }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: 'Achievement recorded successfully!' });
        setTitle('');
        setDescription('');
        loadAchievements();
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to record achievement.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error creating achievement.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement record?')) return;
    try {
      const res = await fetch(`/api/admin/achievements?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg({ type: 'success', text: 'Achievement deleted.' });
        loadAchievements();
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
        <h2 className="font-serif text-2xl text-ink font-normal mb-1">Manage Achievements Ledger</h2>
        <p className="font-sans text-xs text-warm-400">
          Record branch awards, section recognitions, and national hackathon victories.
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
          Record New Achievement
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Exemplary Student Branch Award 2026"
              className="w-full px-3 py-2 border rounded-[2px]"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Year *</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2026"
              className="w-full px-3 py-2 border rounded-[2px]"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Conferred By</label>
            <input
              type="text"
              value={conferredBy}
              onChange={(e) => setConferredBy(e.target.value)}
              placeholder="IEEE Delhi Section / IEEE Region 10"
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Recipient Unit / Team</label>
            <input
              type="text"
              value={unitOrTeam}
              onChange={(e) => setUnitOrTeam(e.target.value)}
              placeholder="IEEE MAIT Student Branch / Team Robocon"
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
              <option value="Branch Honor">Branch Honor</option>
              <option value="Hackathon Victory">Hackathon Victory</option>
              <option value="Individual Award">Individual Award</option>
              <option value="Chapter Honor">Chapter Honor</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs text-warm-400 mb-1">Details / Citation</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Official citation or summary of the competition victory..."
            className="w-full px-3 py-2 border rounded-[2px] font-sans text-xs"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-ieee-blue text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px]"
        >
          Add to Ledger →
        </button>
      </form>

      {/* List */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg text-ink font-normal">Achievements Ledger ({achievements.length})</h3>

        {loading ? (
          <p className="font-mono text-xs text-warm-300">Loading records...</p>
        ) : (
          <div className="border border-warm-200 overflow-x-auto rounded-[2px]">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-warm-100/60 font-mono text-[10px] uppercase text-warm-400 border-b border-warm-200">
                <tr>
                  <th className="p-3">Year</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Conferred By</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-200">
                {achievements.map((item) => (
                  <tr key={item.id} className="hover:bg-warm-100/30">
                    <td className="p-3 font-mono text-ieee-blue font-bold">{item.year}</td>
                    <td className="p-3 font-medium text-ink">{item.title}</td>
                    <td className="p-3 text-warm-400">{item.conferredBy || '—'}</td>
                    <td className="p-3 font-mono text-[11px] text-warm-400">{item.unitOrTeam || '—'}</td>
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
