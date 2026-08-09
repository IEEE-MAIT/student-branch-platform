/**
 * @file src/app/stories/page.tsx
 * @description Stories & Reports (Server Component) fetching dynamic records from Prisma DB.
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
import { getDynamicStories } from '@/lib/api';
import Link from 'next/link';

export const metadata = {
  title: 'Stories & Reports | IEEE MAIT Student Branch',
  description: 'Technical articles, event post-mortems, and student writing published by IEEE MAIT.',
};

export const revalidate = 60; // ISR Cache

export default async function StoriesPage() {
  const stories = await getDynamicStories();

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Stories & Reports' },
            ]}
          />

          <SectionHeading
            category="Publications & Writings"
            title="Stories & Technical Reports"
            subtitle="Articles, event post-mortems, technical reflections, and student writing."
          />

          <div className="space-y-6 pt-4">
            {stories.length > 0 ? (
              stories.map(story => (
                <div key={story.id} className="p-6 border border-warm-200 bg-white rounded-[2px] space-y-3 hover:border-ieee-blue transition-colors">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-ieee-blue">
                    <span>{story.date}</span>
                    <span>·</span>
                    <span>By {story.author}</span>
                    <span className="bg-ieee-subtle border border-ieee-blue/20 px-2 py-0.5 rounded-[2px] uppercase text-[10px]">
                      {story.category}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-ink font-normal">
                    <Link href={`/stories/${story.slug}`} className="hover:text-ieee-blue transition-colors">
                      {story.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-warm-400 leading-relaxed font-sans">
                    {story.excerpt}
                  </p>
                  <Link
                    href={`/stories/${story.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-ieee-blue hover:underline pt-2"
                  >
                    <span>Read Full Article</span>
                    <span>→</span>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm font-mono text-warm-400 p-8 border border-warm-200 bg-warm-50 text-center">No stories published yet.</p>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
