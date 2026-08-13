import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Container } from '@/components/layout/Container';

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-white py-12">
      <Container size="default" className="space-y-8">
        <div className="space-y-3">
          <Skeleton className="w-28 h-4" />
          <Skeleton className="w-64 h-10" />
        </div>

        {/* Search input bar skeleton */}
        <Skeleton className="w-full h-14 rounded-lg" />

        {/* Filters bar skeleton */}
        <div className="flex gap-2 border-b border-warm-200 pb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="w-24 h-7 rounded-full" />
          ))}
        </div>

        {/* Search Results list skeleton */}
        <div className="space-y-4 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border border-warm-200 p-5 rounded-[2px] space-y-2">
              <Skeleton className="w-20 h-4 rounded-full" />
              <Skeleton className="w-1/2 h-6" />
              <Skeleton className="w-full h-4" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
