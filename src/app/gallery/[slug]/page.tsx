/**
 * @file src/app/gallery/[slug]/page.tsx
 * @description Dynamic Photo Album View (Server Component) fetching from Prisma DB.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GalleryAlbumViewer } from '@/components/content/GalleryAlbumViewer';
import { getDynamicGalleryAlbumBySlug, getDynamicGalleries } from '@/lib/api';

export async function generateStaticParams() {
  const galleries = await getDynamicGalleries();
  return galleries.map((gallery: any) => ({
    slug: gallery.slug,
  }));
}

interface AlbumPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR Cache

export async function generateMetadata({ params }: AlbumPageProps) {
  const resolvedParams = await params;
  const album = await getDynamicGalleryAlbumBySlug(resolvedParams.slug);
  
  if (!album) return { title: 'Album Not Found | IEEE MAIT Gallery' };
  return {
    title: `${album.title} | IEEE MAIT Gallery`,
    description: album.description || `View photos from ${album.title}.`,
  };
}

export default async function AlbumDetailPage({ params }: AlbumPageProps) {
  const resolvedParams = await params;
  const album = await getDynamicGalleryAlbumBySlug(resolvedParams.slug);

  if (!album) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
        <GalleryAlbumViewer album={album as any} />
      </main>
      <Footer />
    </>
  );
}
