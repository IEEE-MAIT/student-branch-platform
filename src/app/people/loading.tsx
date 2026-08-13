import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Container } from '@/components/layout/Container';

export default function PeopleLoading() {
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

        {/* Category Tabs skeleton */}
        <div className="flex gap-3 border-b border-warm-200 pb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-28 h-8 rounded-full" />
          ))}
        </div>

        {/* People Cards Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 pt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border border-warm-200 rounded-[2px] p-4 text-center space-y-3">
              <Skeleton className="w-24 h-24 rounded-full mx-auto" />
              <Skeleton className="w-3/4 h-5 mx-auto" />
              <Skeleton className="w-1/2 h-3 mx-auto" />
              <Skeleton className="w-2/3 h-3 mx-auto" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
