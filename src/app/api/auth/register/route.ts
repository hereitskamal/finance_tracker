// ==========================================
// FIXED REGISTER API - src/app/api/auth/register/route.ts
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    // Debug environment variables
    console.log("Environment check:");
    console.log(
      "SUPABASE_URL:",
      process.env.SUPABASE_URL ? "Set" : "Missing",
    );
    console.log(
      "SERVICE_ROLE_KEY:",
      process.env.SUPABASE_SERVICE_ROLE_KEY
        ? `Set (${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...)`
        : "Missing",
    );

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing environment variables");
      return NextResponse.json(
        { error: "Server configuration error - missing environment variables" },
        { status: 500 },
      );
    }

    if (
      serviceRoleKey === "your-service-role-key-here" ||
      serviceRoleKey.length < 100
    ) {
      console.error("Invalid service role key");
      return NextResponse.json(
        { error: "Server configuration error - invalid service role key" },
        { status: 500 },
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const body = await request.json();
    console.log("Registration attempt for:", body.email);

    const { name, email, password } = RegisterSchema.parse(body);

    // Create user with Supabase Auth
    console.log("Creating user with Supabase...");
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: name,
      },
    });

    if (error) {
      console.error("Supabase auth error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create user" },
        { status: 400 },
      );
    }

    console.log("User created successfully:", data.user.id);

    // Create user profile
    console.log("Creating user profile...");
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: data.user.id,
        name,
        email,
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // Don't fail the registration if profile creation fails
    }

    // Create default categories for user
    console.log("Creating default categories...");
    const { error: categoriesError } = await supabaseAdmin
      .from("categories")
      .insert([
        { name: "Food", color: "#EF4444", icon: "🍕", user_id: data.user.id },
        {
          name: "Transport",
          color: "#3B82F6",
          icon: "🚗",
          user_id: data.user.id,
        },
        {
          name: "Shopping",
          color: "#10B981",
          icon: "🛍️",
          user_id: data.user.id,
        },
        { name: "Bills", color: "#F59E0B", icon: "📋", user_id: data.user.id },
        {
          name: "Entertainment",
          color: "#8B5CF6",
          icon: "🎬",
          user_id: data.user.id,
        },
      ]);

    if (categoriesError) {
      console.error("Categories creation error:", categoriesError);
      // Don't fail the registration if categories creation fails
    }

    console.log("Registration completed successfully");

    return NextResponse.json(
      {
        user: {
          id: data.user.id,
          email: data.user.email,
          name,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);

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
