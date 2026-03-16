import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const FOODS_PAGINATION_HREF = '/admin/food-management/foods' as const;

type PaginationEntry = number | 'ellipsis-start' | 'ellipsis-end';

interface FoodPaginationProps {
  currentPage: number;
  onPageChange: (page: 'next' | 'prev' | number) => void;
  totalPages: number;
}

const getPaginationEntries = (currentPage: number, totalPages: number): PaginationEntry[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
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

export function FoodPagination({ currentPage, totalPages, onPageChange }: FoodPaginationProps) {
  const entries = getPaginationEntries(currentPage, totalPages);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    page: 'next' | 'prev' | number,
    disabled = false
  ) => {
    event.preventDefault();
    if (!disabled) {
      onPageChange(page);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : undefined}
            href={FOODS_PAGINATION_HREF}
            onClick={(e) => handleClick(e, 'prev', currentPage === 1)}
            tabIndex={currentPage === 1 ? -1 : undefined}
          />
        </PaginationItem>

        {entries.map((entry) => (
          <PaginationItem key={entry}>
            {typeof entry === 'number' ? (
              <PaginationLink
                href={FOODS_PAGINATION_HREF}
                isActive={currentPage === entry}
                onClick={(e) => handleClick(e, entry)}
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
            aria-disabled={currentPage === totalPages}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : undefined}
            href={FOODS_PAGINATION_HREF}
            onClick={(e) => handleClick(e, 'next', currentPage === totalPages)}
            tabIndex={currentPage === totalPages ? -1 : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
