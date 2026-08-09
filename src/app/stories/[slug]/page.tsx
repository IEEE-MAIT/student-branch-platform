import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { STORIES_DATA } from '@/lib/data';
import Link from 'next/link';

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StoryPageProps) {
  const resolvedParams = await params;
  const story = STORIES_DATA[resolvedParams.slug];
  if (!story) return { title: 'Story Not Found — IEEE MAIT' };

  return {
    title: `${story.title} | IEEE MAIT Stories`,
    description: story.excerpt,
  };
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const resolvedParams = await params;
  const story = STORIES_DATA[resolvedParams.slug];

  if (!story) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="narrow">
          <Link
            href="/stories"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-warm-400 hover:text-ieee-blue mb-8 transition-colors"
          >
            <span>← Back to Stories & Reports</span>
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <Badge variant="ieee">{story.type}</Badge>
            <Badge variant="neutral">{story.unit}</Badge>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal leading-tight mb-4">
            {story.title}
          </h1>

          <div className="flex items-center justify-between border-y border-warm-200 py-3 mb-8 text-xs font-mono text-warm-400">
            <div>
              By <span className="text-ink font-semibold">{story.author}</span> ({story.authorRole})
            </div>
            <div>
              {story.publishedDate} · {story.readingTime}
            </div>
          </div>

          {/* Article Body Content */}
          <div className="space-y-6 text-base text-ink-muted leading-relaxed font-sans">
            {story.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

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
