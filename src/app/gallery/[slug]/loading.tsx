import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Container } from '@/components/layout/Container';

export default function GalleryAlbumLoading() {
  return (
    <div className="min-h-screen bg-white py-16">
      <Container size="default" className="space-y-8">
        <Skeleton className="w-36 h-4" />

        <div className="space-y-3">
          <Skeleton className="w-20 h-6 rounded-full" />
          <Skeleton className="w-3/4 h-10" />
          <Skeleton className="w-full max-w-xl h-4" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="w-full aspect-[4/3] rounded-[2px]" />
          ))}
        </div>
      </Container>
    </div>
  );
}
