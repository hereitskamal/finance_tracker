"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { apiClient } from "@/lib/api-client";
import { formatCurrencyInr, formatDate } from "@/lib/utils";
import { Expense } from "@/types";
import { Plus, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecentExpenses();
  }, []);

  const loadRecentExpenses = async () => {
    try {
      setError(null);
      const response = await apiClient.getExpenses({ limit: 4 });
      setRecentExpenses(response.expenses);
    } catch (error) {
      console.error("Failed to load recent expenses:", error);
      setError("Failed to load recent expenses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12 lg:space-y-16">
      {/* Responsive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1 sm:mt-2 font-light text-sm sm:text-base">
            <span className="hidden sm:inline">Today, </span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        <Link href="/expenses/add">
          <Button
            size="default"
            className="bg-black hover:bg-gray-800 text-white rounded-full px-6 sm:px-8 py-2 sm:py-3 font-medium w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="sm:hidden">Add</span>
            <span className="hidden sm:inline">Add Expense</span>
          </Button>
        </Link>
      </div>

      {/* Responsive Stats */}
      <DashboardStats />

      {/* Responsive Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
        {/* Recent Expenses - Full width on mobile, 8 cols on xl */}
        <div className="xl:col-span-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-medium text-gray-900">
              Recent Activity
            </h2>
            <Link
              href="/expenses"
              className="text-sm text-gray-500 hover:text-gray-900 font-medium flex items-center group"
            >
              <span className="hidden sm:inline">View all</span>
              <span className="sm:hidden">All</span>
              <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4 sm:space-y-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-4 sm:py-6 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full animate-pulse" />
                    <div>
                      <div className="h-3 sm:h-4 bg-gray-100 rounded w-24 sm:w-32 mb-2 animate-pulse" />
                      <div className="h-2 sm:h-3 bg-gray-100 rounded w-16 sm:w-24 animate-pulse" />
                    </div>
                  </div>
                  <div className="h-4 sm:h-5 bg-gray-100 rounded w-12 sm:w-16 animate-pulse" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 sm:py-16">
              <p className="text-gray-500 mb-4 text-sm sm:text-base">{error}</p>
              <Button
                onClick={loadRecentExpenses}
                variant="outline"
                className="rounded-full px-4 sm:px-6"
                size="sm"
              >
                Try Again
              </Button>
            </div>
          ) : recentExpenses.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 mb-4 text-sm sm:text-base">
                No expenses recorded yet
              </p>
              <Link href="/expenses/add">
                <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-4 sm:px-6">
                  Add your first expense
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-0">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="group flex items-center justify-between py-4 sm:py-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 -mx-2 sm:-mx-4 px-2 sm:px-4 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center text-base sm:text-lg flex-shrink-0">
                      {expense.categories?.icon || "📝"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 mb-1 text-sm sm:text-base truncate">
                        {expense.description}
                      </p>
                      <div className="text-xs sm:text-sm text-gray-500 flex flex-col sm:flex-row sm:space-x-3">
                        <span className="truncate">
                          {expense.categories?.name || "Unknown"}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="mt-1 sm:mt-0">
                          {formatDate(expense.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm sm:text-lg ml-2 flex-shrink-0">
                    {formatCurrencyInr(expense.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions - Full width on mobile, 4 cols on xl */}
        <div className="xl:col-span-4">
          <h2 className="text-lg sm:text-xl font-medium text-gray-900 mb-6 sm:mb-8">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
            {/* Add Expense */}
            <Link
              href="/expenses/add"
              className="block p-4 sm:p-6 border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
                    Add Expense
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Record new transaction
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0" />
              </div>
            </Link>

            {/* Analytics */}
            <Link
              href="/analytics"
              className="block p-4 sm:p-6 border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
                    Analytics
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    View spending insights
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0" />
              </div>
            </Link>

            {/* Categories */}
            <Link
              href="/categories"
              className="block p-4 sm:p-6 border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-sm transition-all group sm:col-span-2 xl:col-span-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
                    Categories
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Organize expenses
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
