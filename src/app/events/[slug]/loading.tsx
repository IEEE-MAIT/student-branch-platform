import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Container } from '@/components/layout/Container';

export default function EventDetailLoading() {
  return (
    <div className="min-h-screen bg-white py-16">
      <Container size="default" className="space-y-8">
        {/* Back Link skeleton */}
        <Skeleton className="w-36 h-4" />

        {/* Status badges skeleton */}
        <div className="flex gap-2">
          <Skeleton className="w-20 h-6 rounded-full" />
          <Skeleton className="w-24 h-6 rounded-full" />
        </div>

        {/* Event Title skeleton */}
        <Skeleton className="w-4/5 h-12" />

        {/* Content Layout skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
          <div className="lg:col-span-8 space-y-8">
            <Skeleton className="w-full h-80 rounded-[2px]" />

            <div className="space-y-4">
              <Skeleton className="w-48 h-7" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4" />
            </div>
          </div>

          {/* Logistics Sidebar skeleton */}
          <div className="lg:col-span-4 border border-warm-200 bg-warm-100/40 p-6 rounded-[2px] space-y-6 h-fit">
            <Skeleton className="w-40 h-6" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="w-20 h-3" />
                  <Skeleton className="w-36 h-5" />
                </div>
              ))}
            </div>
            <Skeleton className="w-full h-11 rounded-md" />
          </div>
        </div>
      </Container>
    </div>
  );
}
