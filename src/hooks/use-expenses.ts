// ==========================================
// HOOKS - src/hooks/use-expenses.ts
// ==========================================
"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import {
  Expense,
  ExpenseFilters,
  CreateExpenseData,
} from "@/types";

export function useExpenses(filters?: ExpenseFilters) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const loadExpenses = async (newFilters?: ExpenseFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getExpenses({
        ...filters,
        ...newFilters,
      });
      setExpenses(response.expenses);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expenses");
    } finally {
      setIsLoading(false);
    }
  };

  const createExpense = async (data: CreateExpenseData) => {
    try {
      await apiClient.createExpense(data);
      loadExpenses(); // Reload expenses
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create expense");
      return false;
    }
  };

  const updateExpense = async (id: string, data: CreateExpenseData) => {
    try {
      await apiClient.updateExpense(id, data);
      loadExpenses(); // Reload expenses
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update expense");
      return false;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await apiClient.deleteExpense(id);
      loadExpenses(); // Reload expenses
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete expense");
      return false;
    }
  };

  useEffect(() => {
    loadExpenses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    expenses,
    isLoading,
    error,
    pagination,
    loadExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    refetch: () => loadExpenses(),
  };
}
