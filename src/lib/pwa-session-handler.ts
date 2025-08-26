// PWA session handler for managing session persistence
"use client";

import { sessionStorage } from "./session-storage";

export class PWASessionHandler {
  private static instance: PWASessionHandler;
  private isInitialized = false;

  static getInstance(): PWASessionHandler {
    if (!PWASessionHandler.instance) {
      PWASessionHandler.instance = new PWASessionHandler();
    }
    return PWASessionHandler.instance;
  }

  initialize() {
    if (this.isInitialized || typeof window === "undefined") return;

    // Handle PWA lifecycle events
    this.setupPWAEventListeners();
    this.setupVisibilityChangeHandler();
    this.setupBeforeUnloadHandler();

    this.isInitialized = true;
  }

  private setupPWAEventListeners() {
    // Handle PWA install and activation
    window.addEventListener("beforeinstallprompt", () => {
      console.log("PWA install prompt ready");
    });

    // Handle PWA app state changes
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "PWA_SESSION_CHECK") {
          // Respond with current session status
          const hasSession = sessionStorage.hasValidSession();
          event.ports[0]?.postMessage({ hasSession });
        }
      });
    }
  }

  private setupVisibilityChangeHandler() {
    // Handle when PWA becomes visible/hidden
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        // PWA became visible - check session validity
        this.validateSessionOnResume();
      }
    });
  }

  private setupBeforeUnloadHandler() {
    // Handle PWA close/refresh
    window.addEventListener("beforeunload", () => {
      // Session is already stored in localStorage, no additional action needed
      console.log("PWA closing - session preserved in localStorage");
    });
  }

  private validateSessionOnResume() {
    // Check if stored session is still valid when PWA resumes
    const storedSession = sessionStorage.getSession();
    if (storedSession) {
      const now = new Date();
      const expiry = new Date(storedSession.expires);

      if (now > expiry) {
        console.log("Stored session expired, clearing...");
        sessionStorage.clearSession();
        // Trigger a page reload to handle expired session
        window.location.reload();
      }
    }
  }

  // Method to sync session with server when PWA resumes
  async syncSessionWithServer() {
    try {
      const response = await fetch("/api/auth/restore-session");
      if (response.ok) {
        const result = await response.json();
        if (result.valid && result.session?.user) {
          // Update local storage with fresh session data
          sessionStorage.setSession({
            user: result.session.user,
            expires: result.session.expires,
          });
          return true;
        } else {
          // Server session is invalid, clear local storage
          sessionStorage.clearSession();
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error("Failed to sync session with server:", error);
      return false;
    }
  }
}

// Auto-initialize when imported
if (typeof window !== "undefined") {
  PWASessionHandler.getInstance().initialize();
}
