// UI COMPONENTS - src/components/ui/toast.tsx
// ==========================================
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useToast, Toast } from "@/hooks/use-toast";

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastComponent: React.FC<ToastProps> = ({ toast, onClose }) => {
  const typeStyles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconMap = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div
      className={cn(
        "pointer-events-auto w-full max-w-sm rounded-lg border p-4 shadow-lg transition-all",
        typeStyles[toast.type],
      )}
    >
      <div className="flex items-start">
        <div className="mr-3 text-lg">{iconMap[toast.type]}</div>
        <div className="flex-1">
          {toast.title && <div className="font-medium mb-1">{toast.title}</div>}
          <div className="text-sm">{toast.message}</div>
        </div>
        <button
          onClick={() => onClose(toast.id)}
          className="ml-3 opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 w-full md:bottom-4 md:right-4 md:top-4 md:w-96">
      <div className="space-y-2 p-4 md:p-0">
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
}
