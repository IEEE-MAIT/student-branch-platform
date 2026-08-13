import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Container } from '@/components/layout/Container';

export default function GalleryLoading() {
  return (
    <div className="min-h-screen bg-white py-12">
      <Container size="default" className="space-y-8">
        <div className="flex gap-2 items-center">
          <Skeleton className="w-16 h-4" />
          <span className="text-warm-300">/</span>
          <Skeleton className="w-20 h-4" />
        </div>

        <div className="space-y-3">
          <Skeleton className="w-28 h-4" />
          <Skeleton className="w-64 h-10" />
          <Skeleton className="w-full max-w-lg h-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-warm-200 rounded-[2px] overflow-hidden">
              <Skeleton className="w-full aspect-[4/3]" />
              <div className="p-4 space-y-2">
                <Skeleton className="w-3/4 h-5" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
