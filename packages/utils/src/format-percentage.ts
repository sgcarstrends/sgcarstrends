export const formatPercentage = (value: number, fractionDigits = 2) =>
  Number(
    new Intl.NumberFormat("en-SG", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value),
  );
