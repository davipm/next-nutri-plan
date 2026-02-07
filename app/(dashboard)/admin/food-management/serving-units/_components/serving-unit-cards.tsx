'use client';

import { useQuery } from '@tanstack/react-query';
import { ServingUnitCard } from '@/app/(dashboard)/admin/food-management/serving-units/_components/serving-unit-card';
import { ServingUnitSkeleton } from '@/app/(dashboard)/admin/food-management/serving-units/_components/serving-unit-cards-skeleton';
import { HasError } from '@/components/has-error';
import { NoItemFound } from '@/components/no-item-found';
import { orpc } from '@/lib/orpc';
import { openCreateServingUnitDialog } from '@/store/use-serving-unit-store';

export function ServingUnitCards() {
  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery(orpc['serving-units'].list.queryOptions());

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <ServingUnitSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <HasError refetchAction={refetch} isRefetching={isRefetching} />;
  }

  if (!data.length) {
    return <NoItemFound onClick={() => openCreateServingUnitDialog()} />;
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
      {data.map((servingUnit) => (
        <ServingUnitCard key={servingUnit.id} {...servingUnit} />
      ))}
    </div>
  );
}
