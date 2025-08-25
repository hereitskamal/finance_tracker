// src/app/(dashboard)/expenses/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExpenseList } from "@/components/expenses/expense-list";
import { Plus } from "lucide-react";

export default function ExpensesPage() {
  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-12">
      {/* Responsive Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 tracking-tight truncate">
            Expenses
          </h1>
          <p className="text-gray-500 mt-1 sm:mt-2 font-light text-sm sm:text-base">
            Track and manage your spending
          </p>
        </div>

        <div className="flex-shrink-0">
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
      </div>

      {/* Responsive Content Container */}
      <div className="w-full">
        <ExpenseList />
      </div>
    </div>
  );
}
