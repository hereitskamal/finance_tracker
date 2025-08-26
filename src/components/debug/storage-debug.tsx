"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { persistentStorage } from "@/lib/session-storage";

export function StorageDebug() {
    const { data: session, status } = useSession();

    useEffect(() => {
        console.log("=== Session Debug ===");
        console.log("NextAuth session:", session);
        console.log("NextAuth status:", status);

        // Debug storage
        persistentStorage.debugStorage();

        // Test storage functionality
        if (session?.user) {
            console.log("Testing storage with current session...");
            const testSession = {
                user: {
                    id: session.user.id as string,
                    email: session.user.email as string,
                    name: session.user.name || null,
                },
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            };

            persistentStorage.setSession(testSession);

            // Immediately try to retrieve it
            const retrieved = persistentStorage.getSession();
            console.log("Retrieved session:", retrieved);
        }
    }, [session, status]);

    if (process.env.NODE_ENV !== "development") {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs max-w-xs">
            <div>Status: {status}</div>
            <div>Session: {session ? "✓" : "✗"}</div>
            <div>Stored: {persistentStorage.hasValidSession() ? "✓" : "✗"}</div>
            <button
                onClick={() => persistentStorage.debugStorage()}
                className="mt-2 bg-gray-700 px-2 py-1 rounded"
            >
                Debug Storage
            </button>
        </div>
    );
}