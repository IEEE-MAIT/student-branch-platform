'use client';

/**
 * @file src/components/content/EventSlideshow.tsx
 * @description Interactive photo carousel & documentary slideshow for IEEE MAIT event pages with react-icons.
 * 
 * FEATURES:
 * - Responsive 16:9 carousel with Next/Prev and touch swipe support.
 * - Auto-play toggle with smooth fade transitions.
 * - Interactive thumbnail navigation bar with active state glow.
 * - True Fullscreen Lightbox modal using React Portal mounting directly to document.body (z-[9999]).
 * - Complete immersive backdrop covering all navbar and floating elements.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiMaximize2,
  FiPlay,
  FiPause,
  FiCamera,
  FiDownload,
} from 'react-icons/fi';

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
  const [mounted, setMounted] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const totalPhotos = photos.length;

  useEffect(() => {
    setMounted(true);
  }, []);

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
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || 'unset';
      };
    }
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
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full border border-warm-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-warm-100 dark:hover:bg-gray-700 text-ink dark:text-gray-200 transition-colors cursor-pointer shadow-2xs"
            aria-label={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
          >
            {isPlaying ? <FiPause className="w-3.5 h-3.5" /> : <FiPlay className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Auto-play'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full border border-warm-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-warm-100 dark:hover:bg-gray-700 text-ink dark:text-gray-200 transition-colors cursor-pointer shadow-2xs"
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

      {/* ---------------------------------------------------- */}
      {/* TRUE FULLSCREEN PORTAL LIGHTBOX MODAL */}
      {/* ---------------------------------------------------- */}
      {mounted && isLightboxOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen Event Slideshow"
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex flex-col justify-between select-none animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLightboxOpen(false);
          }}
        >
          {/* Top Glass Header */}
          <header className="relative z-30 flex items-center justify-between px-4 sm:px-8 py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 font-mono text-xs font-semibold text-white tracking-widest uppercase shadow-xs">
                {currentIndex + 1} / {totalPhotos}
              </span>
              <span className="hidden sm:inline font-serif text-sm text-gray-300 font-normal truncate max-w-md">
                {title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {currentPhoto.url && (
                <a
                  href={currentPhoto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="p-2.5 rounded-full text-gray-300 hover:text-white bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/10 transition-all cursor-pointer shadow-xs"
                  aria-label="Download Photo"
                  title="Download Photo"
                >
                  <FiDownload className="w-4 h-4" />
                </a>
              )}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-white bg-white/15 hover:bg-white/25 hover:scale-102 active:scale-98 backdrop-blur-md border border-white/20 text-xs font-mono font-semibold transition-all cursor-pointer shadow-xs ml-1"
                aria-label="Close Lightbox"
              >
                <FiX className="w-4 h-4" />
                <span>Close</span>
                <kbd className="hidden sm:inline text-[10px] opacity-60 ml-0.5 bg-black/30 px-1 py-0.5 rounded font-mono">
                  ESC
                </kbd>
              </button>
            </div>
          </header>

          {/* Center Fullscreen Image & Chevrons */}
          <main
            className="relative flex-1 flex items-center justify-center w-full h-full px-2 sm:px-12 py-2 overflow-hidden"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsLightboxOpen(false);
            }}
          >
            {totalPhotos > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                aria-label="Previous Slide"
                className="absolute left-3 sm:left-6 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 hover:scale-105 active:scale-95 text-white backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xl group"
              >
                <FiChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:-translate-x-0.5" />
              </button>
            )}

            <div
              className="relative max-w-6xl max-h-[78vh] w-full h-full flex items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentPhoto.url}
                alt={currentPhoto.caption || `${title} photo ${currentIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain drop-shadow-2xl transition-all duration-300"
                priority
              />
            </div>

            {totalPhotos > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                aria-label="Next Slide"
                className="absolute right-3 sm:right-6 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 hover:scale-105 active:scale-95 text-white backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xl group"
              >
                <FiChevronRight className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </main>

          {/* Bottom Floating Caption */}
          {currentPhoto.caption && (
            <footer className="relative z-30 flex items-center justify-center px-4 py-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="max-w-2xl w-full px-5 py-3 rounded-2xl bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/15 text-center shadow-xl transition-all">
                <p className="font-serif text-base sm:text-lg text-white font-normal leading-relaxed">
                  {currentPhoto.caption}
                </p>
                {currentPhoto.photographer && (
                  <span className="font-mono text-[11px] text-gray-400 uppercase tracking-wider block mt-1">
                    Photo Credit: {currentPhoto.photographer}
                  </span>
                )}
              </div>
            </footer>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};
