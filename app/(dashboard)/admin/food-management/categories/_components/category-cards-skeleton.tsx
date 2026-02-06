import { Skeleton } from '@/components/ui/skeleton';

export function CategoryCardsSkeleton() {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-lg border p-6">
      <Skeleton className="h-5 w-24" />
      <div className="flex gap-1">
        <Skeleton className="size-6 rounded-md" />
        <Skeleton className="size-6 rounded-md" />
      </div>
    </div>
  );
}
