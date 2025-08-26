// src/app/api/analytics/trends/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

// Define interfaces for the response data
interface TrendData {
  month: string;
  amount: number;
  year: number;
  monthNum: number;
}

interface TrendsSummary {
  average: number;
  currentMonth: number;
  previousMonth: number;
  monthlyGrowth: number;
  totalPeriod: number;
}

interface TrendsAnalyticsResponse {
  trends: TrendData[];
  summary: TrendsSummary;
}

interface BasicExpense {
  amount: number;
}

interface SupabaseUser {
  id: string;
  email?: string;
}

// Helper function to get user from authorization header
async function getUserFromAuth(request: NextRequest): Promise<SupabaseUser | null> {
  const supabaseUrl = process.env.SUPABASE_URL;
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

export async function GET(request: NextRequest): Promise<NextResponse<TrendsAnalyticsResponse | { error: string }>> {
  try {
    const user: SupabaseUser | null = await getUserFromAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
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

    const { searchParams } = new URL(request.url);
    const months: number = parseInt(searchParams.get("months") || "6");

    console.log(
      "Getting trends analytics for user:",
      user.id,
      "months:",
      months
    );

    const now: Date = new Date();
    const trends: TrendData[] = [];

    // Get spending for each of the last N months
    for (let i = months - 1; i >= 0; i--) {
      const monthDate: Date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startDate: Date = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1
      );
      const endDate: Date = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0,
        23,
        59,
        59
      );

      console.log(
        `Processing month ${i + 1}/${months}:`,
        startDate.toISOString().slice(0, 7)
      );

      // Get expenses for this month with proper typing
      const { data: monthExpenses, error } = await supabaseAdmin
        .from("expenses")
        .select("amount")
        .eq("user_id", user.id)
        .gte("date", startDate.toISOString())
        .lte("date", endDate.toISOString());

      if (error) {
        console.error("Error fetching expenses for month:", monthDate, error);
        throw error;
      }

      // ✅ Properly typed reduce for monthly total
      const monthTotal: number = monthExpenses?.reduce<number>(
        (sum: number, exp: BasicExpense) => sum + (exp.amount || 0),
        0
      ) || 0;

      const trendDataPoint: TrendData = {
        month: monthDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        }),
        amount: monthTotal,
        year: monthDate.getFullYear(),
        monthNum: monthDate.getMonth() + 1,
      };

      trends.push(trendDataPoint);

      console.log(
        `Month ${monthDate.toLocaleDateString("en-US", { 
          month: "short", 
          year: "numeric" 
        })}:`,
        monthTotal
      );
    }

    // Calculate average and growth with proper typing
    const amounts: number[] = trends.map((t: TrendData) => t.amount);
    
    const average: number = amounts.length > 0
      ? amounts.reduce<number>((sum: number, amt: number) => sum + amt, 0) / amounts.length
      : 0;
      
    const currentMonth: number = amounts[amounts.length - 1] || 0;
    const previousMonth: number = amounts[amounts.length - 2] || 0;
    
    const monthlyGrowth: number = previousMonth > 0
      ? Math.round(
          ((currentMonth - previousMonth) / previousMonth) * 100 * 100
        ) / 100 // Round to 2 decimal places
      : 0;

    const totalPeriod: number = amounts.reduce<number>(
      (sum: number, amt: number) => sum + amt, 
      0
    );

    console.log("Trends analytics processed:", {
      months: trends.length,
      average: Math.round(average * 100) / 100,
      currentMonth,
      previousMonth,
      monthlyGrowth,
      totalPeriod,
    });

    const summary: TrendsSummary = {
      average: Math.round(average * 100) / 100, // Round to 2 decimal places
      currentMonth,
      previousMonth,
      monthlyGrowth,
      totalPeriod,
    };

    const response: TrendsAnalyticsResponse = {
      trends,
      summary,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Trends analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
