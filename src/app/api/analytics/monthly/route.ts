import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import type { MonthlyAnalytics, CategoryBreakdown } from "@/types";

interface DatabaseExpense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category_id: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  categories?: {
    name: string;
    color: string;
  };
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<MonthlyAnalytics[] | { error: string }>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server config error" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Fetch all expenses for the user with category relation
    const { data: expenses, error } = await supabaseAdmin
      .from("expenses")
      .select(`*, categories (name, color)`)
      .eq("user_id", session.user.id)
      .order("date", { ascending: false });

    if (error) {
      throw error;
    }

    if (!expenses || expenses.length === 0) {
      return NextResponse.json([]);
    }

    // Group expenses by year/month
    const group: Record<string, DatabaseExpense[]> = {};
    expenses.forEach((exp: DatabaseExpense) => {
      const d = new Date(exp.date);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const key = `${y}-${m}`;
      if (!group[key]) group[key] = [];
      group[key].push(exp);
    });

    // Prepare analytics for each non-empty month
    // @ts-ignore
    const analytics: MonthlyAnalytics[] = Object.entries(group)
      .sort(([a], [b]) => Date.parse(b + "-01") - Date.parse(a + "-01"))
      .map(([key, expensesList]) => {
        const [yearStr, monthStr] = key.split("-");
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);

        const daysInMonth = new Date(year, month, 0).getDate();
        const period = {
          startDate: new Date(year, month - 1, 1).toISOString(),
          endDate: new Date(year, month, 0, 23, 59, 59).toISOString(),
          daysInMonth,
        };

        // Category Breakdown
        const categoryBreakdown: CategoryBreakdown = expensesList.reduce(
          (acc, exp) => {
            const catName = exp.categories?.name || "Unknown";
            const catColor = exp.categories?.color || "#3B82F6";
            if (!acc[catName]) {
              acc[catName] = { total: 0, count: 0, color: catColor };
            }
            acc[catName].total += exp.amount || 0;
            acc[catName].count += 1;
            return acc;
          },
          {} as CategoryBreakdown
        );

        const totalAmount = expensesList.reduce(
          (sum, exp) => sum + (exp.amount || 0),
          0
        );
        const expenseCount = expensesList.length;
        const avgPerDay =
          totalAmount > 0
            ? Math.round((totalAmount / daysInMonth) * 100) / 100
            : 0;

        return {
          month,
          year,
          totalAmount,
          expenseCount,
          categoriesCount: Object.keys(categoryBreakdown).length,
          avgPerDay,
          categoryBreakdown,
          expenses: expensesList.slice(0, 10),
          period,
        };
      });

    return NextResponse.json(analytics);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
