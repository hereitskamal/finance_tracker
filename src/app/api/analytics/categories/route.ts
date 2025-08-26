// ==========================================
// FIXED CATEGORY ANALYTICS API - src/app/api/analytics/categories/route.ts
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Import your NextAuth config
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    // Use NextAuth session instead of Bearer token
    const session = await getServerSession(authOptions);
    console.log(session, "session");
    if (!session?.user) {
      console.log("No valid NextAuth session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User authenticated via NextAuth:", session.user);

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Default to current month if no dates provided
    const now = new Date();
    const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const actualStartDate = startDate ? new Date(startDate) : defaultStart;
    const actualEndDate = endDate ? new Date(endDate) : defaultEnd;

    console.log("Getting category analytics for user:", session.user.id);
    console.log(
      "Date range:",
      actualStartDate.toISOString(),
      "to",
      actualEndDate.toISOString(),
    );

    // Get expenses with category details using session.user.id
    const { data: categoryExpenses, error } = await supabaseAdmin
      .from("expenses")
      .select(
        `
        category_id,
        amount,
        categories (
          id,
          name,
          color,
          icon
        )
      `,
      )
      .eq("user_id", session.user.id) // Use session.user.id instead of user.id
      .gte("date", actualStartDate.toISOString())
      .lte("date", actualEndDate.toISOString())
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching category expenses:", error);
      throw error;
    }

    console.log("Retrieved expenses:", categoryExpenses?.length || 0);

    // Group expenses by category and calculate totals
    const categoryStats = new Map();
    let totalAmount = 0;

    categoryExpenses?.forEach(
      (expense: { category_id: unknown; amount: number; categories: { name: string; color: string; icon: string } | null; }) => {
        const categoryId = expense.category_id;
        const amount = expense.amount || 0;
        const category = expense.categories;

        if (category) {
          totalAmount += amount;

          if (categoryStats.has(categoryId)) {
            const existing = categoryStats.get(categoryId);
            existing.total += amount;
            existing.count += 1;
          } else {
            categoryStats.set(categoryId, {
              total: amount,
              count: 1,
              name: category.name,
              color: category.color,
              icon: category.icon,
            });
          }
        }
      },
    );

    // Convert to the expected format and calculate percentages
    const categoryBreakdown: Record<
      string,
      {
        total: number;
        count: number;
        color: string;
        percentage: number;
        icon: string;
      }
    > = {};

    categoryStats.forEach((stats) => {
      const percentage =
        totalAmount > 0 ? (stats.total / totalAmount) * 100 : 0;

      categoryBreakdown[stats.name] = {
        total: stats.total,
        count: stats.count,
        color: stats.color,
        percentage: Math.round(percentage * 100) / 100, // Round to 2 decimal places
        icon: stats.icon,
      };
    });

    // Sort by total amount (descending)
    const sortedCategoryBreakdown = Object.fromEntries(
      Object.entries(categoryBreakdown).sort(
        ([, a], [, b]) => b.total - a.total,
      ),
    );

    console.log("Category analytics processed:", {
      categories: Object.keys(sortedCategoryBreakdown).length,
      totalAmount,
      totalExpenses: categoryExpenses?.length || 0,
    });

    return NextResponse.json({
      categoryBreakdown: sortedCategoryBreakdown,
      totalAmount,
      period: {
        startDate: actualStartDate.toISOString(),
        endDate: actualEndDate.toISOString(),
      },
    });
  } catch (error) {
    console.error("Category analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
