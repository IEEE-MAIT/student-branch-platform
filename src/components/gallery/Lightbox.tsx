'use client';

/**
 * @file src/components/gallery/Lightbox.tsx
 * @description Fullscreen modal Lightbox viewer for photo albums with keyboard navigation.
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

export interface LightboxPhoto {
  id: string;
  caption: string;
  url?: string | null;
}

/**
 * Props for Lightbox component.
 */
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

/**
 * Fullscreen Interactive Lightbox Modal Component.
 */
export const Lightbox: React.FC<LightboxProps> = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const currentPhoto = photos[currentIndex];

  /**
   * Advances to next photograph in gallery, wrapping to index 0 at end.
   */
  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onNavigate(0); // Wrap around to first photo
    }
  }, [currentIndex, photos.length, onNavigate]);

  /**
   * Recedes to previous photograph in gallery, wrapping to last index at start.
   */
  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      onNavigate(photos.length - 1); // Wrap around to last photo
    }
  }, [currentIndex, photos.length, onNavigate]);

  /**
   * Keyboard shortcut event listener (Escape to close, Arrow keys to navigate).
   */
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
          className="text-warm-300 hover:text-white p-2 text-xl font-mono focus:outline-none transition-colors"
          aria-label="Close Lightbox"
        >
          ✕ Esc
        </button>
      </div>

      {/* Main Image Frame & Navigation Controls */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {/* Previous Image Button */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 z-10 p-3 text-white bg-black/50 hover:bg-black/80 border border-white/20 rounded-[2px] transition-colors"
          aria-label="Previous Photo"
        >
          ‹
        </button>

        {/* Display Frame */}
        <div className="max-w-5xl max-h-full flex flex-col items-center justify-center p-2">
          <div className="relative w-full max-h-[70vh] flex items-center justify-center bg-warm-200/10 border border-white/10 p-8 rounded-[2px]">
            <div className="text-center space-y-3">
              <span className="font-mono text-xs text-ieee-light uppercase tracking-wider block">
                [Photograph Placeholder]
              </span>
              <h4 className="font-serif text-2xl text-white font-normal">
                {currentPhoto.caption}
              </h4>
            </div>
          </div>
        </div>

        {/* Next Image Button */}
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 z-10 p-3 text-white bg-black/50 hover:bg-black/80 border border-white/20 rounded-[2px] transition-colors"
          aria-label="Next Photo"
        >
          ›
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
