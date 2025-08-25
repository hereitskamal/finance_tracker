// src/app/api/analytics/summary/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

// Define interfaces for the response data
interface CategoryStats {
  name: string;
  icon: string;
  color: string;
  amount: number;
  count: number;
}

interface ExpenseWithCategory {
  id: string;
  amount: number;
  description: string;
  date: string;
  category_id: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  categories?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
}

interface BasicExpense {
  id?: string;
  amount: number;
  category_id?: string;
  categories?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
}

interface SupabaseUser {
  id: string;
  email?: string;
}

interface AnalyticsSummaryResponse {
  totalExpenses: number;
  totalAmount: number;
  thisMonthAmount: number;
  lastMonthAmount: number;
  changePercentage: number;
  topCategories: CategoryStats[];
  recentExpenses: ExpenseWithCategory[];
}

// Helper function to get user from authorization header
async function getUserFromAuth(request: NextRequest): Promise<SupabaseUser | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing environment variables");
  }

  const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token: string = authHeader.substring(7);

  try {
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }
    return user as SupabaseUser;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<AnalyticsSummaryResponse | { error: string }>> {
  try {
    const user: SupabaseUser | null = await getUserFromAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log("Getting analytics summary for user:", user.id);

    const now: Date = new Date();
    const thisMonth: Date = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth: Date = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth: Date = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59
    );

    // Execute all queries concurrently using Promise.all
    const [allExpenses, thisMonthExpenses, lastMonthExpenses, recentExpenses] =
      await Promise.all([
        // Get all expenses for total stats
        supabaseAdmin
          .from("expenses")
          .select("amount")
          .eq("user_id", user.id),

        // Get this month's expenses with category details
        supabaseAdmin
          .from("expenses")
          .select(`
            amount,
            category_id,
            categories (
              id,
              name,
              color,
              icon
            )
          `)
          .eq("user_id", user.id)
          .gte("date", thisMonth.toISOString()),

        // Get last month's expenses
        supabaseAdmin
          .from("expenses")
          .select("amount")
          .eq("user_id", user.id)
          .gte("date", lastMonth.toISOString())
          .lte("date", endOfLastMonth.toISOString()),

        // Get recent expenses
        supabaseAdmin
          .from("expenses")
          .select(`
            *,
            categories (
              id,
              name,
              color,
              icon
            )
          `)
          .eq("user_id", user.id)
          .order("date", { ascending: false })
          .limit(5),
      ]);

    console.log("Retrieved data:", {
      allExpenses: allExpenses.data?.length || 0,
      thisMonthExpenses: thisMonthExpenses.data?.length || 0,
      lastMonthExpenses: lastMonthExpenses.data?.length || 0,
      recentExpenses: recentExpenses.data?.length || 0,
    });

    // Check for errors
    if (
      allExpenses.error ||
      thisMonthExpenses.error ||
      lastMonthExpenses.error ||
      recentExpenses.error
    ) {
      console.error("Query errors:", {
        allExpenses: allExpenses.error,
        thisMonthExpenses: thisMonthExpenses.error,
        lastMonthExpenses: lastMonthExpenses.error,
        recentExpenses: recentExpenses.error,
      });
      throw new Error("Failed to fetch analytics data");
    }

    // ✅ Properly typed reduce for total amount
    const totalAmount: number = allExpenses.data?.reduce<number>(
      (sum: number, exp: BasicExpense) => sum + (exp.amount || 0),
      0
    ) || 0;
    
    const totalExpenses: number = allExpenses.data?.length || 0;

    // ✅ Properly typed reduce for this month amount
    const thisMonthAmount: number = thisMonthExpenses.data?.reduce<number>(
      (sum: number, exp: BasicExpense) => sum + (exp.amount || 0),
      0
    ) || 0;

    // Group this month's expenses by category for top categories
    const categoryStats = new Map<string, CategoryStats>();
    
    thisMonthExpenses.data?.forEach((expense: BasicExpense) => {
      const categoryId: string = expense.category_id || "unknown";
      const categoryName: string = expense.categories?.name || "Unknown";
      const categoryIcon: string = expense.categories?.icon || "📝";
      const categoryColor: string = expense.categories?.color || "#3B82F6";
      const amount: number = expense.amount || 0;

      if (categoryStats.has(categoryId)) {
        const existing = categoryStats.get(categoryId)!;
        existing.amount += amount;
        existing.count += 1;
      } else {
        categoryStats.set(categoryId, {
          name: categoryName,
          icon: categoryIcon,
          color: categoryColor,
          amount: amount,
          count: 1,
        });
      }
    });

    // Convert to array and sort by amount (descending), take top 5
    const topCategories: CategoryStats[] = Array.from(categoryStats.values())
      .sort((a: CategoryStats, b: CategoryStats) => b.amount - a.amount)
      .slice(0, 5);

    // ✅ Properly typed reduce for last month amount
    const lastMonthAmount: number = lastMonthExpenses.data?.reduce<number>(
      (sum: number, exp: BasicExpense) => sum + (exp.amount || 0),
      0
    ) || 0;

    // Calculate change percentage
    const changePercentage: number =
      lastMonthAmount > 0
        ? Math.round(
            ((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100 * 100
          ) / 100 // Round to 2 decimal places
        : 0;

    console.log("Analytics summary processed:", {
      totalExpenses,
      totalAmount,
      thisMonthAmount,
      lastMonthAmount,
      changePercentage,
      topCategoriesCount: topCategories.length,
    });

    const response: AnalyticsSummaryResponse = {
      totalExpenses,
      totalAmount,
      thisMonthAmount,
      lastMonthAmount,
      changePercentage,
      topCategories,
      recentExpenses: (recentExpenses.data as ExpenseWithCategory[]) || [],
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Dashboard summary error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
