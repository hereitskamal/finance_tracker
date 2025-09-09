"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { persistentStorage } from "@/lib/session-storage";
import { usePWASession } from "@/hooks/use-pwa-session";

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { data: session, status } = useSession();
    const { isRestoring, hasStoredSession } = usePWASession();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (status === "loading" || isRestoring) return; // Still loading or restoring

        // Check for authentication
        if (!session && !hasStoredSession) {
            router.push("/login");
            return;
        }

        setIsChecking(false);
    }, [session, status, router, isRestoring, hasStoredSession]);

    // Show loading while checking authentication
    if (status === "loading" || isRestoring || isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Check if we have either an active session or a valid stored session
    const hasValidAuth = session || hasStoredSession;

    // Show nothing while redirecting
    if (!hasValidAuth) {
        return null;
    }

    return <>{children}</>;
}