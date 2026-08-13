import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Container } from '@/components/layout/Container';

export default function AchievementDetailLoading() {
  return (
    <div className="min-h-screen bg-white py-16">
      <Container size="default" className="space-y-8">
        {/* Back link skeleton */}
        <Skeleton className="w-48 h-4" />

        {/* Badges skeleton */}
        <div className="flex gap-2">
          <Skeleton className="w-16 h-6 rounded-full" />
          <Skeleton className="w-24 h-6 rounded-full" />
        </div>

        {/* Main Title skeleton */}
        <Skeleton className="w-3/4 h-12" />

        {/* Content Layout skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
          <div className="lg:col-span-8 space-y-8">
            {/* Cover photo skeleton */}
            <Skeleton className="w-full h-80 rounded-[2px]" />

            {/* Description skeleton */}
            <div className="space-y-4">
              <Skeleton className="w-48 h-7" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-2/3 h-4" />
            </div>

            {/* Photo gallery grid skeleton */}
            <div className="pt-6 space-y-4">
              <Skeleton className="w-48 h-7" />
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="w-full aspect-[4/3] rounded-[2px]" />
                ))}
              </div>
            </div>
          </div>

          {/* Recognition Details Sidebar skeleton */}
          <div className="lg:col-span-4 border border-warm-200 bg-warm-100/40 p-6 rounded-[2px] space-y-6 h-fit">
            <Skeleton className="w-44 h-6" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="w-24 h-3" />
                  <Skeleton className="w-32 h-5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
