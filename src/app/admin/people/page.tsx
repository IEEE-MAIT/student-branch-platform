'use client';

import React, { useState, useEffect } from 'react';

export default function AdminPeoplePage() {
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('Chairperson');
  const [category, setCategory] = useState('Senior Executive Committee');
  const [chapterId, setChapterId] = useState('');
  const [chapters, setChapters] = useState<any[]>([]);
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [department, setDepartment] = useState('CSE');

  const default20Years = Array.from({ length: 21 }, (_, i) => {
    const start = 2025 - i;
    const end = (start + 1).toString().slice(-2);
    return {
      label: `${start}–${end}`,
      slug: `${start}-${end}`,
      isCurrent: i === 0,
    };
  });
  const [filterSession, setFilterSession] = useState('All');
  const [imageUrl, setImageUrl] = useState('');
  const [bio, setBio] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadPeople = () => {
    fetch('/api/people')
      .then((res) => res.json())
      .then((data: any) => {
        if (Array.isArray(data)) setPeople(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPeople();
    fetch('/api/admin/chapters')
      .then((res) => res.json())
      .then((data: any) => {
        if (Array.isArray(data)) setChapters(data);
      });
    fetch('/api/admin/academic-years')
      .then((res) => res.json())
      .then((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          setAcademicYears(data);
          const active = data.find((y: any) => y.isCurrent);
          if (active) setAcademicYear(active.label);
          else setAcademicYear(data[0].label);
        }
      });
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    setMsg(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/assets/upload', {
        method: 'POST',
        body: formData,
      });
      const json: any = await res.json();
      if (json.success) {
        setImageUrl(json.data.secure_url);
        setMsg({ type: 'success', text: 'Image uploaded to Cloudinary successfully!' });
      } else {
        setMsg({ type: 'error', text: json.error || 'Failed to upload image.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Error uploading image.' });
    }
    setUploadingImage(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setRole('Chairperson');
    setCategory('Senior Executive Committee');
    setDepartment('CSE');
    setAcademicYear('2025-26');
    setChapterId('');
    setImageUrl('');
    setBio('');
    setLinkedin('');
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setName(p.name || '');
    setRole(p.role || '');
    setCategory(p.category || 'Senior Executive Committee');
    setDepartment(p.department || 'CSE');
    setAcademicYear(p.academicYear || '2025-26');
    setImageUrl(p.imageUrl || '');
    setBio(p.bio || '');
    setLinkedin(p.linkedIn || p.linkedin || '');
    const chapMembership = p.memberships?.find((m: any) => m.chapterId);
    if (chapMembership) {
      setChapterId(chapMembership.chapterId);
    } else {
      setChapterId('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const secRoles = ['Chairperson', 'Vice-Chairperson', 'General Secretary', 'Web Master', 'Treasurer', 'Joint Secretary', 'PR Head', 'Creative Head', 'Sponsorship Head', 'Hardware Head'];
      const opRoles = ['Technical Lead', 'Creative Lead', 'PR Lead', 'Event Management Lead'];
      
      let computedHierarchy = 10;
      if (secRoles.includes(role)) {
        computedHierarchy = secRoles.indexOf(role) + 1;
      } else if (opRoles.includes(role)) {
        computedHierarchy = opRoles.indexOf(role) + 10;
      }

      const isEditing = !!editingId;
      const url = '/api/admin/people';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId || undefined,
          name,
          role,
          category,
          department,
          hierarchy: computedHierarchy,
          imageUrl,
          bio,
          quote: bio,
          linkedin,
          academicYear,
          chapterId: (category === 'EDS Chapter' || category === 'Affinity Group') ? chapterId : undefined,
        }),
      });
      const data: any = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Team member ${name} ${isEditing ? 'updated' : 'added'} successfully!` });
        cancelEdit();
        loadPeople();
      } else {
        setMsg({ type: 'error', text: data.error || `Failed to ${isEditing ? 'update' : 'add'} person.` });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error saving person.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this person from the active roster? (This also deletes their Cloudinary photo asset)')) return;
    try {
      const res = await fetch(`/api/admin/people?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg({ type: 'success', text: 'Roster record and associated photo asset removed.' });
        if (editingId === id) {
          cancelEdit();
        }
        loadPeople();
      } else {
        const data: any = await res.json();
        setMsg({ type: 'error', text: data.error || 'Delete failed.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error.' });
    }
  };

  const filteredPeople = people.filter((p: any) => {
    if (filterSession === 'All') return true;
    const pYear = (p.academicYear || '2025-26').replace('–', '-');
    const normalizedFilter = filterSession.replace('–', '-');
    return pYear === normalizedFilter;
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-ink font-normal mb-1">Manage Leadership & People Roster</h2>
        <p className="font-sans text-xs text-warm-400">
          Add, edit, or remove Branch Counsellors, Mentors, SEC Officers, and Operational Leads.
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
      <form onSubmit={handleSubmit} className="p-6 border border-warm-200 bg-warm-100/20 rounded-[2px] space-y-4 font-sans text-xs">
        <div className="flex items-center justify-between border-b border-warm-200 pb-2">
          <h3 className="font-serif text-lg text-ink font-normal">
            {editingId ? `Edit Team Member` : 'Add Team Member'}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="font-mono text-xs text-warm-500 hover:text-ink underline"
            >
              Cancel Edit
            </button>
          )}
        </div>

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
            <label className="block font-mono text-xs text-warm-400 mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => {
                const newCat = e.target.value;
                setCategory(newCat);
                if (newCat === 'Senior Executive Committee' || newCat === 'EDS Chapter' || newCat === 'Affinity Group') {
                  setRole('Chairperson');
                } else if (newCat === 'Operational Leads') {
                  setRole('Technical Lead');
                } else {
                  setRole('');
                }
              }}
              className="w-full px-3 py-2 border rounded-[2px]"
            >
              <option value="Senior Executive Committee">Senior Executive Committee (SEC)</option>
              <option value="EDS Chapter">EDS Chapter</option>
              <option value="Affinity Group">Affinity Group</option>
              <option value="Operational Leads">Operational Leads</option>
              <option value="Counsellor / Mentor">Counsellor / Mentor</option>
            </select>
          </div>

          {(category === 'EDS Chapter' || category === 'Affinity Group') && (
            <div>
              <label className="block font-mono text-xs text-warm-400 mb-1">Select Chapter *</label>
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="w-full px-3 py-2 border rounded-[2px]"
                required
              >
                <option value="">-- Choose Chapter --</option>
                {chapters.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Role / Designation *</label>
            {(category === 'Senior Executive Committee' || category === 'EDS Chapter' || category === 'Affinity Group') ? (
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-[2px]"
              >
                <option value="Chairperson">Chairperson</option>
                <option value="Vice-Chairperson">Vice-Chairperson</option>
                <option value="General Secretary">General Secretary</option>
                <option value="Web Master">Web Master</option>
                <option value="Treasurer">Treasurer</option>
                <option value="Joint Secretary">Joint Secretary</option>
                <option value="PR Head">PR Head</option>
                <option value="Creative Head">Creative Head</option>
                <option value="Sponsorship Head">Sponsorship Head</option>
                <option value="Hardware Head">Hardware Head</option>
              </select>
            ) : category === 'Operational Leads' ? (
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-[2px]"
              >
                <option value="Technical Lead">Technical Lead</option>
                <option value="Creative Lead">Creative Lead</option>
                <option value="PR Lead">PR Lead</option>
                <option value="Event Management Lead">Event Management Lead</option>
              </select>
            ) : (
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Custom Role (e.g. Branch Counselor)"
                className="w-full px-3 py-2 border rounded-[2px]"
                required
              />
            )}
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Academic Year / Session *</label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3 py-2 border rounded-[2px]"
              required
            >
              {academicYears.length > 0
                ? academicYears.map((y) => (
                    <option key={y.id} value={y.label}>
                      {y.label} {y.isCurrent ? '(Current)' : ''}
                    </option>
                  ))
                : default20Years.map((y) => (
                    <option key={y.slug} value={y.label}>
                      {y.label} {y.isCurrent ? '(Current)' : ''}
                    </option>
                  ))}
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Department / Branch</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. CSE, IT, ECE, or Department of ECE"
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">LinkedIn Profile URL</label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-mono text-xs text-warm-400 mb-1">Photo Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/..."
                className="flex-1 px-3 py-2 border rounded-[2px]"
              />
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  title="Upload Image"
                />
                <button 
                  type="button" 
                  disabled={uploadingImage}
                  className="px-4 py-2 bg-warm-200 text-ink text-xs font-mono font-medium rounded-[2px] disabled:opacity-50 whitespace-nowrap h-full"
                >
                  {uploadingImage ? 'Uploading...' : 'Upload File'}
                </button>
              </div>
            </div>
            {imageUrl && (
              <div className="mt-2 flex items-center gap-3">
                <img src={imageUrl} alt="Preview" className="h-16 w-16 object-cover rounded-[2px] border border-warm-200" />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="font-mono text-[11px] text-red-600 hover:underline"
                >
                  Remove Photo
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs text-warm-400 mb-1">Quote / Short Biography</label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Faculty counsellor or student executive background, quote, or bio..."
            className="w-full px-3 py-2 border rounded-[2px] font-sans text-xs"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-ieee-blue text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] hover:bg-ieee-dark transition-colors"
          >
            {editingId ? 'Update Team Member →' : 'Save to Roster →'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2.5 border border-warm-300 text-ink font-mono text-xs rounded-[2px] hover:bg-warm-100 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Roster Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-200 pb-3">
          <div>
            <h3 className="font-serif text-lg text-ink font-normal">
              Leadership Roster ({filteredPeople.length})
            </h3>
            <p className="font-mono text-xs text-warm-400">
              Viewing {filterSession === 'All' ? 'all sessions' : `session ${filterSession.replace('-', '–')}`} records
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-mono text-xs text-warm-400">Filter Session:</label>
            <select
              value={filterSession}
              onChange={(e) => setFilterSession(e.target.value)}
              className="px-3 py-1.5 border border-warm-200 rounded-[2px] font-mono text-xs bg-white text-ink"
            >
              <option value="All">All Sessions</option>
              {default20Years.map((y) => (
                <option key={y.slug} value={y.slug}>
                  {y.label} {y.isCurrent ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

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
                  <th className="p-3">Session</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-200">
                {filteredPeople.map((p: any) => (
                  <tr key={p.id} className={`hover:bg-warm-100/30 transition-colors ${editingId === p.id ? 'bg-ieee-blue/5 font-medium' : ''}`}>
                    <td className="p-3 font-mono text-xs font-bold text-warm-400">{p.hierarchy}</td>
                    <td className="p-3 font-medium text-ink">{p.name}</td>
                    <td className="p-3 font-mono text-xs text-ieee-blue">{p.role}</td>
                    <td className="p-3 font-mono text-[11px] text-warm-400">{p.category}</td>
                    <td className="p-3 font-mono text-[11px] text-warm-400">{p.academicYear || '2025-26'}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(p)}
                          className="font-mono text-xs text-ieee-blue hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="font-mono text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPeople.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center font-mono text-xs text-warm-400">
                      No team members found for session {filterSession.replace('-', '–')}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
