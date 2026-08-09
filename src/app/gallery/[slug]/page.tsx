'use client';

/**
 * @file src/app/gallery/[slug]/page.tsx
 * @description Dynamic Photo Album View page with responsive grid and interactive Lightbox modal.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 */

import React, { useState, use } from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Lightbox } from '@/components/gallery/Lightbox';
import { GALLERY_ALBUMS_DATA } from '@/lib/data';
import Link from 'next/link';

interface AlbumPageProps {
  params: Promise<{ slug: string }>;
}

export default function AlbumDetailPage({ params }: AlbumPageProps) {
  const resolvedParams = use(params);
  const album = GALLERY_ALBUMS_DATA[resolvedParams.slug];

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!album) {
    notFound();
  }

  const openLightboxAtIndex = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-warm-400 hover:text-ieee-blue mb-8 transition-colors"
          >
            <span>← Back to Photo Gallery</span>
          </Link>

          <SectionHeading
            category={`${album.unit} · ${album.date}`}
            title={album.title}
            subtitle={album.description}
          />

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {album.photos.map((photo, idx) => (
              <div
                key={photo.id}
                onClick={() => openLightboxAtIndex(idx)}
                className="border border-warm-200 bg-warm-100/40 rounded-[2px] overflow-hidden cursor-pointer group hover:border-ieee-blue transition-all"
              >
                <div className="h-56 bg-warm-200/50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-ieee-subtle/50 transition-colors">
                  <span className="font-mono text-xs font-semibold text-ieee-blue uppercase mb-2">
                    Photo {idx + 1}
                  </span>
                  <p className="font-serif text-ink text-base line-clamp-2">
                    {photo.caption}
                  </p>
                  <span className="text-xs text-warm-400 font-mono mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to Expand 🔍
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>

        {/* Lightbox Modal */}
        <Lightbox
          photos={album.photos}
          currentIndex={photoIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(newIdx) => setPhotoIndex(newIdx)}
        />
      </main>

      <Footer />
    </>
  );
}
