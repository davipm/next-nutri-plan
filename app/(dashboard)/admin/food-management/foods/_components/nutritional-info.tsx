interface Props {
  label: string;
  unit: string;
  value: number | null;
}

export function NutritionalInfo({ label, value, unit }: Props) {
  return (
    <div>
      <p>NutritionalInfo</p>
    </div>
  );
}
