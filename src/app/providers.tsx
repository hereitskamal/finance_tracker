// PROVIDERS - src/app/providers.tsx
// ==========================================
"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/auth-context";
import "@/lib/pwa-session-handler"; // Initialize PWA session handling

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true} // Refetch when window gains focus
    >
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
