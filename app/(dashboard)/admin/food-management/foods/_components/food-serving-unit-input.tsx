'use client';

import { useState } from 'react';

interface Props {
  name: string;
}

export function FoodServingUnitInput({ name }: Props) {
  const [item, setItem] = useState(null);

  return (
    <div>
      <p>FoodServingUnitInput</p>
    </div>
  );
}
