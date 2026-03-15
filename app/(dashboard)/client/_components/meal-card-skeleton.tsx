'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function MealCardsSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/40 p-6">
      <div className="flex items-start justify-between">
        <div>
          <Skeleton className="mb-1 h-5 w-32" />
          <Skeleton className="mb-1 h-5 w-20" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
        </div>
      </div>

      <Skeleton className="h-px w-full" />

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4" />
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 2 }, (_, i) => `skeleton-${i}`).map((key) => (
            <div className="rounded-md bg-muted/40 p-3" key={key}>
              <div className="flex items-start justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>

              <div className="mt-2 flex justify-between">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
