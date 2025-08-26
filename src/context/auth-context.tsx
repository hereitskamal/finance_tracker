// CONTEXT - src/context/auth-context.tsx
// ==========================================
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AuthUser } from "@/types/auth";
import { sessionStorage } from "@/lib/session-storage";

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
    const storedSession = sessionStorage.getSession();
    if (storedSession && !session) {
      setUser(storedSession.user);
    }
    setIsInitialized(true);
  }, [session]);

  useEffect(() => {
    if (status === "loading" || !isInitialized) return; // Don't update while loading

    if (session?.user) {
      const userData = {
        id: session.user.id as string,
        name: session.user.name ?? null,
        email: session.user.email as string,
      };

      setUser(userData);

      // Store session in localStorage for PWA persistence
      sessionStorage.setSession({
        user: userData,
        expires: session.expires || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days default
      });
    } else {
      setUser(null);
      sessionStorage.clearSession();
    }
  }, [session, status, isInitialized]);

  const value: AuthContextType = {
    user,
    isLoading: status === "loading" || !isInitialized,
    isAuthenticated: !!user && (status === "authenticated" || sessionStorage.hasValidSession()),
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
