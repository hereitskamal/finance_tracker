"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BottomNavigation } from "@/components/layout/BottomNavigation"; // Import bottom nav
import { AuthGuard } from "@/components/auth/auth-guard";
import { StorageDebug } from "@/components/debug/storage-debug";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="h-screen bg-white flex flex-col overflow-hidden">
        {/* Header - hidden on mobile */}
        <div className="md:block hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Mobile Navigation */}
          <MobileNav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-auto p-4 sm:p-4 md:p-6 pb-20 md:pb-6">
              <div className="max-w-6xl mx-auto">{children}</div>
            </div>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNavigation />

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Debug Component */}
        <StorageDebug />
      </div>
    </AuthGuard>
  );
}
