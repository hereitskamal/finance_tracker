/* eslint-disable @typescript-eslint/ban-ts-comment */

"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { formatCurrencyInr } from "@/lib/utils";
// import { MonthlyAnalytics } from "@/types";
import { Receipt, TrendingUp, Tag, IndianRupee } from "lucide-react";

export function DashboardStats() {
  const [analytics, setAnalytics] = useState<{
    totalAmount: number;
    expenseCount: number;
    avgPerDay: number;
    categoryBreakdown: Record<string, unknown>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await apiClient.getMonthlyAnalytics();
      // @ts-ignore
      setAnalytics(data?.[0]);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-6 lg:p-8"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-gray-100 rounded-xl sm:rounded-2xl animate-pulse">
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </div>
              <div className="text-right">
                <div className="h-3 bg-gray-100 rounded w-16 sm:w-20 mb-2 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-6 sm:h-8 lg:h-10 bg-gray-100 rounded w-20 sm:w-24 animate-pulse" />
              <div className="h-3 sm:h-4 bg-gray-100 rounded w-12 sm:w-16 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  const stats = [
    {
      title: "Total Spent",
      value: formatCurrencyInr(analytics.totalAmount),
      icon: IndianRupee,
      color: "blue",
      bgColor: "from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Expenses",
      value: analytics.expenseCount?.toLocaleString(),
      icon: Receipt,
      color: "green",
      bgColor: "from-green-50 to-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Daily Average",
      value: formatCurrencyInr(analytics.avgPerDay),
      icon: TrendingUp,
      color: "orange",
      bgColor: "from-orange-50 to-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Categories",
      value: Object.keys(analytics.categoryBreakdown).length.toString(),
      icon: Tag,
      color: "purple",
      bgColor: "from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="group bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-6 lg:p-8 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div
                className={`p-2 sm:p-3 bg-gradient-to-r ${stat.bgColor} rounded-xl sm:rounded-2xl group-hover:scale-105 transition-transform`}
              >
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${stat.iconColor}`}
                />
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  {stat.title}
                </div>
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <p className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-900 tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">This month</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
