// ==========================================
// HOOKS - src/hooks/use-toast.ts
// ==========================================
"use client";

import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, title?: string) => {
      return addToast({ message, title, type: "success" });
    },
    [addToast],
  );

  const error = useCallback(
    (message: string, title?: string) => {
      return addToast({ message, title, type: "error" });
    },
    [addToast],
  );

  const warning = useCallback(
    (message: string, title?: string) => {
      return addToast({ message, title, type: "warning" });
    },
    [addToast],
  );

  const info = useCallback(
    (message: string, title?: string) => {
      return addToast({ message, title, type: "info" });
    },
    [addToast],
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}
