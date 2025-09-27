import { formatCurrency } from "@web/utils/format-currency";

interface CurrencyProps {
  value: number;
}

export const Currency = ({ value }: CurrencyProps) => {
  return <span>{formatCurrency(value)}</span>;
};
