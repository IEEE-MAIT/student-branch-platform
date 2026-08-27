/**
 * @file src/app/publications/page.tsx
 * @description Publications & Media Engine Landing Page (Server Component).
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
import { PublicationsFilter } from '@/components/content/PublicationsFilter';
import { getDynamicPublications } from '@/lib/api';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publications & Media Engine | IEEE MAIT Student Branch',
  description:
    'Technical articles, Tech Tuesday digests, annual newsletters, research guides, and event dossiers published by IEEE MAIT.',
};

export const revalidate = 60; // ISR Cache for 60 seconds

export default async function PublicationsPage() {
  const publications = await getDynamicPublications();

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Publications' },
            ]}
          />

          <SectionHeading
            category="Media & Editorial Engine"
            title="Publications & Technical Writings"
            subtitle="Tech Tuesday series, annual branch gazettes, student roadmaps, and technical dossiers published by IEEE MAIT."
          />

          {/* Interactive Client Component for Filtering */}
          <PublicationsFilter initialPublications={publications} />
        </Container>
      </main>

      <Footer />
    </>
  );
}
