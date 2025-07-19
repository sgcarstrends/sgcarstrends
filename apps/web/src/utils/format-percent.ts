export const formatPercent = (
  value: number | bigint,
  options?: Intl.NumberFormatOptions | undefined,
) => {
  return new Intl.NumberFormat("en-SG", {
    style: "percent",
    ...options,
  }).format(value);
};
