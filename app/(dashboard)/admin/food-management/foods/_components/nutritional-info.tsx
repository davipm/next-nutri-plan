interface Props {
  label: string;
  unit: string;
  value: number | null;
}

export function NutritionalInfo({ label, value, unit }: Props) {
  return (
    <div>
      <p className="font-normal text-foreground/60 text-sm">{label}</p>
      <p className="font-medium text-sm">{value ? `${value} ${unit}` : 'N/A'}</p>
    </div>
  );
}
