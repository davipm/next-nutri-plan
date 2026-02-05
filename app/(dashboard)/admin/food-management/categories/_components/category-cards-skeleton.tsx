'use client';

import { useState } from 'react';

type Props = {
  name: string;
};

export function CategoryCardsSkeleton({ name }: Props) {
  const [item, setItem] = useState(null);

  return (
    <div>
      <p></p>
    </div>
  );
}
