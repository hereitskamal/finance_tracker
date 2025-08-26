// src/app/api/analytics/monthly/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import type { MonthlyAnalytics, CategoryBreakdown } from "@/types";

// Database expense interface matching Supabase structure
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
): Promise<NextResponse<MonthlyAnalytics | { error: string }>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log("No valid NextAuth session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User authenticated via NextAuth:", session.user.id);

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { searchParams } = new URL(request.url);
    const month: number = parseInt(
      searchParams.get("month") || (new Date().getMonth() + 1).toString()
    );
    const year: number = parseInt(
      searchParams.get("year") || new Date().getFullYear().toString()
    );

    const startDate: string = new Date(year, month - 1, 1).toISOString();
    const endDate: string = new Date(year, month, 0, 23, 59, 59).toISOString();

    console.log("Getting monthly analytics for user:", session.user.id);
    console.log("Month/Year:", month, year);
    console.log("Date range:", startDate, "to", endDate);

    // Type the Supabase response with proper interface
    const { data: expenses, error } = await supabaseAdmin
      .from("expenses")
      .select(`
        *,
        categories (
          name,
          color
        )
      `)
      .eq("user_id", session.user.id)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error);
      throw error;
    }

    console.log("Retrieved expenses:", expenses?.length || 0);

    // ✅ Properly typed reduce for total amount calculation
    const totalAmount: number = expenses?.reduce<number>(
      (sum: number, exp: DatabaseExpense) => sum + (exp.amount || 0),
      0
    ) || 0;

    const expenseCount: number = expenses?.length || 0;
    const daysInMonth: number = new Date(year, month, 0).getDate();

    // ✅ Properly typed reduce for category breakdown
    const categoryBreakdown: CategoryBreakdown = expenses?.reduce<CategoryBreakdown>(
      (acc: CategoryBreakdown, expense: DatabaseExpense) => {
        const categoryName: string = expense.categories?.name || "Unknown";
        const categoryColor: string = expense.categories?.color || "#3B82F6";

        if (!acc[categoryName]) {
          acc[categoryName] = {
            total: 0,
            count: 0,
            color: categoryColor,
          };
        }
        acc[categoryName].total += expense.amount || 0;
        acc[categoryName].count += 1;
        return acc;
      },
      {} as CategoryBreakdown
    ) || {};

    const avgPerDay: number = totalAmount > 0 
      ? Math.round((totalAmount / daysInMonth) * 100) / 100 
      : 0;

    console.log("Monthly analytics processed:", {
      totalAmount,
      expenseCount,
      avgPerDay,
      categoriesCount: Object.keys(categoryBreakdown).length,
    });

    const response: MonthlyAnalytics = {
      month,
      year,
      totalAmount,
      expenseCount,
      categoriesCount: Object.keys(categoryBreakdown).length,
      avgPerDay,
      categoryBreakdown,
      expenses: expenses?.slice(0, 10) || [],
      period: {
        startDate,
        endDate,
        daysInMonth,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Monthly analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
