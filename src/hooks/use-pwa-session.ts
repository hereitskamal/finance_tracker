"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { sessionStorage } from "@/lib/session-storage";
import { PWASessionHandler } from "@/lib/pwa-session-handler";

export function usePWASession() {
  const { data: session, status } = useSession();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (status === "loading") return;

      // If no active session, try to restore from storage
      if (!session && status === "unauthenticated") {
        const storedSession = sessionStorage.getSession();
        if (storedSession) {
          // Try to sync with server to validate stored session
          await PWASessionHandler.getInstance().syncSessionWithServer();
        }
      }

      setIsRestoring(false);
    };

    restoreSession();
  }, [session, status]);

  return {
    isRestoring: isRestoring && status !== "loading",
    hasStoredSession: sessionStorage.hasValidSession(),
  };
}
