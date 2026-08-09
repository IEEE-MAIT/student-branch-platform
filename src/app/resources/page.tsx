/**
 * @file src/app/resources/page.tsx
 * @description Resources page — Newsletters, Annual Reports, and Documents.
 * Fetches from the resources DB table with static seed data fallback.
 *
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { getDynamicResources } from '@/lib/api';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Resources | IEEE MAIT Student Branch',
  description:
    'Download IEEE MAIT newsletters, annual reports, and official documents. Public resources from the IEEE MAIT Student Branch at Maharaja Agrasen Institute of Technology.',
};

// Static seed resources shown when DB is empty
const SEED_RESOURCES = [
  {
    id: 'r1',
    title: 'IEEE MAIT Newsletter — Volume 3, Issue 2',
    type: 'Newsletter',
    publishedDate: 'JUL 2026',
    description: 'Bi-annual branch newsletter covering events, achievements, and member spotlights.',
    fileUrl: null,
    status: 'published',
  },
  {
    id: 'r2',
    title: 'IEEE MAIT Newsletter — Volume 3, Issue 1',
    type: 'Newsletter',
    publishedDate: 'JAN 2026',
    description: 'First issue of 2026 covering the new academic year initiatives.',
    fileUrl: null,
    status: 'published',
  },
  {
    id: 'r3',
    title: 'Annual Report 2025–26',
    type: 'AnnualReport',
    publishedDate: 'MAY 2026',
    description: 'Full institutional report — events, membership statistics, financial summary, and achievements.',
    fileUrl: null,
    status: 'published',
  },
  {
    id: 'r4',
    title: 'Annual Report 2024–25',
    type: 'AnnualReport',
    publishedDate: 'MAY 2025',
    description: 'Institutional report covering the 2024–25 academic year.',
    fileUrl: null,
    status: 'published',
  },
  {
    id: 'r5',
    title: 'IEEE Student Membership Guide',
    type: 'Document',
    publishedDate: 'AUG 2025',
    description: 'Step-by-step guide to joining IEEE and selecting MAIT as your student branch.',
    fileUrl: null,
    status: 'published',
  },
  {
    id: 'r6',
    title: 'IEEE MAIT Branch Constitution',
    type: 'Document',
    publishedDate: 'JAN 2024',
    description: 'Governing document for the IEEE MAIT Student Branch operations and bylaws.',
    fileUrl: null,
    status: 'published',
  },
];

const TYPE_LABELS: Record<string, string> = {
  Newsletter: 'Newsletter',
  AnnualReport: 'Annual Report',
  Document: 'Document',
  Other: 'Other',
};

const RESOURCE_TYPES = ['Newsletter', 'AnnualReport', 'Document', 'Other'];

export default async function ResourcesPage() {
  const dbResources = await getDynamicResources();
  const resources = dbResources.length > 0 ? dbResources : SEED_RESOURCES;

  const grouped = RESOURCE_TYPES.reduce((acc, type) => {
    const items = resources.filter((r: any) => r.type === type);
    if (items.length > 0) acc[type] = items;
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Resources' },
            ]}
          />

          <SectionHeading
            category="Public Documents"
            title="Resources & Publications"
            subtitle="Newsletters, annual reports, and official documents from IEEE MAIT Student Branch."
          />

          <div className="pt-8 space-y-12 max-w-3xl">
            {Object.entries(grouped).map(([type, items]) => (
              <div key={type}>
                {/* Section header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-warm-200">
                  <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-warm-300">
                    {TYPE_LABELS[type] ?? type}s
                  </h2>
                  <span className="font-mono text-xs text-warm-200">──────────────────────</span>
                </div>

                {/* Resource rows — clean list format per spec */}
                <div className="space-y-0 divide-y divide-warm-200 border border-warm-200 rounded-[2px]">
                  {(items as any[]).map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-start justify-between gap-4 px-5 py-4 bg-white hover:bg-warm-100/40 transition-colors group"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-sans text-sm font-medium text-ink leading-snug">
                            {resource.title}
                          </h3>
                          <Badge variant="default">{TYPE_LABELS[resource.type] ?? resource.type}</Badge>
                        </div>
                        {resource.description && (
                          <p className="text-xs text-warm-400 font-sans leading-relaxed">
                            {resource.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-4 shrink-0 pt-0.5">
                        <span className="font-mono text-xs text-warm-300 whitespace-nowrap">
                          {resource.publishedDate}
                        </span>
                        {resource.fileUrl ? (
                          <a
                            href={resource.fileUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs font-semibold text-ieee-blue hover:underline flex items-center gap-1"
                            aria-label={`Download ${resource.title}`}
                          >
                            PDF ↓
                          </a>
                        ) : (
                          <span className="font-mono text-xs text-warm-200 cursor-not-allowed" title="File not yet uploaded">
                            PDF —
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {Object.keys(grouped).length === 0 && (
              <p className="font-mono text-sm text-warm-300 py-12 text-center border border-warm-200 rounded-[2px]">
                No resources published yet. Check back soon.
              </p>
            )}

            {/* Source note */}
            <div className="pt-4 border-t border-warm-200">
              <p className="font-mono text-xs text-warm-300">
                {dbResources.length > 0
                  ? `${resources.length} resources loaded from database.`
                  : 'Showing sample resources. Upload real files via the Admin panel.'}
              </p>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
