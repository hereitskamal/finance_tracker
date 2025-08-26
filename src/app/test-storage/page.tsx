"use client";

import { useEffect, useState } from "react";
import { persistentStorage } from "@/lib/session-storage";

export default function TestStoragePage() {
    const [testResult, setTestResult] = useState<string>("");

    useEffect(() => {
        // Test basic localStorage functionality
        const testLocalStorage = () => {
            try {
                // Test basic localStorage
                localStorage.setItem("test-key", "test-value");
                const retrieved = localStorage.getItem("test-key");
                localStorage.removeItem("test-key");

                if (retrieved === "test-value") {
                    setTestResult(prev => prev + "✓ Basic localStorage works\n");
                } else {
                    setTestResult(prev => prev + "✗ Basic localStorage failed\n");
                }

                // Test our persistent storage
                const testSession = {
                    user: {
                        id: "test-id",
                        email: "test@example.com",
                        name: "Test User"
                    },
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                };

                persistentStorage.setSession(testSession);
                const retrievedSession = persistentStorage.getSession();

                if (retrievedSession && retrievedSession.user.email === "test@example.com") {
                    setTestResult(prev => prev + "✓ Persistent storage works\n");
                } else {
                    setTestResult(prev => prev + "✗ Persistent storage failed\n");
                }

                persistentStorage.clearSession();
                const clearedSession = persistentStorage.getSession();

                if (!clearedSession) {
                    setTestResult(prev => prev + "✓ Session clearing works\n");
                } else {
                    setTestResult(prev => prev + "✗ Session clearing failed\n");
                }

            } catch (error) {
                setTestResult(prev => prev + `✗ Error: ${error}\n`);
            }
        };

        testLocalStorage();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Storage Test</h1>
            <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
                {testResult || "Running tests..."}
            </pre>

            <div className="mt-4">
                <button
                    onClick={() => persistentStorage.debugStorage()}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                    Debug Current Storage
                </button>

                <button
                    onClick={() => {
                        const testSession = {
                            user: {
                                id: "manual-test-id",
                                email: "manual@example.com",
                                name: "Manual Test"
                            },
                            expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                        };
                        persistentStorage.setSession(testSession);
                        alert("Test session stored!");
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                    Store Test Session
                </button>

                <button
                    onClick={() => {
                        persistentStorage.clearSession();
                        alert("Session cleared!");
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Clear Session
                </button>
            </div>
        </div>
    );
}