// CONTEXT - src/context/auth-context.tsx
// ==========================================
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AuthUser } from "@/types/auth";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (status === "loading") return; // Don't update while loading

    if (session?.user) {
      setUser({
        id: session.user.id as string,
        name: session.user.name ?? null,
        email: session.user.email as string,
      });
    } else {
      setUser(null);
    }
  }, [session, status]);

  const value: AuthContextType = {
    user,
    isLoading: status === "loading",
    isAuthenticated: !!user && status === "authenticated",
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
