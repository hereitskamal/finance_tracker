"use client";

import { useRouter } from "next/navigation";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AddExpensePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/expenses");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 py-4">
      {/* Compact Navigation */}
      <div className="flex items-center space-x-4">
        <Link href="/expenses">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-50 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Add Expense</h1>
          <p className="text-gray-500 text-sm">Record a new transaction</p>
        </div>
      </div>

      <ExpenseForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
