import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Container } from '@/components/layout/Container';

export default function ChapterDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Skeleton */}
      <div className="border-b border-warm-200 bg-warm-50/50 py-3.5">
        <Container size="default">
          <div className="flex items-center gap-2">
            <Skeleton className="w-12 h-3.5" />
            <span className="text-warm-300">/</span>
            <Skeleton className="w-32 h-3.5" />
            <span className="text-warm-300">/</span>
            <Skeleton className="w-24 h-3.5" />
          </div>
        </Container>
      </div>

      {/* Hero Band Skeleton */}
      <div className="border-b border-warm-200 bg-warm-100/50 py-14">
        <Container size="default">
          <div className="space-y-4 max-w-3xl">
            <div className="flex gap-3 items-center">
              <Skeleton className="w-24 h-5 rounded-[2px]" />
              <Skeleton className="w-40 h-4" />
            </div>
            <Skeleton className="w-72 h-14" />
            <Skeleton className="w-64 h-4" />
            <div className="flex gap-4 pt-2">
              <Skeleton className="w-36 h-10 rounded-[2px]" />
              <Skeleton className="w-28 h-10 rounded-[2px]" />
            </div>
          </div>
        </Container>
      </div>

      {/* Stats Strip Skeleton */}
      <div className="border-b border-warm-200 bg-warm-100/30 py-4">
        <Container size="default">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-warm-200 py-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-4 space-y-2">
                <Skeleton className="w-24 h-3" />
                <Skeleton className="w-16 h-7" />
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Main Grid Skeleton */}
      <Container size="default" className="py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-3">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-56 h-8" />
              <Skeleton className="w-full h-20" />
            </div>

            <div className="space-y-4">
              <Skeleton className="w-48 h-8" />
              <div className="border border-warm-200 divide-y divide-warm-200 rounded-[2px]">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 space-y-2">
                    <Skeleton className="w-3/4 h-5" />
                    <Skeleton className="w-1/2 h-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="border border-warm-200 p-6 rounded-[2px] space-y-4 bg-warm-100/40">
              <Skeleton className="w-36 h-6" />
              <Skeleton className="w-full h-32" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

