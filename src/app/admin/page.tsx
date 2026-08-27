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
    projects: 0,
    sigs: 0,
    opportunities: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/events').then((r) => r.json()).catch(() => []),
      fetch('/api/achievements').then((r) => r.json()).catch(() => []),
      fetch('/api/people').then((r) => r.json()).catch(() => []),
      fetch('/api/stories').then((r) => r.json()).catch(() => []),
      fetch('/api/admin/resources').then((r) => r.json()).catch(() => []),
      fetch('/api/admin/milestones').then((r) => r.json()).catch(() => []),
      fetch('/api/admin/projects').then((r) => r.json()).catch(() => []),
      fetch('/api/admin/sigs').then((r) => r.json()).catch(() => []),
      fetch('/api/admin/opportunities').then((r) => r.json()).catch(() => []),
    ]).then(([events, achievements, people, stories, resources, milestones, projects, sigs, opps]) => {
      setStats({
        events: Array.isArray(events) ? events.length : 0,
        achievements: Array.isArray(achievements) ? achievements.length : 0,
        people: Array.isArray(people) ? people.length : 0,
        stories: Array.isArray(stories) ? stories.length : 0,
        resources: Array.isArray(resources) ? resources.length : 0,
        milestones: Array.isArray(milestones) ? milestones.length : 0,
        projects: Array.isArray(projects) ? projects.length : 0,
        sigs: Array.isArray(sigs) ? sigs.length : 0,
        opportunities: Array.isArray(opps) ? opps.length : 0,
      });
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal mb-1">Command Center Overview</h2>
        <p className="font-sans text-xs text-warm-400 dark:text-gray-400">
          Real-time record totals from the Neon PostgreSQL database. Select a CMS module from the left menu to manage content.
        </p>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Events Registered', count: stats.events, href: '/admin/events' },
          { label: 'Technical Projects', count: stats.projects, href: '/admin/projects' },
          { label: 'Special Interest Groups', count: stats.sigs, href: '/admin/sigs' },
          { label: 'Opportunities & Grants', count: stats.opportunities, href: '/admin/opportunities' },
          { label: 'Achievements Ledger', count: stats.achievements, href: '/admin/achievements' },
          { label: 'Roster Members', count: stats.people, href: '/admin/people' },
          { label: 'Publications & Articles', count: stats.stories, href: '/admin/stories' },
          { label: 'Public Resources', count: stats.resources, href: '/admin/resources' },
          { label: 'Milestone Records', count: stats.milestones, href: '/admin/milestones' },
        ].map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="p-5 border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl hover:border-ieee-blue dark:hover:border-sky-500 hover:-translate-y-0.5 transition-all group space-y-2 block shadow-xs"
          >
            <span className="font-mono text-3xl font-bold text-ieee-blue dark:text-sky-400 block">
              {item.count}
            </span>
            <span className="font-mono text-xs text-warm-500 dark:text-gray-400 group-hover:text-ink dark:group-hover:text-white transition-colors block">
              {item.label} →
            </span>
          </Link>
        ))}
      </div>

      {/* Operational Guidelines */}
      <div className="border border-warm-200 dark:border-gray-800 p-5 bg-warm-50/50 dark:bg-gray-900/50 rounded-xl space-y-2">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink dark:text-gray-200">
          Operational Guidelines
        </h3>
        <ul className="list-disc list-inside font-sans text-xs text-warm-500 dark:text-gray-400 space-y-1">
          <li>All changes take effect immediately across the public website via dynamic caching and ISR revalidation.</li>
          <li>All creation, update, and deletion activities are tracked permanently in the <Link href="/admin/audit-logs" className="text-ieee-blue dark:text-sky-400 underline">Audit Logs</Link>.</li>
          <li>Permissions are strictly enforced based on your assigned executive committee role.</li>
        </ul>
      </div>
    </div>
  );
}
