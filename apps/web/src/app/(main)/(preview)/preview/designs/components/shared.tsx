/**
 * Shared preview utilities and mock data for design previews
 */

export const MOCK_DATA = {
  totalRegistrations: 4523,
  monthlyChange: 12.5,
  topMake: "Toyota",
  coeCategories: [
    { category: "Category A", premium: 106000, change: 2.3 },
    { category: "Category B", premium: 150001, change: -1.2 },
    { category: "Category C", premium: 76000, change: 5.1 },
    { category: "Category D", premium: 12500, change: -3.4 },
    { category: "Category E", premium: 150001, change: 0.8 },
  ],
  chartData: [
    { month: "Jul", value: 3200 },
    { month: "Aug", value: 3800 },
    { month: "Sep", value: 4100 },
    { month: "Oct", value: 3900 },
    { month: "Nov", value: 4300 },
    { month: "Dec", value: 4523 },
  ],
  tableData: [
    {
      make: "Toyota",
      registrations: 892,
      share: "19.7%",
      trend: "up" as const,
    },
    { make: "BMW", registrations: 654, share: "14.5%", trend: "up" as const },
    {
      make: "Mercedes-Benz",
      registrations: 598,
      share: "13.2%",
      trend: "down" as const,
    },
    { make: "Honda", registrations: 487, share: "10.8%", trend: "up" as const },
    {
      make: "Mazda",
      registrations: 356,
      share: "7.9%",
      trend: "down" as const,
    },
  ],
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-SG").format(value);
}
