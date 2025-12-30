import { formatCurrency } from "@web/utils/format-currency";

interface CurrencyProps {
  value: number;
}

export function Currency({ value }: CurrencyProps) {
  return <span>{formatCurrency(value)}</span>;
}
