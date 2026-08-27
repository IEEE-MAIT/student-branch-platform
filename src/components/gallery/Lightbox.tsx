'use client';

/**
 * @file src/components/gallery/Lightbox.tsx
 * @description Fullscreen modal Lightbox viewer for photo albums with react-icons and keyboard navigation.
 * 
 * DESIGN & ACCESSIBILITY SPECIFICATIONS:
 * - Full-screen backdrop overlay (`bg-black/95 backdrop-blur-md`).
 * - Keyboard shortcuts (Escape key to close, Left/Right arrow keys to cycle images).
 * - ARIA accessibility compliance (`role="dialog"`, `aria-label`, focus trap ready).
 * - Monospaced image index counter (`Photo X of Y`) and caption overlay.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

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
}

export const Lightbox: React.FC<LightboxProps> = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const currentPhoto = photos[currentIndex];

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

  if (!isOpen || !currentPhoto) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
      role="dialog"
      aria-label="Photo Lightbox Viewer"
      aria-modal="true"
    >
      {/* Header bar: Counter & Close Button */}
      <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
        <span className="font-mono text-xs uppercase tracking-widest text-warm-300">
          Photo {currentIndex + 1} of {photos.length}
        </span>
        <button
          onClick={onClose}
          className="text-warm-300 hover:text-white p-2 text-xs font-mono focus:outline-hidden hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          aria-label="Close Lightbox"
        >
          <FiX className="w-4 h-4" />
          <span>Close (Esc)</span>
        </button>
      </div>

      {/* Main Image Frame & Navigation Controls */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {/* Previous Image Button */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-6 z-20 p-3 text-white bg-black/60 hover:bg-ieee-blue/80 border border-white/20 rounded-full transition-colors cursor-pointer"
          aria-label="Previous Photo"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>

        {/* Display Frame */}
        <div className="max-w-5xl max-h-[75vh] w-full h-full flex flex-col items-center justify-center p-2 relative">
          {currentPhoto.url ? (
            <div className="relative w-full h-full max-h-[70vh] rounded-[2px] overflow-hidden">
              <Image
                src={currentPhoto.url}
                alt={currentPhoto.caption}
                fill
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="relative w-full max-h-[70vh] flex items-center justify-center bg-warm-200/10 border border-white/10 p-8 rounded-[2px]">
              <div className="text-center space-y-3">
                <span className="font-mono text-xs text-ieee-light uppercase tracking-wider block">
                  IEEE MAIT Visual Archive
                </span>
                <h4 className="font-serif text-2xl text-white font-normal">
                  {currentPhoto.caption}
                </h4>
              </div>
            </div>
          )}
        </div>

        {/* Next Image Button */}
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-6 z-20 p-3 text-white bg-black/60 hover:bg-ieee-blue/80 border border-white/20 rounded-full transition-colors cursor-pointer"
          aria-label="Next Photo"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Caption & Footer Bar */}
      <div className="text-center border-t border-white/10 pt-4">
        <p className="text-sm font-sans text-warm-200 max-w-2xl mx-auto">
          {currentPhoto.caption}
        </p>
      </div>
    </div>
  );
};
