// ==========================================
// HOOKS - src/hooks/use-analytics.ts
// ==========================================
"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { MonthlyAnalytics } from "@/types";

export function useAnalytics(month?: number, year?: number) {
  const [analytics, setAnalytics] = useState<MonthlyAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = async (newMonth?: number, newYear?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.getMonthlyAnalytics(
        newMonth || month,
        newYear || year,
      );
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  return {
    analytics,
    isLoading,
    error,
    loadAnalytics,
    refetch: () => loadAnalytics(),
  };
}
