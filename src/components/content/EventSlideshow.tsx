'use client';

/**
 * @file src/components/content/EventSlideshow.tsx
 * @description Interactive photo carousel & documentary slideshow for IEEE MAIT event pages with react-icons.
 * 
 * FEATURES:
 * - Responsive 16:9 carousel with Next/Prev and touch swipe support.
 * - Auto-play toggle with smooth fade transitions.
 * - Interactive thumbnail navigation bar with active state glow.
 * - Fullscreen Lightbox modal with keyboard accessibility (Escape, Arrows).
 * - Theme-tailored caption cards with photographer attribution.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight, FiX, FiMaximize2, FiPlay, FiPause, FiCamera } from 'react-icons/fi';

export interface SlideshowPhoto {
  id?: string;
  url: string;
  caption?: string | null;
  photographer?: string | null;
}

interface EventSlideshowProps {
  photos: SlideshowPhoto[];
  title?: string;
  autoPlayInterval?: number;
  className?: string;
}

export const EventSlideshow: React.FC<EventSlideshowProps> = ({
  photos,
  title = 'Event Visual Archive',
  autoPlayInterval = 5000,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const totalPhotos = photos.length;

  const nextSlide = useCallback(() => {
    if (totalPhotos === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalPhotos);
  }, [totalPhotos]);

  const prevSlide = useCallback(() => {
    if (totalPhotos === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  }, [totalPhotos]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || totalPhotos <= 1) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide, autoPlayInterval, totalPhotos]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isLightboxOpen]);

  if (!photos || photos.length === 0) {
    return null;
  }

  const currentPhoto = photos[currentIndex];

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 50) {
      nextSlide();
    } else if (diffX < -50) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header Bar with Slide Counter and Play Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest">
            {title}
          </span>
          <span className="font-mono text-xs text-warm-400 dark:text-gray-400 bg-warm-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            {currentIndex + 1} / {totalPhotos}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full border border-warm-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-warm-100 dark:hover:bg-gray-700 text-ink dark:text-gray-200 transition-colors cursor-pointer"
            aria-label={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
          >
            {isPlaying ? <FiPause className="w-3.5 h-3.5" /> : <FiPlay className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Auto-play'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full border border-warm-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-warm-100 dark:hover:bg-gray-700 text-ink dark:text-gray-200 transition-colors cursor-pointer"
            aria-label="View Fullscreen"
          >
            <FiMaximize2 className="w-3.5 h-3.5" />
            <span>Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Main Slideshow Viewport */}
      <div
        className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-warm-200 dark:border-gray-800 select-none group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Active Image */}
        <div className="relative w-full h-full">
          <Image
            key={currentPhoto.url}
            src={currentPhoto.url}
            alt={currentPhoto.caption || `${title} photo ${currentIndex + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-contain animate-in fade-in duration-300"
            priority={currentIndex === 0}
          />
        </div>

        {/* Previous Button */}
        {totalPhotos > 1 && (
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Next Button */}
        {totalPhotos > 1 && (
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Caption Card Overlay */}
        {currentPhoto.caption && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-6 text-white pointer-events-none">
            <p className="font-sans text-sm sm:text-base leading-snug line-clamp-2">
              {currentPhoto.caption}
            </p>
            {currentPhoto.photographer && (
              <span className="font-mono text-[11px] text-sky-300 flex items-center gap-1 mt-1">
                <FiCamera className="w-3 h-3" />
                <span>Photo: {currentPhoto.photographer}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Interactive Thumbnail Strip */}
      {totalPhotos > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {photos.map((photo, idx) => (
            <button
              key={photo.id || idx}
              type="button"
              onClick={() => goToSlide(idx)}
              className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-200 cursor-pointer ${
                idx === currentIndex
                  ? 'border-ieee-blue dark:border-sky-400 scale-105 shadow-md ring-2 ring-sky-400/20'
                  : 'border-warm-200 dark:border-gray-700 opacity-60 hover:opacity-100 hover:border-warm-400'
              }`}
              aria-label={`Jump to photo ${idx + 1}`}
            >
              <Image
                src={photo.url}
                alt={photo.caption || `Thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white z-10">
            <span className="font-mono text-sm">
              {currentIndex + 1} of {totalPhotos}
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Center Image */}
          <div className="relative flex-1 w-full max-h-[80vh] my-auto">
            <Image
              src={currentPhoto.url}
              alt={currentPhoto.caption || `${title} photo ${currentIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />

            {totalPhotos > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Footer Caption */}
          {currentPhoto.caption && (
            <div className="text-center text-white/90 text-sm max-w-2xl mx-auto z-10 pb-2">
              <p>{currentPhoto.caption}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
