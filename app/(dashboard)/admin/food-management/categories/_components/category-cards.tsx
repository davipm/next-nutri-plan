'use client';

import { useQuery } from '@tanstack/react-query';
import { CategoryCard } from '@/app/(dashboard)/admin/food-management/categories/_components/category-card';
import { CardSkeleton } from '@/components/card-skeleton';
import { HasError } from '@/components/has-error';
import { NoItemFound } from '@/components/no-item-found';
import { orpc } from '@/lib/orpc';
import { openCreateCategoryDialog } from '@/store/use-categories-store';

export function CategoryCards() {
  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery(orpc.categories.list.queryOptions());

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <HasError refetchAction={refetch} isRefetching={isRefetching} />;
  }

  if (!data.length) {
    return <NoItemFound onClick={() => openCreateCategoryDialog()} />;
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
      {data.map((category) => (
        <CategoryCard key={category.id} {...category} />
      ))}
    </div>
  );
}
