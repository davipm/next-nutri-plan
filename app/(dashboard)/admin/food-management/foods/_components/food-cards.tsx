'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash } from 'lucide-react';
import { Activity, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { FoodCardsSkeleton } from '@/app/(dashboard)/admin/food-management/foods/_components/food-cards-skeleton';
import { NutritionalInfo } from '@/app/(dashboard)/admin/food-management/foods/_components/nutritional-info';
import { HasError } from '@/components/has-error';
import { NoItemFound } from '@/components/no-item-found';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import { orpc } from '@/lib/orpc';
import {
  closeFoodDialog,
  openFoodDialog,
  openFoodEditDialog,
  useFoodFilterActions,
  useFoodFilters,
} from '@/store/use-food-store';

type PaginationEntry = number | 'ellipsis-start' | 'ellipsis-end';

const FOODS_PAGINATION_HREF = '/admin/food-management/foods' as const;

const getPaginationEntries = (currentPage: number, totalPages: number): PaginationEntry[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage < 5) {
    return [1, 2, 3, 4, 5, 'ellipsis-end', totalPages];
  }

  if (currentPage > totalPages - 4) {
    return [
      1,
      'ellipsis-start',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    'ellipsis-start',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis-end',
    totalPages,
  ];
};

const useScrollToTopOnPaginate = (page: number) => {
  const previousPage = useRef(page);

  useEffect(() => {
    if (previousPage.current !== page) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    previousPage.current = page;
  }, [page]);
};

export function FoodCards() {
  const queryClient = useQueryClient();

  const foodFilters = useFoodFilters();
  const { setPage } = useFoodFilterActions();

  useScrollToTopOnPaginate(foodFilters.page);

  const { data, isLoading, isError, ...rest } = useQuery(
    orpc.foods.list.queryOptions({ input: foodFilters })
  );

  const { mutate: deleteFoodMutation, isPending } = useMutation(
    orpc.foods.delete.mutationOptions({
      onSuccess: async () => {
        closeFoodDialog();
        toast.success('Food deleted successfully.');
        await queryClient.invalidateQueries({ queryKey: orpc.foods.key({ type: 'query' }) });
      },
    })
  );

  const handleEdit = (id: number) => {
    openFoodEditDialog(id);
  };

  const handlePageChange = (page: 'next' | 'prev' | number) => {
    if (typeof page === 'number' && page === foodFilters.page) {
      return;
    }

    setPage(page);
  };

  const handlePaginationClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    page: 'next' | 'prev' | number,
    disabled = false
  ) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    handlePageChange(page);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 12 }, (_, i) => `skeleton-${i}`).map((key) => (
          <FoodCardsSkeleton key={key} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <HasError isRefetching={rest.isRefetching} refetchAction={rest.refetch} />;
  }

  if (!data?.data.length) {
    return <NoItemFound onClick={openFoodDialog} />;
  }

  const paginationEntries =
    data.totalPages > 1 ? getPaginationEntries(foodFilters.page, data.totalPages) : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-4">
        {data.data.map((item) => (
          <div className="flex flex-col gap-3 rounded-lg border p-6" key={item.id}>
            <div className="flex justify-between">
              <p className="truncate">{item.name}</p>
              <div className="flex gap-1">
                <Button
                  className="size-6"
                  onClick={() => handleEdit(item.id)}
                  size="icon"
                  variant="ghost"
                >
                  <Edit />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="size-6" size="icon" variant="ghost">
                      <Trash />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Food Item</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &ldquo;{item.name}
                        &rdquo;? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        aria-label="Confirm delete food"
                        className="bg-destructive text-destructive hover:bg-destructive/90"
                        disabled={isPending}
                        onClick={() => deleteFoodMutation({ id: item.id })}
                      >
                        {isPending ? 'Deleting...' : 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-5">
              <NutritionalInfo label="Calories" unit="kcal" value={item.calories} />
              <NutritionalInfo label="Carbohydrates" unit="g" value={item.carbohydrates} />
              <NutritionalInfo label="Protein" unit="g" value={item.protein} />
              <NutritionalInfo label="Fat" unit="g" value={item.fat} />
            </div>
          </div>
        ))}
      </div>

      <Activity mode={data.totalPages > 1 ? 'visible' : 'hidden'}>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={foodFilters.page === 1}
                className={foodFilters.page === 1 ? 'pointer-events-none opacity-50' : undefined}
                href={FOODS_PAGINATION_HREF}
                onClick={(event) => handlePaginationClick(event, 'prev', foodFilters.page === 1)}
                tabIndex={foodFilters.page === 1 ? -1 : undefined}
              />
            </PaginationItem>

            {paginationEntries.map((entry) => (
              <PaginationItem key={entry}>
                {typeof entry === 'number' ? (
                  <PaginationLink
                    href={FOODS_PAGINATION_HREF}
                    isActive={foodFilters.page === entry}
                    onClick={(event) => handlePaginationClick(event, entry)}
                  >
                    {entry}
                  </PaginationLink>
                ) : (
                  <PaginationEllipsis />
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                aria-disabled={foodFilters.page === data.totalPages}
                className={
                  foodFilters.page === data.totalPages
                    ? 'pointer-events-none opacity-50'
                    : undefined
                }
                href={FOODS_PAGINATION_HREF}
                onClick={(event) =>
                  handlePaginationClick(event, 'next', foodFilters.page === data.totalPages)
                }
                tabIndex={foodFilters.page === data.totalPages ? -1 : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Activity>
    </div>
  );
}
