export namespace Pqp {
  export type Rates = {
    "Category A": number;
    "Category B": number;
    "Category C": number;
    "Category D": number;
  };

  export interface TrendPoint {
    month: string;
    "Category A": number;
    "Category B": number;
    "Category C": number;
    "Category D": number;
  }

  export interface Comparison {
    category: string;
    latestPremium: number;
    pqpRate: number;
    difference: number;
    differencePercent: number;
  }

  export interface CategorySummary {
    category: string;
    coePremium: number;
    pqpRate: number;
    difference: number;
    differencePercent: number;
    pqpCost5Year: number;
    pqpCost10Year: number;
    savings5Year: number;
    savings10Year: number;
  }

  export interface RenewalRecord {
    category: keyof Rates;
    pqpRate: number;
    coePremium: number;
    pqpCost5Year: number;
    pqpCost10Year: number;
    pqpSavings5Year: number;
    pqpSavings10Year: number;
    recommendation: string;
  }

  export interface TableRow extends Rates {
    key: string;
    month: string;
  }

  export interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
  }

  export interface Overview {
    latestMonth: string | null;
    tableRows: TableRow[];
    trendData: TrendPoint[];
    comparison: Comparison[];
    categorySummaries: CategorySummary[];
  }

  export type MonthlyRates = Record<string, Rates>;
}
