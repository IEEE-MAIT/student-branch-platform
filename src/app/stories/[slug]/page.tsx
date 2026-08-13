/**
 * @file src/app/stories/[slug]/page.tsx
 * @description Individual story article page fetching dynamically from DB.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { getDynamicStoryBySlug, getDynamicStories } from '@/lib/api';
import Link from '@/components/ui/AppLink';

export async function generateStaticParams() {
  const stories = await getDynamicStories();
  return stories.map((story: any) => ({
    slug: story.slug,
  }));
}

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR Cache

/**
 * Server-side HTML sanitizer.
 * Strips <script>, <style>, <iframe>, <object>, <embed> tags and all
 * on* event handler attributes (onclick, onerror, etc.) to prevent XSS.
 * This runs server-side in the RSC before rendering — no client library needed.
 */
function sanitizeHtml(html: string): string {
  return html
    // Remove dangerous tags entirely (including content inside script/style)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<object\b[^>]*>.*?<\/object>/gi, '')
    .replace(/<embed\b[^>]*/gi, '')
    // Strip on* event handler attributes from any remaining tags
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
    // Strip javascript: hrefs
    .replace(/href\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, '');
}

export async function generateMetadata({ params }: StoryPageProps) {
  const resolvedParams = await params;
  const story = await getDynamicStoryBySlug(resolvedParams.slug);
  if (!story) return { title: 'Story Not Found — IEEE MAIT' };

  return {
    title: `${story.title} | IEEE MAIT Stories`,
    description: story.excerpt,
  };
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const resolvedParams = await params;
  const story = await getDynamicStoryBySlug(resolvedParams.slug);

  if (!story) {
    notFound();
  }

  const rawHtml = story.contentHtml || (Array.isArray(story.content) ? story.content.map((p: string) => `<p>${p}</p>`).join('') : (typeof story.content === 'string' ? story.content : ''));
  const safeHtml = sanitizeHtml(rawHtml);

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white page-enter">
        <Container size="narrow">
          <Link
            href="/stories"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-warm-400 hover:text-ieee-blue mb-8 transition-colors"
          >
            <span>← Back to Stories & Reports</span>
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <Badge variant="ieee">{story.category}</Badge>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal leading-tight mb-4">
            {story.title}
          </h1>

          <div className="flex items-center justify-between border-y border-warm-200 py-3 mb-8 text-xs font-mono text-warm-400">
            <div>
              By <span className="text-ink font-semibold">{story.author}</span>
            </div>
            <div>
              {story.date}
            </div>
          </div>

          {/* Article Body Content — sanitized before render */}
          <div
            className="space-y-6 text-base text-ink-muted leading-relaxed font-sans prose prose-headings:font-serif prose-a:text-ieee-blue"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />

          {/* Back Footer */}
          <div className="mt-12 pt-8 border-t border-warm-200 flex justify-between items-center">
            <Link
              href="/stories"
              className="text-xs font-mono text-ieee-blue hover:underline font-semibold"
            >
              ← Back to All Stories
            </Link>
            <span className="font-mono text-xs text-warm-300">
              IEEE MAIT Editorial
            </span>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
