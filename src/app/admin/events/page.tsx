'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiArrowRight } from 'react-icons/fi';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [date, setDate] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [venue, setVenue] = useState('');
  const [unit, setUnit] = useState('IEEE MAIT SB');
  const [category, setCategory] = useState('Workshop');
  const [status, setStatus] = useState('upcoming');
  const [description, setDescription] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

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
        setImageSrc(json.data.secure_url);
        setMsg({ type: 'success', text: 'Image uploaded to Cloudinary successfully!' });
      } else {
        setMsg({ type: 'error', text: json.error || 'Failed to upload image.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Error uploading image.' });
    }
    setUploadingImage(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    
    // Check max limit
    if (images.length + files.length > 15) {
      setMsg({ type: 'error', text: 'Maximum 15 photos allowed per event.' });
      return;
    }

    setUploadingImage(true);
    setMsg(null);
    
    const newImages = [...images];
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/admin/assets/upload', {
          method: 'POST',
          body: formData,
        });
        const json: any = await res.json();
        if (json.success) {
          newImages.push(json.data.secure_url);
        }
      } catch (err) {
        console.error('Gallery upload error:', err);
      }
    }
    
    setImages(newImages);
    setUploadingImage(false);
  };

  const removeGalleryImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const isEditing = !!editingId;
      const url = '/api/admin/events';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          title,
          slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          date,
          time: (timeFrom && timeTo) ? `${timeFrom} - ${timeTo}` : (timeFrom || timeTo || ''),
          venue,
          unit,
          category,
          status,
          description,
          imageSrc,
          images,
        }),
      });
      const data: any = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Event ${isEditing ? 'updated' : 'created'} successfully!` });
        cancelEdit();
        loadEvents();
      } else {
        setMsg({ type: 'error', text: data.error || `Failed to ${isEditing ? 'update' : 'create'} event.` });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error saving event.' });
    }
  };

  const handleEdit = (evt: any) => {
    setEditingId(evt.id);
    setTitle(evt.title || '');
    setSlug(evt.slug || '');
    setDate(evt.date || '');
    
    // Parse time string if it exists (format: "HH:MM - HH:MM")
    if (evt.time) {
      const parts = evt.time.split(' - ');
      setTimeFrom(parts[0] || '');
      setTimeTo(parts[1] || '');
    } else {
      setTimeFrom('');
      setTimeTo('');
    }

    setVenue(evt.venue || '');
    setUnit(evt.unit || 'IEEE MAIT SB');
    setCategory(evt.category || 'Workshop');
    setStatus(evt.status || 'upcoming');
    setDescription(evt.description || '');
    setImageSrc(evt.imageSrc || '');
    setImages(evt.images || []);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setDate('');
    setTimeFrom('');
    setTimeTo('');
    setVenue('');
    setUnit('IEEE MAIT SB');
    setCategory('Workshop');
    setStatus('upcoming');
    setDescription('');
    setImageSrc('');
    setImages([]);
    setMsg(null);
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 border border-warm-200 bg-warm-100/20 rounded-[2px] space-y-4">
        <div className="flex justify-between items-center border-b border-warm-200 pb-2">
          <h3 className="font-serif text-lg text-ink font-normal">
            {editingId ? 'Edit Event' : 'Create New Event'}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs font-mono text-warm-400 hover:text-ink underline"
            >
              Cancel Edit
            </button>
          )}
        </div>

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
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-[2px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-mono text-xs text-warm-400 mb-1">Start Time</label>
              <input
                type="time"
                value={timeFrom}
                onChange={(e) => setTimeFrom(e.target.value)}
                className="w-full px-3 py-2 border rounded-[2px]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-warm-400 mb-1">End Time</label>
              <input
                type="time"
                value={timeTo}
                onChange={(e) => setTimeTo(e.target.value)}
                className="w-full px-3 py-2 border rounded-[2px]"
              />
            </div>
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
              <option value="Competition">Competition</option>
              <option value="Tech Talk">Tech Talk</option>
              <option value="Conference">Conference</option>
              <option value="Networking">Networking</option>
              <option value="Training">Training</option>
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

          <div className="sm:col-span-2">
            <label className="block font-mono text-xs text-warm-400 mb-1">Event Image URL (Cover Photo)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageSrc}
                onChange={(e) => setImageSrc(e.target.value)}
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
            {imageSrc && (
              <div className="mt-2">
                <img src={imageSrc} alt="Preview" className="h-24 w-auto object-cover rounded-[2px] border border-warm-200" />
              </div>
            )}
          </div>
          
          <div className="sm:col-span-2 pt-2 border-t border-warm-200">
            <label className="block font-mono text-xs text-warm-400 mb-1">Event Gallery Photos (Max 15)</label>
            <div className="relative inline-block mb-3">
              <input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleGalleryUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                title="Upload Gallery Photos"
                disabled={uploadingImage || images.length >= 15}
              />
              <button 
                type="button" 
                disabled={uploadingImage || images.length >= 15}
                className="px-4 py-2 bg-ieee-blue text-white text-xs font-mono font-medium rounded-[2px] disabled:opacity-50 whitespace-nowrap"
              >
                {uploadingImage ? 'Uploading Photos...' : `Select Photos (${images.length}/15)`}
              </button>
            </div>
            
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {images.map((imgUrl, idx) => (
                  <div key={idx} className="relative group">
                    <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full aspect-square object-cover rounded-[2px] border border-warm-200" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 bg-red-600/90 text-white p-1 rounded-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      title="Remove Photo"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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

        <div className="flex gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-ieee-blue text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px]"
          >
            <span>{editingId ? 'Update Event Record' : 'Publish Event Record'}</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-6 py-2.5 border border-warm-200 text-ink font-mono text-xs font-medium rounded-[2px] hover:bg-warm-100"
            >
              Cancel
            </button>
          )}
        </div>
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
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEdit(evt);
                          }}
                          className="font-mono text-xs text-ieee-blue hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(evt.id);
                          }}
                          className="font-mono text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
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
