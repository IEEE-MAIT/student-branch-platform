'use client';

/**
 * @file src/app/admin/page.tsx
 * @description Admin Dashboard Overview / Command Center landing page.
 *
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useEffect, useState } from 'react';
import Link from '@/components/ui/AppLink';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    events: 0,
    achievements: 0,
    people: 0,
    stories: 0,
    resources: 0,
    milestones: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/events').then((r) => r.json()).catch(() => []),
      fetch('/api/achievements').then((r) => r.json()).catch(() => []),
      fetch('/api/people').then((r) => r.json()).catch(() => []),
      fetch('/api/stories').then((r) => r.json()).catch(() => []),
      fetch('/api/admin/resources').then((r) => r.json()).catch(() => []),
      fetch('/api/admin/milestones').then((r) => r.json()).catch(() => []),
    ]).then(([events, achievements, people, stories, resources, milestones]) => {
      setStats({
        events: Array.isArray(events) ? events.length : 0,
        achievements: Array.isArray(achievements) ? achievements.length : 0,
        people: Array.isArray(people) ? people.length : 0,
        stories: Array.isArray(stories) ? stories.length : 0,
        resources: Array.isArray(resources) ? resources.length : 0,
        milestones: Array.isArray(milestones) ? milestones.length : 0,
      });
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-ink font-normal mb-1">Command Center Overview</h2>
        <p className="font-sans text-xs text-warm-400">
          Real-time record totals from the Neon PostgreSQL database. Select a CMS module from the left menu to manage content.
        </p>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Events Registered', count: stats.events, href: '/admin/events' },
          { label: 'Achievements Ledger', count: stats.achievements, href: '/admin/achievements' },
          { label: 'Roster Members', count: stats.people, href: '/admin/people' },
          { label: 'Stories & Articles', count: stats.stories, href: '/admin/stories' },
          { label: 'Public Resources', count: stats.resources, href: '/admin/resources' },
          { label: 'Milestone Records', count: stats.milestones, href: '/admin/milestones' },
        ].map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="p-5 border border-warm-200 bg-white rounded-[2px] hover:border-ieee-blue transition-colors group space-y-2 block"
          >
            <span className="font-mono text-3xl font-bold text-ieee-blue block">
              {item.count}
            </span>
            <span className="font-mono text-xs text-warm-400 group-hover:text-ink transition-colors block">
              {item.label} →
            </span>
          </Link>
        ))}
      </div>

      {/* Quick Security & Operations note */}
      <div className="border border-warm-200 p-5 bg-warm-100/30 rounded-[2px] space-y-2">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
          Operational Guidelines
        </h3>
        <ul className="list-disc list-inside font-sans text-xs text-warm-400 space-y-1">
          <li>All changes take effect immediately across the public website via ISR revalidation.</li>
          <li>All creation and deletion activities are tracked permanently in the <Link href="/admin/audit-logs" className="text-ieee-blue underline">Audit Logs</Link>.</li>
          <li>Permissions are strictly enforced based on your assigned executive role.</li>
        </ul>
      </div>
    </div>
  );
}
