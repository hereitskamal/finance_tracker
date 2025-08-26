// Session storage utilities for PWA persistence
"use client";

const SESSION_KEY = "expense-tracker-session";
const SESSION_EXPIRY_KEY = "expense-tracker-session-expiry";

export interface StoredSession {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  expires: string;
}

export const sessionStorage = {
  // Store session in localStorage for PWA persistence
  setSession: (session: StoredSession) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        localStorage.setItem(SESSION_EXPIRY_KEY, session.expires);
      }
    } catch (error) {
      console.error("Failed to store session:", error);
    }
  },

  // Get session from localStorage
  getSession: (): StoredSession | null => {
    try {
      if (typeof window === "undefined") return null;

      const sessionData = localStorage.getItem(SESSION_KEY);
      const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);

      if (!sessionData || !expiry) return null;

      // Check if session is expired
      if (new Date() > new Date(expiry)) {
        sessionStorage.clearSession();
        return null;
      }

      return JSON.parse(sessionData);
    } catch (error) {
      console.error("Failed to get session:", error);
      return null;
    }
  },

  // Clear session from localStorage
  clearSession: () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(SESSION_EXPIRY_KEY);
      }
    } catch (error) {
      console.error("Failed to clear session:", error);
    }
  },

  // Check if session exists and is valid
  hasValidSession: (): boolean => {
    const session = sessionStorage.getSession();
    return session !== null;
  },
};
