// ==========================================
// FIXED DEFAULT CATEGORIES API - src/app/api/categories/default/route.ts
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_CATEGORIES = [
  { name: "Food", color: "#EF4444", icon: "🍕" },
  { name: "Transport", color: "#3B82F6", icon: "🚗" },
  { name: "Shopping", color: "#10B981", icon: "🛍️" },
  { name: "Bills", color: "#F59E0B", icon: "📋" },
  { name: "Entertainment", color: "#8B5CF6", icon: "🎬" },
  { name: "Healthcare", color: "#EC4899", icon: "💊" },
  { name: "Education", color: "#06B6D4", icon: "🎓" },
  { name: "Travel", color: "#84CC16", icon: "✈️" },
  { name: "Home", color: "#64748B", icon: "🏠" },
  { name: "Fitness", color: "#F97316", icon: "🏃" },
];

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

export async function GET() {
  try {
    console.log("Getting default categories template");
    return NextResponse.json({ categories: DEFAULT_CATEGORIES });
  } catch (error) {
    console.error("Get default categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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

    console.log("Creating default categories for user:", user.id);

    // Check if user already has categories (both default and custom)
    const { data: existingCategories, error: fetchError } = await supabaseAdmin
      .from("categories")
      .select("id")
      .eq("user_id", user.id);

    if (fetchError) {
      console.error("Error checking existing categories:", fetchError);
      throw fetchError;
    }

    if (existingCategories && existingCategories.length > 0) {
      console.log("User already has categories:", existingCategories.length);
      return NextResponse.json(
        { message: "User already has categories" },
        { status: 400 },
      );
    }

    // Create default categories for user
    const categoriesToInsert = DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { data: createdCategories, error: insertError } = await supabaseAdmin
      .from("categories")
      .insert(categoriesToInsert)
      .select();

    if (insertError) {
      console.error("Error creating default categories:", insertError);
      throw insertError;
    }

    console.log("Created default categories:", createdCategories?.length || 0);

    return NextResponse.json({
      message: `Created ${createdCategories?.length || 0} default categories`,
      count: createdCategories?.length || 0,
      categories: createdCategories,
    });
  } catch (error) {
    console.error("Create default categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
