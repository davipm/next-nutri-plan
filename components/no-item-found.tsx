import { CircleOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

type NoItemsFoundProps = {
  onClick: () => void;
};

export function NoItemFound({ onClick }: NoItemsFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <CircleOff aria-hidden="true" className="mb-2 text-primary" />
      <h3 className="font-medium text-lg">No items found</h3>
      <p className="mt-1 text-foreground/60 text-sm">Try add new items</p>
      <Button aria-label="Add new item" className="mt-4" onClick={onClick} variant="outline">
        Add new item
      </Button>
    </div>
  );
}
