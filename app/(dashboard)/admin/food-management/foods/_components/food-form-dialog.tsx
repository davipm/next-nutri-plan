'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePlus, Plus, UtensilsCrossed } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { CategoryFormDialog } from '@/app/(dashboard)/admin/food-management/categories/_components/category-form-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { nutritionalFields } from '@/lib/constants';
import { type BaseFoodSchema, baseFoodSchema } from '@/server/modules/food/food.schema';

export function FoodFormDialog() {
  const form = useForm<BaseFoodSchema>({
    defaultValues: {
      foodServingUnits: [],
      name: '',
      categoryId: 0,
      calories: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      protein: 0,
      sugar: 0,
    },
    resolver: zodResolver(baseFoodSchema),
  });

  const onSubmit: SubmitHandler<BaseFoodSchema> = (data) => {
    console.log({ data });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" /> Create Food
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="flex flex-row items-center justify-between pr-3">
          <DialogTitle>Create a New Food</DialogTitle>
          <CategoryFormDialog smallTrigger />
        </DialogHeader>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <FieldGroup className="col-span-1 grid">
              <Field>
                <Input id="name-1" name="name" placeholder="Enter food name" />
              </Field>
            </FieldGroup>

            <FieldGroup className="col-span-1 grid">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FieldGroup>

            {nutritionalFields.map((field) => (
              <FieldGroup key={field.name}>
                <Field key={field.name}>
                  <Input
                    id={field.name}
                    name={field.label}
                    placeholder={field.placeholder}
                    type={field.type}
                  />
                </Field>
              </FieldGroup>
            ))}

            <div className="col-span-2">
              <div className="flex flex-col gap-4 rounded-md p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">Serving Units</h3>
                  <Button
                    className="flex items-center gap-1"
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <CirclePlus className="size-4" /> Add Serving Unit
                  </Button>
                </div>

                <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-6 text-center text-muted-foreground">
                  <UtensilsCrossed className="mb-2 size-10 opacity-50" />
                  <p>No serving units added yet</p>
                  <p className="text-sm">Add serving units to help users measure this food</p>
                </div>
              </div>
            </div>
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
