// ==========================================
// FIXED EXPENSES API - src/app/api/expenses/route.ts
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const ExpenseSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required").max(255),
  date: z.string().datetime("Invalid date format"),
  categoryId: z.string().uuid("Invalid category ID"), // Note: using categoryId here
});

export async function GET(request: NextRequest) {
  try {
    // Use NextAuth session instead of Bearer token
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log("No valid NextAuth session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User authenticated via NextAuth:", session.user.id);

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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const categoryId = searchParams.get("categoryId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    console.log(
      "Getting expenses for user:",
      session.user.id,
      "page:",
      page,
      "limit:",
      limit,
    );

    let query = supabaseAdmin
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
        { count: "exact" },
      )
      .eq("user_id", session.user.id)
      .order("date", { ascending: false })
      .range(from, to);

    if (search) {
      query = query.ilike("description", `%${search}%`);
      console.log("Filtering by search:", search);
    }

    if (categoryId) {
      query = query.eq("category_id", categoryId);
      console.log("Filtering by category:", categoryId);
    }

    if (startDate) {
      query = query.gte("date", startDate);
      console.log("Filtering from date:", startDate);
    }

    if (endDate) {
      query = query.lte("date", endDate);
      console.log("Filtering to date:", endDate);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Get expenses error:", error);
      throw error;
    }

    console.log("Retrieved expenses:", data?.length || 0, "total:", count);

    return NextResponse.json({
      expenses: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Use NextAuth session instead of Bearer token
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log("No valid NextAuth session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Creating expense for user:", session.user.id);

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

    const body = await request.json();
    const { amount, description, date, categoryId } = ExpenseSchema.parse(body);

    // Verify category belongs to user or is a default category
    const { data: category, error: categoryError } = await supabaseAdmin
      .from("categories")
      .select("id")
      .or(`user_id.eq.${session.user.id},user_id.is.null`)
      .eq("id", categoryId)
      .single();

    if (categoryError || !category) {
      console.error("Category not found or access denied:", categoryError);
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("expenses")
      .insert({
        amount,
        description,
        date,
        category_id: categoryId, // Note: database uses category_id
        user_id: session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
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
      .single();

    if (error) {
      console.error("Create expense error:", error);
      throw error;
    }

    console.log("Expense created successfully:", data.id);
    return NextResponse.json({ expense: data }, { status: 201 });
  } catch (error) {
    console.error("Create expense error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
