'use client';

import React, { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Lightbox } from '@/components/gallery/Lightbox';
import Link from 'next/link';

interface PhotoItem {
  id: string;
  caption: string;
  url?: string | null;
}

interface Album {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  description?: string | null;
  unit?: string | null;
  photos: PhotoItem[];
}

export function GalleryAlbumViewer({ album }: { album: Album }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const openLightboxAtIndex = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  const photosList = Array.isArray(album?.photos) ? album.photos : [];

  return (
    <>
      <Container size="default">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-warm-400 hover:text-ieee-blue mb-8 transition-colors"
        >
          <span>← Back to Photo Gallery</span>
        </Link>

        <SectionHeading
          category={`${album.category} · ${album.date}`}
          title={album.title}
          subtitle={album.description || undefined}
        />

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {photosList.map((photo, idx) => (
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
          {photosList.length === 0 && (
            <div className="col-span-full p-8 text-center text-sm font-mono text-warm-400 border border-warm-200 bg-warm-50 rounded-[2px]">
              No photos uploaded for this album yet.
            </div>
          )}
        </div>
      </Container>

      {/* Lightbox Modal */}
      <Lightbox
        photos={photosList}
        currentIndex={photoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setPhotoIndex(newIdx)}
      />
    </>
  );
}
