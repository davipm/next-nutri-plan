import { Button } from '@/components/ui/button';

interface Props {
  isRefetching: boolean;
  message?: string;
  refetchAction: () => void;
}

export function HasError({ isRefetching, refetchAction, message = 'Failed to load data' }: Props) {
  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className="flex flex-col items-center justify-center space-y-4 py-12"
      role="alert"
    >
      <p>{message}</p>
      <Button
        aria-label="Retry fetching data"
        disabled={isRefetching}
        onClick={refetchAction}
        variant="outline"
      >
        {isRefetching ? 'Retrying...' : 'Try Again'}
      </Button>
    </div>
  );
}
