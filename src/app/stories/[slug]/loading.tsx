import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Container } from '@/components/layout/Container';

export default function StoryDetailLoading() {
  return (
    <div className="min-h-screen bg-white py-16">
      <Container size="default" className="max-w-4xl space-y-8">
        <Skeleton className="w-36 h-4" />

        <div className="space-y-4">
          <Skeleton className="w-24 h-6 rounded-full" />
          <Skeleton className="w-full h-12" />
          <div className="flex items-center gap-4 text-xs">
            <Skeleton className="w-28 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>

        <Skeleton className="w-full h-96 rounded-[2px]" />

        <div className="space-y-4 pt-4">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-5/6 h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-4/5 h-4" />
        </div>
      </Container>
    </div>
  );
}
