import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Container } from '@/components/layout/Container';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="h-20 border-b border-warm-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <Container size="wide" className="h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-48 h-10" />
            <div className="hidden sm:block h-8 w-[1px] bg-warm-200" />
            <div className="hidden md:flex flex-col gap-1">
              <Skeleton className="w-40 h-3" />
              <Skeleton className="w-28 h-2" />
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-16 h-4" />
            ))}
          </div>
          <Skeleton className="w-28 h-9 rounded-md" />
        </Container>
      </div>

      {/* Hero Section skeleton */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-warm-100/50 to-white border-b border-warm-200">
        <Container size="default" className="text-center space-y-6">
          <div className="flex justify-center">
            <Skeleton className="w-48 h-6 rounded-full" />
          </div>
          <Skeleton className="w-3/4 h-12 mx-auto" />
          <Skeleton className="w-2/3 h-12 mx-auto" />
          <Skeleton className="w-1/2 h-5 mx-auto" />
          <div className="pt-4 flex justify-center gap-4">
            <Skeleton className="w-36 h-11 rounded-md" />
            <Skeleton className="w-36 h-11 rounded-md" />
          </div>
        </Container>
      </section>

      {/* Stats Bar skeleton */}
      <section className="py-8 bg-warm-100/40 border-b border-warm-200">
        <Container size="wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center space-y-2 p-4">
                <Skeleton className="w-20 h-10 mx-auto" />
                <Skeleton className="w-24 h-4 mx-auto" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Content Section skeleton */}
      <section className="py-16">
        <Container size="wide" className="space-y-12">
          <div className="space-y-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-64 h-8" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border border-warm-200 rounded-[2px] p-6 space-y-4">
                <Skeleton className="w-full h-48 rounded-[2px]" />
                <Skeleton className="w-1/3 h-4" />
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-full h-12" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
