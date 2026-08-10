'use client';

import React, { useState, useEffect } from 'react';

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Newsletter');
  const [publishedDate, setPublishedDate] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const loadResources = () => {
    fetch('/api/admin/resources')
      .then((res) => res.json())
      .then((data: any) => {
        if (Array.isArray(data)) setResources(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          type,
          publishedDate,
          description,
          fileUrl,
        }),
      });
      const data: any = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Resource '${title}' published!` });
        setTitle('');
        setFileUrl('');
        setDescription('');
        loadResources();
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to publish resource.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error publishing resource.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource record?')) return;
    try {
      const res = await fetch(`/api/admin/resources?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg({ type: 'success', text: 'Resource record deleted.' });
        loadResources();
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
        <h2 className="font-serif text-2xl text-ink font-normal mb-1">Manage Public Resources & Documents</h2>
        <p className="font-sans text-xs text-warm-400">
          Upload and manage branch newsletters, annual reports, and constitution documents.
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
          Publish New Document / Newsletter
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Resource Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="IEEE MAIT Newsletter Vol 3, Issue 2"
              className="w-full px-3 py-2 border rounded-[2px]"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Document Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border rounded-[2px]"
            >
              <option value="Newsletter">Newsletter</option>
              <option value="AnnualReport">Annual Report</option>
              <option value="Document">Document / Constitution</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">Published Date</label>
            <input
              type="text"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              placeholder="JUL 2026"
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-warm-400 mb-1">PDF File / Document Download URL</label>
            <input
              type="text"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://ieee-mait.org/files/newsletter.pdf"
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs text-warm-400 mb-1">Short Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of contents or target audience..."
            className="w-full px-3 py-2 border rounded-[2px] font-sans text-xs"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-ieee-blue text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px]"
        >
          Publish Resource →
        </button>
      </form>

      {/* List */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg text-ink font-normal font-sans">Published Resources ({resources.length})</h3>

        {loading ? (
          <p className="font-mono text-xs text-warm-300">Loading resources...</p>
        ) : (
          <div className="border border-warm-200 overflow-x-auto rounded-[2px]">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-warm-100/60 font-mono text-[10px] uppercase text-warm-400 border-b border-warm-200">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Published Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-200">
                {resources.map((item: any) => (
                  <tr key={item.id} className="hover:bg-warm-100/30">
                    <td className="p-3 font-medium text-ink">{item.title}</td>
                    <td className="p-3 font-mono text-xs text-ieee-blue">{item.type}</td>
                    <td className="p-3 font-mono text-[11px] text-warm-400">{item.publishedDate || '—'}</td>
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
