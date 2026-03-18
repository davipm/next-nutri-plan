'use client';

import { Edit, X } from 'lucide-react';
import { type Control, Controller, useFieldArray } from 'react-hook-form';
import type { z } from 'zod';
import { FoodEmpty } from '@/app/(dashboard)/admin/food-management/foods/_components/food-empty';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { baseFoodSchema } from '@/server/modules/food/food.schema';
import { openEditServingUnitDialog } from '@/store/use-serving-unit-store';

type FoodFormValues = z.input<typeof baseFoodSchema>;

interface Props {
  control: Control<FoodFormValues>;
  foodServingUnitsValues: { servingUnitId: number | null; grams: number }[];
  isEditLoading: boolean;
  isPending: boolean;
  selectedServingUnitIds: Set<number>;
  servingUnits: { id: number; name: string }[];
}

export function FoodServingUnit({
  control,
  foodServingUnitsValues,
  selectedServingUnitIds,
  isPending,
  isEditLoading,
  servingUnits,
}: Props) {
  const { fields, remove } = useFieldArray({
    control,
    name: 'foodServingUnits',
    keyName: 'id',
  });

  if (!fields) {
    return <FoodEmpty />;
  }

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-3" key={field.id}>
          <FieldGroup className="col-span-1 flex items-end">
            <Controller
              control={control}
              name={`foodServingUnits.${index}.servingUnitId`}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Select
                    name={field.name}
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : undefined}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid} id={field.name}>
                      <SelectValue placeholder="Select a serving unit..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Serving Units</SelectLabel>
                        {servingUnits.length === 0 ? (
                          <SelectItem disabled value="__empty__">
                            No serving units found
                          </SelectItem>
                        ) : (
                          servingUnits.map((units) => {
                            const currentServingUnitId =
                              foodServingUnitsValues[index]?.servingUnitId ?? 0;
                            const isAlreadySelectedElsewhere =
                              selectedServingUnitIds.has(units.id) &&
                              units.id !== currentServingUnitId;

                            return (
                              <SelectItem
                                disabled={isAlreadySelectedElsewhere}
                                key={units.id}
                                value={String(units.id)}
                              >
                                {units.name}
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <div>
            <Controller
              control={control}
              name={`foodServingUnits.${index}.grams`}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    aria-invalid={fieldState.invalid}
                    id={field.name}
                    inputMode="decimal"
                    onBlur={field.onBlur}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? 0 : Number(e.target.value))
                    }
                    placeholder="Grams per unit"
                    ref={field.ref}
                    step="any"
                    type="number"
                    value={field.value > 0 ? field.value : ''}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-1">
            <Button
              aria-label="Edit serving unit"
              className="size-9"
              disabled={!foodServingUnitsValues[index]?.servingUnitId}
              onClick={() => {
                const servingUnitId = foodServingUnitsValues[index]?.servingUnitId;
                if (servingUnitId) {
                  openEditServingUnitDialog(servingUnitId);
                }
              }}
              size="icon"
              title="Edit serving unit"
              type="button"
              variant="ghost"
            >
              <Edit className="size-4" />
            </Button>
            <Button
              aria-label="Remove serving unit row"
              className="size-9"
              disabled={isPending || isEditLoading}
              onClick={() => remove(index)}
              size="icon"
              title="Remove row"
              type="button"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
