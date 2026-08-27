/**
 * @file src/app/publications/[slug]/page.tsx
 * @description Rich Publication & Technical Article Reader page.
 * 
 * FEATURES:
 * - Sanitized HTML / Markdown article rendering.
 * - Estimated read-time and category badges.
 * - Author profile banner with editorial designation.
 * - PDF Document embed & download CTA banner (if pdfUrl exists).
 * - External link reference banner (if externalLink exists).
 * - Social sharing actions (LinkedIn, X/Twitter, WhatsApp, Copy Link).
 * - Related publications recommendation strip.
 * - Dark mode theme compliance.
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
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getDynamicPublicationBySlug, getDynamicPublications } from '@/lib/api';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';
import { ShareWidget } from '@/components/content/ShareWidget';
import { FiExternalLink, FiArrowLeft } from 'react-icons/fi';

export async function generateStaticParams() {
  const publications = await getDynamicPublications();
  return publications.map((pub: any) => ({
    slug: pub.slug,
  }));
}

interface PublicationPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR Cache for 60 seconds

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<object\b[^>]*>.*?<\/object>/gi, '')
    .replace(/<embed\b[^>]*/gi, '')
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
    .replace(/href\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, '');
}

export async function generateMetadata({ params }: PublicationPageProps) {
  const resolvedParams = await params;
  const publication = await getDynamicPublicationBySlug(resolvedParams.slug);
  if (!publication) return { title: 'Publication Not Found — IEEE MAIT' };

  return {
    title: `${publication.title} | IEEE MAIT Publications`,
    description: publication.excerpt || `Technical article published by ${publication.author || 'IEEE MAIT'}.`,
    openGraph: {
      title: publication.title,
      description: publication.excerpt,
      type: 'article',
      siteName: 'IEEE MAIT Publications',
      ...(publication.coverImage && { images: [{ url: publication.coverImage }] }),
    },
  };
}

export default async function PublicationDetailPage({ params }: PublicationPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const publication = await getDynamicPublicationBySlug(slug);

  if (!publication) {
    notFound();
  }

  const rawHtml =
    publication.contentHtml ||
    (Array.isArray(publication.content)
      ? publication.content.map((p: string) => `<p>${p}</p>`).join('')
      : typeof publication.content === 'string'
      ? publication.content
      : `<p>${publication.excerpt || ''}</p>`);

  const safeHtml = sanitizeHtml(rawHtml);

  // Fetch related publications for recommendation strip
  const allPublications = await getDynamicPublications();
  const relatedPublications = allPublications
    .filter((p: any) => p.slug !== slug)
    .slice(0, 2);

  const shareUrl = `https://ieee-mait.org/publications/${slug}`;
  const shareTitle = encodeURIComponent(publication.title);

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
        <Container size="narrow">
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Publications', href: '/publications' },
              { label: publication.title },
            ]}
          />

          {/* Article Header & Badges */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="ieee">{publication.type || publication.category || 'Technical Article'}</Badge>
              {publication.unit && <Badge variant="neutral">{publication.unit}</Badge>}
              {publication.readingTime && (
                <span className="font-mono text-xs text-warm-400 dark:text-gray-400">
                  ⏱ {publication.readingTime}
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink dark:text-gray-100 font-normal leading-tight">
              {publication.title}
            </h1>

            {publication.excerpt && (
              <p className="text-lg text-warm-500 dark:text-gray-300 font-sans leading-relaxed pt-1">
                {publication.excerpt}
              </p>
            )}

            {/* Author Card & Publication Metadata Strip */}
            <div className="flex items-center justify-between border-y border-warm-200 dark:border-gray-800 py-4 my-6 flex-wrap gap-4 text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-ieee-subtle dark:bg-sky-950 border border-ieee-blue/30 dark:border-sky-800 flex items-center justify-center font-serif text-ieee-blue dark:text-sky-400 font-bold text-sm">
                  {publication.author ? publication.author.charAt(0) : 'I'}
                </div>
                <div>
                  <span className="font-bold text-ink dark:text-gray-200 block text-sm">
                    {publication.author}
                  </span>
                  {publication.authorRole && (
                    <span className="text-warm-400 dark:text-gray-400 font-sans text-xs">
                      {publication.authorRole}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-warm-400 dark:text-gray-400 text-right">
                <span className="block font-semibold text-ink dark:text-gray-300">
                  {publication.date || publication.publishedDate}
                </span>
                <span className="text-[10px] text-warm-400 dark:text-gray-500">
                  IEEE MAIT Editorial Desk
                </span>
              </div>
            </div>
          </div>

          {/* Hero Cover Image if present */}
          {(publication.coverImage || publication.imageUrl || publication.imageSrc) && (
            <div className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden border border-warm-200 dark:border-gray-800 mb-10 shadow-sm">
              <Image
                src={(publication.coverImage || publication.imageUrl || publication.imageSrc)!}
                alt={publication.title}
                fill
                sizes="(max-width: 1024px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* PDF Document Download Banner */}
          {publication.pdfUrl && (
            <div className="p-5 border border-ieee-blue/30 dark:border-sky-800 bg-ieee-subtle/50 dark:bg-sky-950/50 rounded-xl mb-8 flex items-center justify-between flex-wrap gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <h4 className="font-serif text-base text-ink dark:text-gray-100 font-medium">
                    Official PDF Publication Document
                  </h4>
                  <p className="text-xs text-warm-500 dark:text-gray-400 font-sans">
                    Read or download the complete formatted PDF version.
                  </p>
                </div>
              </div>
              <a
                href={publication.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-mono text-xs font-bold rounded-lg transition-colors shadow-xs shrink-0"
              >
                Download PDF Document ↓
              </a>
            </div>
          )}

          {/* External Reference Banner */}
          {publication.externalLink && (
            <div className="p-5 border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/50 rounded-xl mb-8 flex items-center justify-between flex-wrap gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌐</span>
                <div>
                  <h4 className="font-serif text-base text-ink dark:text-gray-100 font-medium">
                    Published on External Platform
                  </h4>
                  <p className="text-xs text-warm-500 dark:text-gray-400 font-sans">
                    This article was syndicated or officially published on an IEEE external forum.
                  </p>
                </div>
              </div>
              <a
                href={publication.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-warm-100 dark:hover:bg-gray-700 text-ink dark:text-gray-200 border border-warm-300 dark:border-gray-600 font-mono text-xs font-semibold rounded-lg transition-colors shrink-0"
              >
                <span>View on Original Platform</span>
                <FiExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Sanitized Article Body Content */}
          <article
            className="space-y-6 text-base text-ink/85 dark:text-gray-200 leading-relaxed font-sans prose prose-lg dark:prose-invert prose-headings:font-serif prose-headings:text-ink dark:prose-headings:text-gray-100 prose-a:text-ieee-blue dark:prose-a:text-sky-400 prose-img:rounded-xl max-w-none border-b border-warm-200 dark:border-gray-800 pb-12"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />

          {/* Social Share & Copy Link Section */}
          <ShareWidget url={shareUrl} title={publication.title} />

          {/* Related Publications Recommendation Strip */}
          {relatedPublications.length > 0 && (
            <div className="pt-12 space-y-6">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue dark:text-sky-400">
                Recommended Further Reading
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedPublications.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-5 border border-warm-200 dark:border-gray-800 bg-warm-50/40 dark:bg-gray-900/40 rounded-xl space-y-2 hover:border-ieee-blue/40 transition-colors group"
                  >
                    <span className="font-mono text-[10px] text-ieee-blue dark:text-sky-400 uppercase">
                      {item.type || item.category || 'Article'}
                    </span>
                    <h4 className="font-serif text-lg text-ink dark:text-gray-100 font-normal leading-snug group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors">
                      <Link href={`/publications/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h4>
                    <p className="text-xs text-warm-500 dark:text-gray-400 font-sans line-clamp-2">
                      {item.excerpt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back Navigation Footer */}
          <div className="mt-12 pt-8 border-t border-warm-200 dark:border-gray-800 flex justify-between items-center flex-wrap gap-4">
            <Link
              href="/publications"
              className="text-xs font-mono text-ieee-blue dark:text-sky-400 hover:underline font-semibold flex items-center gap-1"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Publications</span>
            </Link>
            <span className="font-mono text-xs text-warm-400 dark:text-gray-500">
              IEEE MAIT Editorial Desk
            </span>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
