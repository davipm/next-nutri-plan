import { UtensilsCrossed } from 'lucide-react';

export function FoodEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-6 text-center text-muted-foreground">
      <UtensilsCrossed className="mb-2 size-10 opacity-50" />
      <p>No serving units added yet</p>
      <p className="text-sm">Add serving units to help users measure this food</p>
    </div>
  );
}
