// ==========================================
// API CLIENT - src/lib/api-client.ts
// ==========================================
import {
  Expense,
  Category,
  MonthlyAnalytics,
  ExpenseListResponse,
} from "@/types";

const API_BASE = "/api";

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async register(data: { name: string; email: string; password: string }) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Expense methods
  async getExpenses(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ExpenseListResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    return this.request(`/expenses${query ? `?${query}` : ""}`);
  }

  async getExpenseById(id: string): Promise<{ expense: Expense }> {
    return this.request(`/expenses/${id}`);
  }

  async createExpense(data: {
    amount: number;
    description: string;
    date: string;
    categoryId: string;
  }): Promise<{ expense: Expense }> {
    return this.request("/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateExpense(
    id: string,
    data: {
      amount: number;
      description: string;
      date: string;
      categoryId: string;
    },
  ): Promise<{ expense: Expense }> {
    return this.request(`/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteExpense(id: string): Promise<{ message: string }> {
    return this.request(`/expenses/${id}`, {
      method: "DELETE",
    });
  }

  async bulkDeleteExpenses(ids: string[]): Promise<{ message: string }> {
    return this.request("/expenses/bulk", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
  }

  // Category methods
  async getCategories(): Promise<{ categories: Category[] }> {
    return this.request("/categories");
  }

  async getCategoryById(id: string): Promise<{ category: Category }> {
    return this.request(`/categories/${id}`);
  }

  async createCategory(data: {
    name: string;
    color: string;
    icon: string;
  }): Promise<{ category: Category }> {
    return this.request("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCategory(
    id: string,
    data: {
      name: string;
      color: string;
      icon: string;
    },
  ): Promise<{ category: Category }> {
    return this.request(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<{ message: string }> {
    return this.request(`/categories/${id}`, {
      method: "DELETE",
    });
  }

  // Analytics methods
  async getMonthlyAnalytics(
    month?: number,
    year?: number,
  ): Promise<MonthlyAnalytics> {
    const params = new URLSearchParams();
    if (month) params.append("month", month.toString());
    if (year) params.append("year", year.toString());

    const query = params.toString();
    return this.request(`/analytics/monthly${query ? `?${query}` : ""}`);
  }

  async getCategoryAnalytics(
    startDate?: string,
    endDate?: string,
  ): Promise<{
    categoryBreakdown: Record<
      string,
      { total: number; count: number; color: string }
    >;
  }> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const query = params.toString();
    return this.request(`/analytics/categories${query ? `?${query}` : ""}`);
  }

  async getSpendingTrends(months?: number): Promise<{
    trends: Array<{ month: string; amount: number }>;
  }> {
    const params = new URLSearchParams();
    if (months) params.append("months", months.toString());

    const query = params.toString();
    return this.request(`/analytics/trends${query ? `?${query}` : ""}`);
  }

  async getDashboardSummary(): Promise<{
    totalExpenses: number;
    totalAmount: number;
    thisMonthAmount: number;
    lastMonthAmount: number;
    topCategories: Array<{
      name: string;
      amount: number;
      icon: string;
      color: string;
    }>;
    recentExpenses: Expense[];
  }> {
    return this.request("/analytics/summary");
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export the class for testing purposes
export { ApiClient };
