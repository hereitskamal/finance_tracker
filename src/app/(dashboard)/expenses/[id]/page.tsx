"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Expense } from "@/types";

export default function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [expense, setExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchExpense() {
      try {
        // ✅ Fixed: Await the params Promise to get the id
        const resolvedParams = await params;
        const response = await fetch(`/api/expenses/${resolvedParams.id}`);
        
        if (!response.ok) {
          throw new Error("Expense not found");
        }
        
        const data = await response.json();
        setExpense(data.expense);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load expense"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchExpense();
  }, [params]);

  const handleSuccess = () => {
    router.push("/expenses");
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Expense not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <ExpenseForm
        expense={expense}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
