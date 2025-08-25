// ==========================================
// HOOKS - src/hooks/use-categories.ts
// ==========================================
"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Category, CreateCategoryData } from "@/types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getCategories();
      setCategories(response.categories);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async (data: CreateCategoryData) => {
    try {
      await apiClient.createCategory(data);
      loadCategories(); // Reload categories
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create category",
      );
      return false;
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
    loadCategories,
    createCategory,
    refetch: loadCategories,
  };
}
