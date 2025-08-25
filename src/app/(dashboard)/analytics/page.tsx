"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { formatCurrencyInr } from "@/lib/utils";
import { MonthlyAnalytics } from "@/types";
import {
  Receipt,
  Calendar,
  PieChart,
  BarChart3,
  IndianRupee,
} from "lucide-react";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<MonthlyAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await apiClient.getMonthlyAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-12">
        {/* Header Skeleton */}
        <div>
          <div className="h-10 bg-gray-100 rounded w-48 mb-2 animate-pulse" />
          <div className="h-5 bg-gray-100 rounded w-64 animate-pulse" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-gray-100 p-8"
            >
              <div className="h-12 w-12 bg-gray-100 rounded-2xl mb-6 animate-pulse" />
              <div className="h-8 bg-gray-100 rounded w-24 mb-2 animate-pulse" />
              <div className="h-4 bg-gray-100 rounded w-16 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Category Breakdown Skeleton */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8">
          <div className="h-6 bg-gray-100 rounded w-48 mb-8 animate-pulse" />
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-100 rounded w-24 animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded w-20 animate-pulse" />
                </div>
                <div className="h-3 bg-gray-100 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-8 h-8 text-gray-300" />
        </div>
        <h2 className="text-2xl font-light text-gray-900 mb-2">
          No Analytics Available
        </h2>
        <p className="text-gray-500">
          Start tracking expenses to see your insights
        </p>
      </div>
    );
  }

  const categoryData = Object.entries(analytics.categoryBreakdown).map(
    ([name, data]) => ({ name, ...data }),
  );

  // Sort categories by total amount (descending)
  const sortedCategoryData = categoryData.sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-12">
      {/* Minimal Header */}
      <div>
        <h1 className="text-4xl font-light text-gray-900 tracking-tight mb-2">
          Analytics
        </h1>
        <p className="text-gray-500 font-light">
          Your spending insights for{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Total Spent */}
        <div className="group bg-white rounded-3xl border border-gray-100 p-8 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
              <IndianRupee className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                Total Spent
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-light text-gray-900 tracking-tight">
              {formatCurrencyInr(analytics.totalAmount)}
            </p>
            <p className="text-sm text-gray-500">This month</p>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="group bg-white rounded-3xl border border-gray-100 p-8 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-green-50 rounded-2xl group-hover:bg-green-100 transition-colors">
              <Receipt className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                Transactions
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-light text-gray-900 tracking-tight">
              {analytics.expenseCount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Total expenses</p>
          </div>
        </div>

        {/* Daily Average */}
        <div className="group bg-white rounded-3xl border border-gray-100 p-8 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                Daily Average
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-light text-gray-900 tracking-tight">
              {formatCurrencyInr(analytics.avgPerDay)}
            </p>
            <p className="text-sm text-gray-500">Per day</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        <div className="p-8 pb-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-purple-50 rounded-2xl">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-medium text-gray-900">
                Spending by Category
              </h2>
              <p className="text-gray-500 text-sm">
                Your top expense categories this month
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8">
          {sortedCategoryData.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <PieChart className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-500 mb-4">
                No category data available yet
              </p>
              <p className="text-sm text-gray-400">
                Add some expenses to see your spending breakdown
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedCategoryData.map((category, index) => {
                const percentage =
                  analytics.totalAmount > 0
                    ? (category.total / analytics.totalAmount) * 100
                    : 0;

                return (
                  <div key={category.name} className="group">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <span style={{ color: category.color }}>
                            #{index + 1}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {category.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrencyInr(category.total)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: category.color,
                          }}
                        />
                      </div>

                      {/* Animated progress indicator */}
                      <div
                        className="absolute top-0 left-0 h-full bg-white rounded-full opacity-30 transition-all duration-1000"
                        style={{
                          width: `${Math.min(percentage + 10, 100)}%`,
                          transform: "scaleX(0)",
                          animation: `progressPulse 2s ease-in-out ${index * 0.2}s forwards`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes progressPulse {
          0% {
            transform: scaleX(0);
          }
          50% {
            transform: scaleX(1);
          }
          100% {
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>
  );
}
