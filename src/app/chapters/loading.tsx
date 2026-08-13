import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Container } from '@/components/layout/Container';

export default function ChaptersLoading() {
  return (
    <div className="min-h-screen bg-white py-12">
      <Container size="default" className="space-y-8">
        <div className="flex gap-2 items-center">
          <Skeleton className="w-16 h-4" />
          <span className="text-warm-300">/</span>
          <Skeleton className="w-24 h-4" />
        </div>

        <div className="space-y-3">
          <Skeleton className="w-28 h-4" />
          <Skeleton className="w-64 h-10" />
          <Skeleton className="w-full max-w-lg h-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-warm-200 p-6 rounded-[2px] space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="w-48 h-7" />
                <Skeleton className="w-16 h-6 rounded-full" />
              </div>
              <Skeleton className="w-full h-12" />
              <div className="flex gap-4 pt-2">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-24 h-4" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
