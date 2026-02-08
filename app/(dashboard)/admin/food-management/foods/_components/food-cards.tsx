'use client';

import { useQuery } from '@tanstack/react-query';
import { Edit } from 'lucide-react';
import { Activity } from 'react';
import { FoodCardsSkeleton } from '@/app/(dashboard)/admin/food-management/foods/_components/food-cards-skeleton';
import { HasError } from '@/components/has-error';
import { NoItemFound } from '@/components/no-item-found';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { orpc } from '@/lib/orpc';
import { useFoodsStore } from '@/store/use-food-store';

export function FoodCards() {
  const { foodFilters, updateSelectedFoodId, updateFoodDialogOpen, updateFoodFilterPage } =
    useFoodsStore();

  const { data, isLoading, isError, ...rest } = useQuery(
    orpc.foods.list.queryOptions({ input: foodFilters }),
  );

  const handleEdit = (id: number) => {
    updateSelectedFoodId(id);
    updateFoodDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <FoodCardsSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <HasError refetchAction={rest.refetch} isRefetching={rest.isRefetching} />;
  }

  if (!data?.data.length) {
    return <NoItemFound onClick={() => updateFoodDialogOpen(true)} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-4">
        {data.data.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 rounded-lg border p-6">
            <div className="flex justify-between">
              <p className="truncate">{item.name}</p>
              <div className="flex gap-1">
                <Button>
                  <Edit />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Activity mode={data.totalPages > 1 ? 'visible' : 'hidden'}>
        <Pagination
          currentPage={foodFilters.page}
          totalPages={data.totalPages}
          updatePage={updateFoodFilterPage}
        />
      </Activity>
    </div>
  );
}
