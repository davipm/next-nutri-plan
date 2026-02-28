import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PaginationProps {
  className?: string;
  currentPage: number;
  scrollToTopOnPaginate?: boolean;
  totalPages: number | undefined;
  updatePage: (action: 'next' | 'prev' | number) => void;
}

const useScrollToTopOnPaginate = (currentPage: number, enabled: boolean) => {
  const prevPageRef = useRef(currentPage);

  useEffect(() => {
    if (enabled && prevPageRef.current !== currentPage) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    prevPageRef.current = currentPage;
  }, [currentPage, enabled]);
};

/**
 * Calculate pagination pages to display
 * Hoisted outside component to avoid recreation on every render
 */
const calculatePages = (currentPage: number, totalPages: number): (number | 'ellipsis')[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage < 5) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
  }
  if (currentPage > totalPages - 4) {
    return [
      1,
      'ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
};

// Static skeleton array to avoid recreation
const SKELETON_ITEMS = [
  { className: 'h-9 w-24', key: 'prev' },
  { className: 'h-9 w-9', key: '1' },
  { className: 'h-9 w-9', key: '2' },
  { className: 'h-9 w-9', key: '3' },
  { className: 'h-9 w-24', key: 'next' },
] as const;

/**
 * Renders a pagination component for navigating between pages.
 */
export function Pagination({
  currentPage,
  totalPages,
  updatePage,
  className,
  scrollToTopOnPaginate = true,
}: PaginationProps) {
  useScrollToTopOnPaginate(currentPage, scrollToTopOnPaginate);

  // Optimize: Calculate derived state during rendering (5.1)
  // Avoid useMemo for simple derived values (5.3)
  const pages = totalPages ? calculatePages(currentPage, totalPages) : [];
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages || !totalPages;

  // Early return for loading state (7.8)
  if (totalPages === undefined) {
    return (
      <div className="flex justify-center">
        <div className="flex items-center gap-1">
          {SKELETON_ITEMS.map(({ className, key }) => (
            <Skeleton className={className} key={key} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <nav
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      data-slot="pagination"
    >
      <ul className="flex flex-row items-center gap-1">
        <li>
          <button
            aria-label="Go to previous page"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                size: 'default',
              }),
              'gap-1 px-2.5 sm:pl-2.5',
              isPrevDisabled && 'pointer-events-none opacity-50'
            )}
            disabled={isPrevDisabled}
            onClick={() => updatePage('prev')}
            type="button"
          >
            <ChevronLeftIcon />
            <span className="hidden sm:block">Previous</span>
          </button>
        </li>

        {pages.map((page, index) => (
          <li
            data-slot="pagination-ellipses"
            key={`${page}-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              index
            }`}
          >
            {page === 'ellipsis' ? (
              <span
                aria-hidden
                className="flex size-9 items-center justify-center"
                data-slot="pagination-ellipsis"
              >
                <MoreHorizontalIcon className="size-4" />
                <span className="sr-only">More pages</span>
              </span>
            ) : (
              <button
                aria-current={currentPage === page ? 'page' : undefined}
                className={cn(
                  buttonVariants({
                    variant: currentPage === page ? 'outline' : 'ghost',
                    size: 'icon',
                  })
                )}
                data-active={currentPage === page}
                onClick={() => updatePage(page as number)}
                type="button"
              >
                {page}
              </button>
            )}
          </li>
        ))}

        <li>
          <button
            aria-label="Go to next page"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                size: 'default',
              }),
              'gap-1 px-2.5 sm:pr-2.5',
              isNextDisabled && 'pointer-events-none opacity-50'
            )}
            disabled={isNextDisabled}
            onClick={() => updatePage('next')}
            type="button"
          >
            <span className="hidden sm:block">Next</span>
            <ChevronRightIcon />
          </button>
        </li>
      </ul>
    </nav>
  );
}
