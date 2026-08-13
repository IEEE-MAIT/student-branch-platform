import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Container } from '@/components/layout/Container';

export default function EventsLoading() {
  return (
    <div className="min-h-screen bg-white py-12">
      <Container size="default" className="space-y-8">
        {/* Breadcrumb skeleton */}
        <div className="flex gap-2 items-center">
          <Skeleton className="w-16 h-4" />
          <span className="text-warm-300">/</span>
          <Skeleton className="w-20 h-4" />
        </div>

        {/* Heading skeleton */}
        <div className="space-y-3">
          <Skeleton className="w-28 h-4" />
          <Skeleton className="w-64 h-10" />
          <Skeleton className="w-full max-w-lg h-4" />
        </div>

        {/* Tab Filters skeleton */}
        <div className="flex gap-4 border-b border-warm-200 pb-4">
          <Skeleton className="w-28 h-8 rounded-md" />
          <Skeleton className="w-28 h-8 rounded-md" />
        </div>

        {/* Events Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-warm-200 rounded-[2px] p-5 space-y-4">
              <Skeleton className="w-full h-44 rounded-[2px]" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-16 h-5 rounded-full" />
                <Skeleton className="w-20 h-5 rounded-full" />
              </div>
              <Skeleton className="w-3/4 h-6" />
              <Skeleton className="w-full h-12" />
              <div className="pt-2 border-t border-warm-100 flex justify-between items-center">
                <Skeleton className="w-28 h-4" />
                <Skeleton className="w-20 h-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
