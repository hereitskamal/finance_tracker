import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

// Define interfaces
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

interface ExpenseResponse {
  expense: ExpenseWithCategory;
}

const ExpenseSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required").max(255),
  date: z.string().datetime("Invalid date format"),
  categoryId: z.string().uuid("Invalid category ID"), // ✅ Fixed: Use categoryId consistently
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ExpenseResponse | { error: string }>> {
  try {
    const { id } = await params;
    
    // ✅ Fixed: Use NextAuth session instead of Bearer token
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log("No valid NextAuth session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Getting expense:", id, "for user:", session.user.id);

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

    const { data, error } = await supabaseAdmin
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
      .eq("id", id)
      .eq("user_id", session.user.id) // ✅ Fixed: Use session.user.id
      .single();

    if (error) {
      console.error("Get expense error:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Expense not found" },
          { status: 404 }
        );
      }
      throw error;
    }

    console.log("Expense retrieved successfully:", data.id);
    return NextResponse.json({ expense: data as ExpenseWithCategory });
  } catch (error: unknown) {
    console.error("Get expense error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ExpenseResponse | { error: string; details?: unknown }>> {
  try {
    const { id } = await params;
    
    // ✅ Fixed: Use NextAuth session instead of Bearer token
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log("No valid NextAuth session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Updating expense:", id, "for user:", session.user.id);

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

    const body = await request.json();
    console.log("Request body:", body);

    // ✅ Fixed: Use categoryId consistently with schema
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
        { status: 404 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("expenses")
      .update({
        amount,
        description,
        date,
        category_id: categoryId, // ✅ Fixed: Map categoryId to category_id for database
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", session.user.id) // ✅ Fixed: Use session.user.id
      .select(`
        *,
        categories (
          id,
          name,
          color,
          icon
        )
      `)
      .single();

    if (error) {
      console.error("Update expense error:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Expense not found" },
          { status: 404 }
        );
      }
      throw error;
    }

    console.log("Expense updated successfully:", data.id);
    return NextResponse.json({ expense: data as ExpenseWithCategory });
  } catch (error: unknown) {
    console.error("Update expense error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ message: string } | { error: string }>> {
  try {
    const { id } = await params;
    
    // ✅ Fixed: Use NextAuth session instead of Bearer token
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log("No valid NextAuth session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Deleting expense:", id, "for user:", session.user.id);

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

    // First verify the expense exists and belongs to the user
    const { data: existingExpense, error: fetchError } = await supabaseAdmin
      .from("expenses")
      .select("id")
      .eq("id", id)
      .eq("user_id", session.user.id) // ✅ Fixed: Use session.user.id
      .single();

    if (fetchError || !existingExpense) {
      console.error("Expense not found or access denied:", fetchError);
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    const { error } = await supabaseAdmin
      .from("expenses")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id); // ✅ Fixed: Use session.user.id

    if (error) {
      console.error("Delete expense error:", error);
      throw error;
    }

    console.log("Expense deleted successfully:", id);
    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error: unknown) {
    console.error("Delete expense error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
