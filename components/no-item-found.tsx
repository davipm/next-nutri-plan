import { CircleOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

type NoItemsFoundProps = {
  onClick: () => void;
};

export function NoItemFound({ onClick }: NoItemsFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <CircleOff className="text-primary mb-2" aria-hidden="true" />
      <h3 className="text-lg font-medium">No items found</h3>
      <p className="text-foreground/60 mt-1 text-sm">Try add new items</p>
      <Button variant="outline" className="mt-4" onClick={onClick} aria-label="Add new item">
        Add new item
      </Button>
    </div>
  );
}
