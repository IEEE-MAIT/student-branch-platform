'use client';

import React, { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Lightbox } from '@/components/gallery/Lightbox';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';

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
          className="inline-flex items-center gap-1.5 font-mono text-xs text-warm-400 dark:text-gray-400 hover:text-ieee-blue dark:hover:text-sky-400 mb-8 transition-colors"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Photo Gallery</span>
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
              key={photo.id || idx}
              onClick={() => openLightboxAtIndex(idx)}
              className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl overflow-hidden cursor-pointer group hover:border-ieee-blue dark:hover:border-sky-500 transition-all flex flex-col justify-between shadow-xs"
            >
              {photo.url ? (
                <div className="relative w-full h-56 bg-warm-100 dark:bg-gray-800 overflow-hidden">
                  <Image
                    src={photo.url}
                    alt={photo.caption || `Photo ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="h-56 bg-warm-100/60 dark:bg-gray-800/60 border-b border-warm-200 dark:border-gray-800 flex flex-col items-center justify-center p-6 text-center group-hover:bg-ieee-subtle/50 transition-colors">
                  <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase mb-2">
                    Photo {idx + 1}
                  </span>
                  <p className="font-serif text-ink dark:text-gray-100 text-base line-clamp-2 font-normal">
                    {photo.caption}
                  </p>
                </div>
              )}

              <div className="p-4 bg-white dark:bg-gray-900 border-t border-warm-200 dark:border-gray-800 flex items-center justify-between">
                <p className="text-xs text-warm-400 dark:text-gray-400 font-sans line-clamp-1">
                  {photo.caption}
                </p>
                <span className="text-[11px] text-ieee-blue dark:text-sky-400 font-mono font-semibold shrink-0 ml-2 flex items-center gap-1">
                  <span>View</span>
                  <FiSearch className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}

          {photosList.length === 0 && (
            <div className="col-span-full p-8 text-center text-sm font-mono text-warm-400 dark:text-gray-400 border border-warm-200 dark:border-gray-800 bg-warm-50 dark:bg-gray-900 rounded-xl">
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
