"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { Category, Expense } from "@/types";
import { FileText, Calendar, Tag, IndianRupee } from "lucide-react";

interface ExpenseFormProps {
  expense?: Expense;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ExpenseForm({
  expense,
  onSuccess,
  onCancel,
}: ExpenseFormProps) {
  const [amount, setAmount] = useState(expense?.amount?.toString() || "");
  const [description, setDescription] = useState(expense?.description || "");
  const [date, setDate] = useState(
    expense?.date
      ? new Date(expense.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  );
  const [categoryId, setCategoryId] = useState(expense?.categoryId || "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    loadCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await apiClient.getCategories();

      if (
        response &&
        response.categories &&
        Array.isArray(response.categories)
      ) {
        setCategories(response.categories);

        if (!expense && response.categories.length > 0) {
          setCategoryId(response.categories[0].id);
        }
      } else {
        setCategories([]);
        setError("Failed to load categories. Please try again.");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setCategories([]);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = {
        amount: parseFloat(amount),
        description,
        date: new Date(date).toISOString(),
        categoryId,
      };

      if (expense) {
        await apiClient.updateExpense(expense.id, data);
      } else {
        await apiClient.createExpense(data);
      }

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to save expense",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Field */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <IndianRupee className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-900">Amount</label>
          </div>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="text-lg border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0"
          />
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-900">
              Description
            </label>
          </div>
          <Input
            type="text"
            placeholder="What did you spend on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0"
          />
        </div>

        {/* Date Field */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-900">Date</label>
          </div>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0"
          />
        </div>

        {/* Category Field */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-900">
              Category
            </label>
          </div>

          {loadingCategories ? (
            <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
          ) : categories.length === 0 ? (
            <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">
                No categories available.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={loadCategories}
                size="sm"
                className="rounded-lg"
              >
                Retry
              </Button>
            </div>
          ) : (
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0 focus:outline-none"
              required
            >
              <option value="">Choose a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Compact Error Message */}
        {error && (
          <div className="p-3 bg-red-50 rounded-xl border border-red-100">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Compact Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <Button
            type="submit"
            disabled={isLoading || categories.length === 0}
            className="flex-1 bg-black hover:bg-gray-800 text-white rounded-xl py-2"
          >
            {isLoading ? "Saving..." : expense ? "Update" : "Add Expense"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="px-6 rounded-xl border-gray-200"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
