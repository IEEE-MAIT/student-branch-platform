'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementLinkText, setAnnouncementLinkText] = useState('');
  const [announcementLinkHref, setAnnouncementLinkHref] = useState('');
  const [announcementActive, setAnnouncementActive] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data: any) => {
        if (!data.error) {
          setAnnouncementMessage(data.announcementMessage || '');
          setAnnouncementLinkText(data.announcementLinkText || '');
          setAnnouncementLinkHref(data.announcementLinkHref || '');
          setAnnouncementActive(data.announcementActive || false);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          announcementMessage,
          announcementLinkText,
          announcementLinkHref,
          announcementActive,
        }),
      });
      const data: any = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: 'Site settings updated successfully!' });
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to update settings.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error updating settings.' });
    }
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-ink font-normal mb-1">Site Settings & Banner</h2>
        <p className="font-sans text-xs text-warm-400">
          Manage global site configuration and the public announcement banner.
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

      {loading ? (
        <p className="font-mono text-xs text-warm-300">Loading settings...</p>
      ) : (
        <form onSubmit={handleSave} className="p-6 border border-warm-200 bg-warm-100/20 rounded-[2px] space-y-6 font-sans text-xs">
          <div className="flex items-center justify-between border-b border-warm-200 pb-3">
            <h3 className="font-serif text-lg text-ink font-normal">
              Top Announcement Banner
            </h3>
            <label className="flex items-center cursor-pointer gap-2">
              <span className={`font-mono text-[10px] uppercase font-bold tracking-wider ${announcementActive ? 'text-ieee-blue' : 'text-warm-400'}`}>
                {announcementActive ? 'Banner Active' : 'Banner Hidden'}
              </span>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={announcementActive}
                  onChange={(e) => setAnnouncementActive(e.target.checked)}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${announcementActive ? 'bg-ieee-blue' : 'bg-warm-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${announcementActive ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-warm-400 mb-1">Announcement Message *</label>
              <textarea
                rows={2}
                value={announcementMessage}
                onChange={(e) => setAnnouncementMessage(e.target.value)}
                placeholder="E.g., Membership Drive 2025–26 is officially open!"
                className="w-full px-3 py-2 border border-warm-200 rounded-[2px] focus:outline-none focus:border-ieee-blue font-sans text-xs"
                required={announcementActive}
              />
              <p className="text-[10px] text-warm-400 mt-1">This is the main text displayed on the top banner.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs text-warm-400 mb-1">Link Text</label>
                <input
                  type="text"
                  value={announcementLinkText}
                  onChange={(e) => setAnnouncementLinkText(e.target.value)}
                  placeholder="E.g., Register Now"
                  className="w-full px-3 py-2 border border-warm-200 rounded-[2px] focus:outline-none focus:border-ieee-blue"
                />
                <p className="text-[10px] text-warm-400 mt-1">Clickable text at the end of the message.</p>
              </div>

              <div>
                <label className="block font-mono text-xs text-warm-400 mb-1">Link URL</label>
                <input
                  type="text"
                  value={announcementLinkHref}
                  onChange={(e) => setAnnouncementLinkHref(e.target.value)}
                  placeholder="E.g., /join"
                  className="w-full px-3 py-2 border border-warm-200 rounded-[2px] focus:outline-none focus:border-ieee-blue"
                />
                <p className="text-[10px] text-warm-400 mt-1">Where the user is taken when they click.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-warm-200">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-ieee-blue text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] disabled:opacity-50"
            >
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              {!saving && <FiArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
