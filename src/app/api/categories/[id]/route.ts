import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  icon: z.string().min(1, "Icon is required"),
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Fixed: Promise type
) {
  try {
    const { id } = await params; // ✅ Fixed: Await params to get id
    
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

    console.log("Getting category:", id, "for user:", user.id);

    const { data: category, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .eq("id", id) // ✅ Fixed: Use awaited id
      .or(`user_id.eq.${user.id},user_id.is.null`)
      .single();

    if (error) {
      console.error("Get category error:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 },
        );
      }
      throw error;
    }

    // Get expense count for this category
    const { count: expenseCount } = await supabaseAdmin
      .from("expenses")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id) // ✅ Fixed: Use awaited id
      .eq("user_id", user.id);

    const categoryWithCount = {
      ...category,
      _count: {
        expenses: expenseCount || 0,
      },
    };

    return NextResponse.json({ category: categoryWithCount });
  } catch (error) {
    console.error("Get category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Fixed: Promise type
) {
  try {
    const { id } = await params; // ✅ Fixed: Await params to get id
    
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
    console.log("Updating category:", id, "for user:", user.id);

    const { name, color, icon } = CategorySchema.parse(body);

    // Verify category belongs to user and is not a default category
    const { data: existingCategory, error: fetchError } = await supabaseAdmin
      .from("categories")
      .select("*")
      .eq("id", id) // ✅ Fixed: Use awaited id
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingCategory) {
      console.error("Category not found or access denied:", fetchError);
      return NextResponse.json(
        { error: "Category not found or cannot be edited" },
        { status: 404 },
      );
    }

    // Check if new name conflicts with existing categories
    const { data: nameConflict } = await supabaseAdmin
      .from("categories")
      .select("id")
      .eq("name", name)
      .eq("user_id", user.id)
      .neq("id", id) // ✅ Fixed: Use awaited id
      .single();

    if (nameConflict) {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 400 },
      );
    }

    const { data: category, error } = await supabaseAdmin
      .from("categories")
      .update({
        name,
        color,
        icon,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id) // ✅ Fixed: Use awaited id
      .select()
      .single();

    if (error) {
      console.error("Update category error:", error);
      throw error;
    }

    console.log("Category updated successfully:", category.id);
    return NextResponse.json({ category });
  } catch (error) {
    console.error("Update category error:", error);

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Fixed: Promise type
) {
  try {
    const { id } = await params; // ✅ Fixed: Await params to get id
    
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

    console.log("Deleting category:", id, "for user:", user.id);

    // Verify category belongs to user and is not a default category
    const { data: category, error: fetchError } = await supabaseAdmin
      .from("categories")
      .select("*")
      .eq("id", id) // ✅ Fixed: Use awaited id
      .eq("user_id", user.id)
      .single();

    if (fetchError || !category) {
      console.error("Category not found or access denied:", fetchError);
      return NextResponse.json(
        { error: "Category not found or cannot be deleted" },
        { status: 404 },
      );
    }

    // Check if category has expenses
    const { count: expenseCount } = await supabaseAdmin
      .from("expenses")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id) // ✅ Fixed: Use awaited id
      .eq("user_id", user.id);

    if (expenseCount && expenseCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing expenses" },
        { status: 400 },
      );
    }

    const { error: deleteError } = await supabaseAdmin
      .from("categories")
      .delete()
      .eq("id", id); // ✅ Fixed: Use awaited id

    if (deleteError) {
      console.error("Delete category error:", deleteError);
      throw deleteError;
    }

    console.log("Category deleted successfully:", id);
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
