'use client';

interface Props {
  smallTrigger?: boolean;
}

export function MealFormDialog({ smallTrigger }: Props) {
  return (
    <div>
      <p>{smallTrigger}</p>
    </div>
  );
}
