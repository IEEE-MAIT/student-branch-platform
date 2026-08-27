/**
 * @file src/app/gallery/page.tsx
 * @description Photo Gallery (Server Component) fetching dynamic records from Prisma DB with react-icons.
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
import { FiCamera } from 'react-icons/fi';

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

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
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
                  className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl overflow-hidden group hover:border-ieee-blue dark:hover:border-sky-500 hover:shadow-md transition-all flex flex-col justify-between shadow-xs"
                >
                  <div className="h-56 bg-warm-100/60 dark:bg-gray-800/60 border-b border-warm-200 dark:border-gray-800 flex flex-col items-center justify-center p-6 text-center group-hover:bg-ieee-subtle/40 dark:group-hover:bg-sky-950/40 transition-colors">
                    <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase mb-2">
                      {album.category}
                    </span>
                    <span className="font-serif text-ink dark:text-gray-100 text-xl font-normal group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors">
                      {album.title}
                    </span>
                  </div>
                  <div className="p-4 space-y-1 bg-white dark:bg-gray-900">
                    <div className="flex items-center justify-between text-xs font-mono text-warm-400 dark:text-gray-400">
                      <span>{album.date}</span>
                      <span className="text-ieee-blue dark:text-sky-400 font-medium flex items-center gap-1.5">
                        <span>{album.imageCount} Photographs</span>
                        <FiCamera className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full p-8 text-center text-sm font-mono text-warm-400 dark:text-gray-400 border border-warm-200 dark:border-gray-800 bg-warm-50 dark:bg-gray-900 rounded-xl">
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
