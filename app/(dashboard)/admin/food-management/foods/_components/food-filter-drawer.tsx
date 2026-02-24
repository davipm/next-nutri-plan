'use client';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';

export function FoodFilterDrawer() {
  return (
    <Drawer direction="right">
      <div className="flex gap-2">
        <Input type="text" name="searchTerm" placeholder="Quick Search" className="max-w-48" />
        <DrawerTrigger asChild>
          <Button>Filter</Button>
        </DrawerTrigger>
      </div>

      <DrawerContent>
        <form></form>
      </DrawerContent>
    </Drawer>
  );
}
