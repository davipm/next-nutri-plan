import { Plus } from 'lucide-react';
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
import {
  CategoryFormDialog
} from '@/app/(dashboard)/admin/food-management/categories/_components/category-form-dialog';

export function FoodFormDialog() {
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
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FieldGroup className="col-span-1 grid">
              <Field>
                <Input id="name-1" name="name" placeholder="Enter food name" />
              </Field>
            </FieldGroup>

            <FieldGroup className="col-span-1 grid">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Theme" />
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
          </div>


          <FieldGroup>
            <Field>
              <Input defaultValue="Pedro Duarte" id="name-1" name="name" />
            </Field>
            <Field>
              <Input defaultValue="@peduarte" id="username-1" name="username" />
            </Field>
          </FieldGroup>
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
