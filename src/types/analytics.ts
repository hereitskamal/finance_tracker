export interface CategoryBreakdown {
  total: number;
  count: number;
  color: string;
}

export interface SpendingTrend {
  date: string;
  amount: number;
}

export interface DashboardSummary {
  totalExpenses: number;
  totalAmount: number;
  avgPerDay: number;
  categoriesCount: number;
  thisMonthAmount: number;
  lastMonthAmount: number;
  changePercentage: number;
}

export interface AnalyticsDateRange {
  startDate: string;
  endDate: string;
}
