import { formatCurrency } from "@sgcarstrends/utils";

interface CurrencyProps {
  value: number;
}

export function Currency({ value }: CurrencyProps) {
  return <span>{formatCurrency(value)}</span>;
}
