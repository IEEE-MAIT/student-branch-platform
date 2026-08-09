'use client';

import React, { useState, useEffect } from 'react';

export default function AdminPeoplePage() {
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState('SEC');
  const [department, setDepartment] = useState('CSE');
  const [hierarchy, setHierarchy] = useState(10);
  const [imageUrl, setImageUrl] = useState('');
  const [bio, setBio] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const loadPeople = () => {
    fetch('/api/people')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPeople(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPeople();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch('/api/admin/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          role,
          category,
          department,
          hierarchy: Number(hierarchy),
          imageUrl,
          bio,
          linkedin,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Team member ${name} added successfully!` });
        setName('');
        setRole('');
        setImageUrl('');
        setBio('');
        setLinkedin('');
        loadPeople();
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to add person.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error adding person.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this person from the active roster?')) return;
    try {
      const res = await fetch(`/api/admin/people?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg({ type: 'success', text: 'Roster record removed.' });
        loadPeople();
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
        <h2 className="font-serif text-2xl text-ink font-normal mb-1">Manage Leadership & People Roster</h2>
        <p className="font-sans text-xs text-warm-400">
          Add or update Branch Counsellors, Mentors, SEC Officers, and Operational Leads.
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
          Add Team Member
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aarav Sharma"
              className="w-full px-3 py-2 border rounded-[2px]"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Role / Designation *</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Chairperson / Webmaster"
              className="w-full px-3 py-2 border rounded-[2px]"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-[2px]"
            >
              <option value="Counsellor">Counsellor / Mentor</option>
              <option value="SEC">Senior Executive Committee (SEC)</option>
              <option value="Web">Web / Technical Lead</option>
              <option value="Operational">Operational Lead</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Department & Year</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="CSE · 4th Year / ECE Department"
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Hierarchy Order (1 = Top)</label>
            <input
              type="number"
              value={hierarchy}
              onChange={(e) => setHierarchy(Number(e.target.value))}
              placeholder="10"
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">LinkedIn Profile URL</label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-mono text-xs text-warm-400 mb-1">Photo Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs text-warm-400 mb-1">Short Biography</label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Faculty counsellor or student executive background..."
            className="w-full px-3 py-2 border rounded-[2px] font-sans text-xs"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-ieee-blue text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px]"
        >
          Save to Roster →
        </button>
      </form>

      {/* Roster Table */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg text-ink font-normal">Active Leadership Roster ({people.length})</h3>

        {loading ? (
          <p className="font-mono text-xs text-warm-300">Loading roster...</p>
        ) : (
          <div className="border border-warm-200 overflow-x-auto rounded-[2px]">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-warm-100/60 font-mono text-[10px] uppercase text-warm-400 border-b border-warm-200">
                <tr>
                  <th className="p-3">Order</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-200">
                {people.map((p) => (
                  <tr key={p.id} className="hover:bg-warm-100/30">
                    <td className="p-3 font-mono text-xs font-bold text-warm-400">{p.hierarchy}</td>
                    <td className="p-3 font-medium text-ink">{p.name}</td>
                    <td className="p-3 font-mono text-xs text-ieee-blue">{p.role}</td>
                    <td className="p-3 font-mono text-[11px] text-warm-400">{p.category}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="font-mono text-xs text-red-600 hover:underline"
                      >
                        Remove
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
