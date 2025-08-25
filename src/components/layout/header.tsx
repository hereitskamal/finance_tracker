"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Mobile Menu + Logo */}
          <div className="flex items-center space-x-3 lg:space-x-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-50 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </Button>

            <Link
              href="/dashboard"
              className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight"
            >
              <span className="hidden sm:block">ExpenseTracker</span>
              <span className="sm:hidden">ET</span>
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {session?.user ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gray-900 text-white text-xs sm:text-sm font-medium">
                  {getInitials(session.user.name || session.user.email || "U")}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {session.user.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-gray-500 hover:text-gray-700 px-2 sm:px-3"
                >
                  <span className="hidden sm:block">Sign out</span>
                  <span className="sm:hidden text-xs">Out</span>
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-4 sm:px-6 text-sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
