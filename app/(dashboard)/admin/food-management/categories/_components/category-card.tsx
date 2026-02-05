'use client';

import { useState } from 'react';

type Props = {
  id: number;
  name: string;
};

export function CategoryCard({ name, id }: Props) {
  const [item, setItem] = useState(null);

  const handleEdit = () => {};

  const handleDelete = () => {};

  return (
    <div className="flex flex-col">
      <p></p>
    </div>
  );
}
