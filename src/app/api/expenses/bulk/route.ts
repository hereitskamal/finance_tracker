// ==========================================
// FIXED BULK DELETE EXPENSES API - src/app/api/expenses/bulk/route.ts
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const BulkDeleteSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, "At least one ID is required"),
});

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

export async function DELETE(request: NextRequest) {
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

    const body = await request.json();
    console.log("Bulk deleting expenses for user:", user.id);

    const { ids } = BulkDeleteSchema.parse(body);
    console.log("Attempting to delete expenses:", ids);

    // Verify all expenses belong to the user
    const { data: userExpenses, error: fetchError } = await supabaseAdmin
      .from("expenses")
      .select("id")
      .in("id", ids)
      .eq("user_id", user.id);

    if (fetchError) {
      console.error("Error verifying expenses ownership:", fetchError);
      throw fetchError;
    }

    if (!userExpenses || userExpenses.length !== ids.length) {
      console.error("Not all expenses found or belong to user:", {
        requested: ids.length,
        found: userExpenses?.length || 0,
      });
      return NextResponse.json(
        { error: "Some expenses not found or don't belong to you" },
        { status: 403 },
      );
    }

    // Delete expenses using Supabase's .in() method for bulk delete
    const { data: deletedExpenses, error: deleteError } = await supabaseAdmin
      .from("expenses")
      .delete()
      .in("id", ids)
      .eq("user_id", user.id)
      .select("id");

    if (deleteError) {
      console.error("Bulk delete error:", deleteError);
      throw deleteError;
    }

    const deletedCount = deletedExpenses?.length || 0;
    console.log("Successfully deleted expenses:", deletedCount);

    return NextResponse.json({
      message: `Successfully deleted ${deletedCount} expenses`,
      deletedCount,
      deletedIds: deletedExpenses?.map((expense: { id: unknown; }) => expense.id) || [],
    });
  } catch (error) {
    console.error("Bulk delete expenses error:", error);

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
