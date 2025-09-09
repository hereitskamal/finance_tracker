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
  ChevronDown,
} from "lucide-react";

export default function AnalyticsPage() {
  const [months, setMonths] = useState<MonthlyAnalytics[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await apiClient.getMonthlyAnalytics(); // Expects: MonthlyAnalytics[]
      // @ts-ignore

      setMonths(data || []);
      // On first load, set selected index to current month if available
      const today = new Date();
      // @ts-ignore

      const idx = (data || []).findIndex(
        // @ts-ignore

        (m) => m.year === today.getFullYear() && m.month === today.getMonth() + 1
      );
      setSelectedIndex(idx > -1 ? idx : 0);
    } catch {
      setMonths([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const close = () => setDropdownOpen(false);
    if (dropdownOpen) {
      window.addEventListener("click", close);
      return () => window.removeEventListener("click", close);
    }
  }, [dropdownOpen]);

  const handleSelectMonth = (idx: number) => {
    setSelectedIndex(idx);
    setDropdownOpen(false);
  };

  if (isLoading) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-8 h-8 text-gray-300" />
        </div>
        <div className="h-6 bg-gray-100 rounded w-48 mb-8 animate-pulse mx-auto" />
        <div className="h-10 bg-gray-100 rounded w-48 mb-2 animate-pulse mx-auto" />
        <div className="h-5 bg-gray-100 rounded w-64 animate-pulse mx-auto" />
      </div>
    );
  }

  if (!months.length) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-8 h-8 text-gray-300" />
        </div>
        <h2 className="text-2xl font-light text-gray-900 mb-2">No Analytics Available</h2>
        <p className="text-gray-500">Start tracking expenses to see your insights</p>
      </div>
    );
  }

  const selected = months[selectedIndex];
  const categoryData = Object.entries(selected.categoryBreakdown).map(([name, data]) => ({
    name,
    ...data,
  }));
  const sortedCategoryData = categoryData.sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-12">
      {/* Beautiful Custom Dropdown */}
      <div className="relative w-full max-w-xs">
        <label
          htmlFor="month-dropdown"
          className="block text-gray-700 font-light mb-2"
        >
          Month
        </label>
        <button
          id="month-dropdown"
          type="button"
          aria-haspopup="listbox"
          aria-expanded={dropdownOpen}
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen((open) => !open);
          }}
          className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span>{`${new Date(
            selected.year,
            selected.month - 1
          ).toLocaleString("en-US", { month: "long" })} ${selected.year}`}</span>
          <ChevronDown className="w-5 h-5 ml-2 text-gray-500" />
        </button>
        {dropdownOpen && (
          <ul
            tabIndex={-1}
            role="listbox"
            className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto animate-fade-in"
            style={{ minWidth: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            {months.map((m, idx) => (
              <li
                key={`${m.year}-${m.month}`}
                role="option"
                aria-selected={idx === selectedIndex}
                tabIndex={0}
                className={`cursor-pointer px-4 py-2 hover:bg-blue-50 ${idx === selectedIndex
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700"
                  }`}
                onClick={() => handleSelectMonth(idx)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleSelectMonth(idx);
                }}
              >
                {`${new Date(m.year, m.month - 1).toLocaleString("en-US", {
                  month: "long",
                })} ${m.year}`}
              </li>
            ))}
          </ul>
        )}
        <style jsx>{`
          @keyframes fade-in {
            0% {
              opacity: 0;
              transform: scaleY(0.98);
            }
            100% {
              opacity: 1;
              transform: scaleY(1);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.12s ease;
          }
        `}</style>
      </div>

      {/* Minimal Header */}
      <div>
        <h1 className="text-4xl font-light text-gray-900 tracking-tight mb-2">
          Analytics
        </h1>
        <p className="text-gray-500 font-light">
          Your spending insights for{" "}
          {new Date(selected.year, selected.month - 1).toLocaleDateString(
            "en-US",
            {
              month: "long",
              year: "numeric",
            }
          )}
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
              {formatCurrencyInr(selected.totalAmount)}
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
              {selected.expenseCount.toLocaleString()}
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
              {formatCurrencyInr(selected.avgPerDay)}
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
              <h2 className="text-2xl font-medium text-gray-900">Spending by Category</h2>
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
              <p className="text-gray-500 mb-4">No category data available yet</p>
              <p className="text-sm text-gray-400">
                Add some expenses to see your spending breakdown
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedCategoryData.map((category, idx) => {
                const percentage =
                  selected.totalAmount > 0 ? (category.total / selected.totalAmount) * 100 : 0;

                return (
                  <div key={category.name} className="group">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <span style={{ color: category.color }}>#{idx + 1}</span>
                        </div>
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrencyInr(category.total)}
                        </div>
                        <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
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
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
