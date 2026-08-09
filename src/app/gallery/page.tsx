import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export default function GalleryPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <SectionHeading
            category="Visual Record"
            title="Photo Gallery & Real Moments"
            subtitle="Documentary photography capturing events, workshops, team sessions, and campus life."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            <div className="border border-warm-200 bg-white rounded-[2px] overflow-hidden group">
              <div className="h-56 bg-warm-100 border-b border-warm-200 flex items-center justify-center p-6 text-center">
                <span className="font-serif text-warm-300 text-lg">
                  IEEE Day Celebration Album
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-serif text-lg text-ink font-normal">
                  IEEE Day 2025 Flagship
                </h4>
                <p className="text-xs font-mono text-warm-400">
                  October 2025 · 24 Photographs
                </p>
              </div>
            </div>

            <div className="border border-warm-200 bg-white rounded-[2px] overflow-hidden group">
              <div className="h-56 bg-warm-100 border-b border-warm-200 flex items-center justify-center p-6 text-center">
                <span className="font-serif text-warm-300 text-lg">
                  Hardware Workshop Album
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-serif text-lg text-ink font-normal">
                  PCB Design & Soldering Session
                </h4>
                <p className="text-xs font-mono text-warm-400">
                  August 2025 · 18 Photographs
                </p>
              </div>
            </div>

            <div className="border border-warm-200 bg-white rounded-[2px] overflow-hidden group">
              <div className="h-56 bg-warm-100 border-b border-warm-200 flex items-center justify-center p-6 text-center">
                <span className="font-serif text-warm-300 text-lg">
                  Leadership Orientation Album
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-serif text-lg text-ink font-normal">
                  Executive Committee Team Session
                </h4>
                <p className="text-xs font-mono text-warm-400">
                  September 2025 · 12 Photographs
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
