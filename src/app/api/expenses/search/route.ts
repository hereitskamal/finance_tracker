// ==========================================
// FIXED SEARCH EXPENSES API - src/app/api/expenses/search/route.ts
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Helper function to get user from authorization header
async function getUserFromAuth(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing environment variables");
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
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
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");

    console.log(
      "Searching expenses for user:",
      user.id,
      "query:",
      query,
      "limit:",
      limit,
    );

    if (!query || query.trim().length < 2) {
      console.log("Query too short, returning empty results");
      return NextResponse.json({ results: [] });
    }

    const searchTerm = `%${query.trim()}%`;

    // Search expenses by description
    const { data: expensesByDescription, error: descError } =
      await supabaseAdmin
        .from("expenses")
        .select(
          `
        *,
        categories (
          id,
          name,
          color,
          icon
        )
      `,
        )
        .eq("user_id", user.id)
        .ilike("description", searchTerm)
        .order("date", { ascending: false })
        .limit(limit);

    if (descError) {
      console.error("Error searching by description:", descError);
      throw descError;
    }

    // Search expenses by category name using a join
    const { data: expensesByCategory, error: catError } = await supabaseAdmin
      .from("expenses")
      .select(
        `
        *,
        categories!inner (
          id,
          name,
          color,
          icon
        )
      `,
      )
      .eq("user_id", user.id)
      .ilike("categories.name", searchTerm)
      .order("date", { ascending: false })
      .limit(limit);

    if (catError) {
      console.error("Error searching by category:", catError);
      throw catError;
    }

    // Combine and deduplicate results
    const allResults = [
      ...(expensesByDescription || []),
      ...(expensesByCategory || []),
    ];

    // Remove duplicates by expense ID
    const uniqueResults = allResults.filter(
      (expense, index, self) =>
        index === self.findIndex((e) => e.id === expense.id),
    );

    // Sort by date descending and limit
    const results = uniqueResults
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);

    console.log("Search completed:", {
      descriptionMatches: expensesByDescription?.length || 0,
      categoryMatches: expensesByCategory?.length || 0,
      uniqueResults: uniqueResults.length,
      finalResults: results.length,
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search expenses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
