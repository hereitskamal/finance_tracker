"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { formatCurrencyInr, formatDate } from "@/lib/utils";
import { Expense, Category } from "@/types";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Calendar,
  Tag,
} from "lucide-react";

export function ExpenseList() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, selectedCategory]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [expensesResponse, categoriesResponse] = await Promise.all([
        apiClient.getExpenses({
          page,
          limit: 10,
          search: search || undefined,
          categoryId: selectedCategory || undefined,
        }),
        apiClient.getCategories(),
      ]);

      setExpenses(expensesResponse.expenses);
      setTotalPages(expensesResponse.pagination.pages);
      setCategories(categoriesResponse.categories);
    } catch (error) {
      console.error("Failed to load data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    setDeleteLoading(id);
    try {
      await apiClient.deleteExpense(id);
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error("Failed to delete expense:", error);
      setError("Failed to delete expense. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (expenseId: string) => {
    router.push(`/expenses/${expenseId}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Search and Filter Bar - Mobile responsive */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <Input
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 sm:pl-12 rounded-full border-gray-200 bg-gray-50/50 focus:bg-white transition-colors text-sm sm:text-base h-10 sm:h-12"
          />
        </div>

        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none bg-gray-50/50 border border-gray-200 rounded-full px-4 py-2 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base focus:outline-none focus:ring-0 focus:border-gray-900 focus:bg-white transition-colors w-full sm:w-auto min-w-[140px]"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
          <Filter className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-red-50 border border-red-100 rounded-2xl space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 font-medium text-sm sm:text-base">
              {error}
            </p>
          </div>
          <Button
            onClick={loadData}
            variant="outline"
            size="sm"
            className="rounded-full border-red-200 text-red-700 hover:bg-red-100 w-full sm:w-auto"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Expense List - Matching dashboard cards */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-4 sm:space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl sm:rounded-2xl animate-pulse" />
                    <div className="flex-1 min-w-0">
                      <div className="h-3 sm:h-4 bg-gray-100 rounded w-24 sm:w-32 mb-2 animate-pulse" />
                      <div className="h-2 sm:h-3 bg-gray-100 rounded w-16 sm:w-24 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="h-4 sm:h-6 bg-gray-100 rounded w-16 sm:w-20 animate-pulse" />
                    <div className="h-6 sm:h-8 bg-gray-100 rounded-full w-6 sm:w-8 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 mb-4 text-base sm:text-lg">
              {search || selectedCategory
                ? "No expenses match your search"
                : "No expenses found"}
            </p>
            {!search && !selectedCategory && (
              <Button
                onClick={() => router.push("/expenses/add")}
                className="bg-black hover:bg-gray-800 text-white rounded-full px-6 sm:px-8"
              >
                Add your first expense
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Expense Items - Mobile optimized */}
            <div className="divide-y divide-gray-50">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="group flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50/50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl group-hover:scale-105 transition-transform flex-shrink-0">
                      {expense.categories?.icon || "📝"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base truncate">
                        {expense.description}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0 sm:space-x-3">
                        <span className="flex items-center truncate">
                          <Tag className="w-3 h-3 mr-1 flex-shrink-0" />
                          {expense.categories?.name || "Unknown"}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                          {formatDate(expense.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                    <span className="font-bold text-gray-900 text-sm sm:text-lg">
                      {formatCurrencyInr(expense.amount)}
                    </span>

                    {/* Action Menu - Mobile responsive */}
                    <div className="flex items-center space-x-1 sm:space-x-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(expense.id)}
                        className="p-1.5 sm:p-2 hover:bg-blue-50 text-blue-600 rounded-lg sm:rounded-xl"
                      >
                        <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(expense.id)}
                        disabled={deleteLoading === expense.id}
                        className="p-1.5 sm:p-2 hover:bg-red-50 text-red-600 rounded-lg sm:rounded-xl"
                      >
                        {deleteLoading === expense.id ? (
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border border-red-300 border-t-red-600 rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination - Mobile optimized */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-t border-gray-50 bg-gray-50/30">
                <Button
                  variant="ghost"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="flex items-center justify-center space-x-2 rounded-full px-4 py-2 mb-4 sm:mb-0 order-2 sm:order-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>

                <div className="flex items-center justify-center space-x-2 sm:space-x-3 order-1 sm:order-2">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 rounded-full text-xs sm:text-sm ${
                          page === pageNum
                            ? "bg-black text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="ghost"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="flex items-center justify-center space-x-2 rounded-full px-4 py-2 mt-4 sm:mt-0 order-3"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
