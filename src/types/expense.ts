export interface CreateExpenseData {
  amount: number;
  description: string;
  date: string;
  categoryId: string;
}

export interface UpdateExpenseData extends CreateExpenseData {
  id: string;
}

export interface ExpenseFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ExpenseFormData {
  amount: string;
  description: string;
  date: string;
  categoryId: string;
}
