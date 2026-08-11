/**
 * @file src/app/gallery/page.tsx
 * @description Photo Gallery (Server Component) fetching dynamic records from Prisma DB.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getDynamicGalleries } from '@/lib/api';
import Link from '@/components/ui/AppLink';

export const metadata = {
  title: 'Photo Gallery & Real Moments | IEEE MAIT Student Branch',
  description: 'Explore photo albums capturing IEEE MAIT workshops, hackathons, IEEE Day celebrations, and executive committee sessions.',
};

export const revalidate = 60; // ISR Cache

export default async function GalleryPage() {
  const albums = await getDynamicGalleries();

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Gallery' },
            ]}
          />

          <SectionHeading
            category="Visual Record"
            title="Photo Gallery & Real Moments"
            subtitle="Documentary photography capturing events, workshops, team sessions, and campus life."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {albums.length > 0 ? (
              albums.map((album: any) => (
                <Link
                  key={album.id}
                  href={`/gallery/${album.slug}`}
                  className="border border-warm-200 bg-white rounded-[2px] overflow-hidden group hover:border-ieee-blue transition-all flex flex-col justify-between"
                >
                  <div className="h-56 bg-warm-100/60 border-b border-warm-200 flex flex-col items-center justify-center p-6 text-center group-hover:bg-ieee-subtle/40 transition-colors">
                    <span className="font-mono text-xs font-semibold text-ieee-blue uppercase mb-2">
                      {album.category}
                    </span>
                    <span className="font-serif text-ink text-xl font-normal group-hover:text-ieee-blue transition-colors">
                      {album.title}
                    </span>
                  </div>
                  <div className="p-4 space-y-1 bg-white">
                    <div className="flex items-center justify-between text-xs font-mono text-warm-400">
                      <span>{album.date}</span>
                      <span className="text-ieee-blue font-medium">{album.imageCount} Photographs 📸</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full p-8 text-center text-sm font-mono text-warm-400 border border-warm-200 bg-warm-50 rounded-[2px]">
                No gallery albums published yet.
              </div>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
