import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Container } from '@/components/layout/Container';

export default function AchievementsLoading() {
  return (
    <div className="min-h-screen bg-white py-12">
      <Container size="default" className="space-y-8">
        {/* Breadcrumb skeleton */}
        <div className="flex gap-2 items-center">
          <Skeleton className="w-16 h-4" />
          <span className="text-warm-300">/</span>
          <Skeleton className="w-28 h-4" />
        </div>

        {/* Section Heading skeleton */}
        <div className="space-y-3">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-72 h-10" />
          <Skeleton className="w-full max-w-xl h-4" />
        </div>

        {/* Filters skeleton */}
        <div className="flex gap-3 pt-4 border-b border-warm-200 pb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-24 h-8 rounded-full" />
          ))}
        </div>

        {/* Achievements Ledger Rows skeleton */}
        <div className="space-y-4 pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-warm-200 p-6 rounded-[2px] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-16 h-5 rounded-full" />
                  <Skeleton className="w-24 h-5 rounded-full" />
                </div>
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-full max-w-md h-4" />
              </div>
              <Skeleton className="w-24 h-8 rounded-md" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
