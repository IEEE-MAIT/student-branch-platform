'use client';

/**
 * @file src/components/gallery/Lightbox.tsx
 * @description Modern, aesthetic & professional Fullscreen Lightbox for Photo Galleries.
 * 
 * Features:
 * - True React Portal mounting directly to document.body (z-[9999]).
 * - Complete immersive fullscreen backdrop (bg-black/95 backdrop-blur-2xl) covering all page elements.
 * - Prevents background body scrolling when open.
 * - Floating glassmorphic top control bar with photo counter, title, download, and close triggers.
 * - Tactile floating left/right navigation controls.
 * - Floating bottom caption bar with refined typography.
 * - Full keyboard navigation (Escape, ArrowLeft, ArrowRight).
 * - Click-outside backdrop dismissal.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiDownload,
  FiMaximize,
  FiMinimize,
} from 'react-icons/fi';

export interface LightboxPhoto {
  id: string;
  caption: string;
  url?: string | null;
}

interface LightboxProps {
  /** Array of photo items in current album */
  photos: LightboxPhoto[];
  /** Zero-based index of photo currently displayed */
  currentIndex: number;
  /** Visibility state of modal */
  isOpen: boolean;
  /** Callback fired when user closes lightbox */
  onClose: () => void;
  /** Callback fired when user navigates to a new image index */
  onNavigate: (newIndex: number) => void;
  /** Optional album title for context */
  albumTitle?: string;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  albumTitle,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentPhoto = photos[currentIndex];

  // Navigation callbacks
  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onNavigate(0);
    }
  }, [currentIndex, photos.length, onNavigate]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      onNavigate(photos.length - 1);
    }
  }, [currentIndex, photos.length, onNavigate]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || 'unset';
      };
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  if (!mounted || !isOpen || !currentPhoto) return null;

  const content = (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex flex-col justify-between select-none animate-fadeIn"
      role="dialog"
      aria-label="Fullscreen Photo Lightbox"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ---------------------------------------------------- */}
      {/* TOP FLOATING GLASS HEADER */}
      {/* ---------------------------------------------------- */}
      <header className="relative z-30 flex items-center justify-between px-4 sm:px-8 py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        {/* Left: Album Context & Index Counter */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 font-mono text-xs font-semibold text-white tracking-widest uppercase shadow-xs">
            {currentIndex + 1} / {photos.length}
          </span>
          {albumTitle && (
            <span className="hidden sm:inline font-serif text-sm text-gray-300 font-normal truncate max-w-md">
              {albumTitle}
            </span>
          )}
        </div>

        {/* Right: Actions (Fullscreen, Download, Close) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleBrowserFullscreen}
            className="p-2.5 rounded-full text-gray-300 hover:text-white bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/10 transition-all cursor-pointer shadow-xs"
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? (
              <FiMinimize className="w-4 h-4" />
            ) : (
              <FiMaximize className="w-4 h-4" />
            )}
          </button>

          {currentPhoto.url && (
            <a
              href={currentPhoto.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="p-2.5 rounded-full text-gray-300 hover:text-white bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/10 transition-all cursor-pointer shadow-xs"
              aria-label="Download High-Resolution Photo"
              title="Download High-Resolution Photo"
            >
              <FiDownload className="w-4 h-4" />
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
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

      {/* ---------------------------------------------------- */}
      {/* MAIN VIEWPORT FRAME & NAVIGATION BUTTONS */}
      {/* ---------------------------------------------------- */}
      <main
        className="relative flex-1 flex items-center justify-center w-full h-full px-2 sm:px-12 py-2 overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Previous Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-3 sm:left-6 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 hover:scale-105 active:scale-95 text-white backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xl group"
          aria-label="Previous Photo"
        >
          <FiChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:-translate-x-0.5" />
        </button>

        {/* Central High-Res Photo Container */}
        <div
          className="relative max-w-6xl max-h-[78vh] w-full h-full flex items-center justify-center p-2"
          onClick={(e) => e.stopPropagation()}
        >
          {currentPhoto.url ? (
            <div className="relative w-full h-full max-h-[76vh] flex items-center justify-center">
              <Image
                src={currentPhoto.url}
                alt={currentPhoto.caption || 'Gallery documentary photo'}
                fill
                sizes="100vw"
                className="object-contain drop-shadow-2xl transition-all duration-300"
                priority
              />
            </div>
          ) : (
            <div className="relative w-full max-w-2xl bg-white/5 border border-white/10 p-10 rounded-2xl text-center space-y-4 backdrop-blur-md shadow-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-sky-400 font-semibold block">
                IEEE MAIT Documentary Archive
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-snug">
                {currentPhoto.caption}
              </h3>
            </div>
          )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-3 sm:right-6 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 hover:scale-105 active:scale-95 text-white backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xl group"
          aria-label="Next Photo"
        >
          <FiChevronRight className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:translate-x-0.5" />
        </button>
      </main>

      {/* ---------------------------------------------------- */}
      {/* BOTTOM FLOATING CAPTION PILL */}
      {/* ---------------------------------------------------- */}
      <footer className="relative z-30 flex items-center justify-center px-4 py-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="max-w-2xl w-full px-5 py-3 rounded-2xl bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/15 text-center shadow-xl transition-all">
          <p className="font-serif text-base sm:text-lg text-white font-normal leading-relaxed">
            {currentPhoto.caption}
          </p>
          <span className="font-mono text-[11px] text-gray-400 uppercase tracking-wider block mt-1">
            IEEE MAIT Visual Archive · Maharaja Agrasen Institute of Technology
          </span>
        </div>
      </footer>
    </div>
  );

  return createPortal(content, document.body);
};
