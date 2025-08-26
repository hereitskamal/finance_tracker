// CONTEXT - src/context/auth-context.tsx
// ==========================================
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AuthUser } from "@/types/auth";
import { persistentStorage } from "@/lib/session-storage";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize user from persistent storage on mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    console.log("Initializing auth context...");
    const storedSession = persistentStorage.getSession();

    if (storedSession && !session) {
      console.log("Found stored session, initializing user:", storedSession.user.email);
      setUser(storedSession.user);
    } else if (!storedSession) {
      console.log("No stored session found");
    }

    setIsInitialized(true);
  }, [session]);

  useEffect(() => {
    if (status === "loading" || !isInitialized) {
      console.log("Skipping session update - loading or not initialized", { status, isInitialized });
      return;
    }

    console.log("Processing session update", { session: !!session, status });

    if (session?.user) {
      const userData = {
        id: session.user.id as string,
        name: session.user.name ?? null,
        email: session.user.email as string,
      };

      console.log("Setting user data:", userData.email);
      setUser(userData);

      // Store session in localStorage for PWA persistence
      const sessionData = {
        user: userData,
        expires: session.expires || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      console.log("Storing session data:", sessionData);
      persistentStorage.setSession(sessionData);
    } else {
      console.log("Clearing user and session");
      setUser(null);
      persistentStorage.clearSession();
    }
  }, [session, status, isInitialized]);

  const value: AuthContextType = {
    user,
    isLoading: status === "loading" || !isInitialized,
    isAuthenticated: !!user && (status === "authenticated" || persistentStorage.hasValidSession()),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
