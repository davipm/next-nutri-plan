'use client';

import { X } from 'lucide-react';
import { Controller, type FieldValues, type Path, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ValueLabel = {
  value: string | number;
  label: string;
};

type SelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  options?: ValueLabel[];
  placeholder?: string;
  clearable?: boolean;
};

export const ControlledSelect = <T extends FieldValues>({
  label,
  name,
  options = [],
  placeholder,
  clearable,
}: SelectProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ...restField }, fieldState: { error } }) => (
        <div className="grid w-full items-center gap-1.5">
          {label && <label htmlFor={name}>{label}</label>}
          <Select onValueChange={onChange} value={value?.toString()} {...restField}>
            <div className="relative">
              <SelectTrigger id={name} className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              {clearable && value && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground/40 hover:bg-accent/0 absolute right-8 top-1/2 h-4 w-4 -translate-y-1/2"
                  onClick={() => onChange('')}
                  aria-label="Clear selection"
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{label}</SelectLabel>
                {options?.map((item) => (
                  <SelectItem key={item.value} value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </div>
      )}
    />
  );
};
