import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Container } from '@/components/layout/Container';

export default function ChapterDetailLoading() {
  return (
    <div className="min-h-screen bg-white py-16">
      <Container size="default" className="space-y-8">
        <Skeleton className="w-36 h-4" />

        <div className="space-y-4">
          <Skeleton className="w-24 h-6 rounded-full" />
          <Skeleton className="w-3/4 h-12" />
          <Skeleton className="w-full max-w-2xl h-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-warm-200 p-6 rounded-[2px] space-y-2">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-36 h-8" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
