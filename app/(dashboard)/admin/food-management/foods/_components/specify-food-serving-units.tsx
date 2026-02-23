'use client';

import { useState } from 'react';

interface Props {
  name: string;
}

export function SpecifyFoodServingUnits({ name }: Props) {
  const [item, setItem] = useState(null);

  return (
    <div>
      <p>SpecifyFoodServingUnits</p>
    </div>
  );
}
