"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  TrendingUp,
  Plus,
  Search,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/expenses?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const quickActions = [
    {
      title: "Dashboard",
      description: "View your financial overview",
      href: "/dashboard",
      icon: Home,
      color: "from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Add Expense",
      description: "Record a new transaction",
      href: "/expenses/add",
      icon: Plus,
      color: "from-green-50 to-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "View Analytics",
      description: "Check spending insights",
      href: "/analytics",
      icon: TrendingUp,
      color: "from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div
          className={`mb-12 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="text-8xl sm:text-9xl font-light text-gray-900 mb-4 tracking-tight">
            4
            <span className="inline-block animate-bounce text-6xl sm:text-7xl mx-2">
              💸
            </span>
            4
          </div>

          <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-4 tracking-tight">
            Page Not Found
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
            Looks like this page vanished faster than your weekend budget! Let&apos;s
            get you back on track.
          </p>
        </div>

        {/* Search Bar */}
        <div
          className={`mb-12 transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for expenses, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
              />
            </div>
          </form>
        </div>

        {/* Quick Actions */}
        <div
          className={`mb-12 transition-all duration-1000 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-8">
            Or try one of these popular actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  href={action.href}
                  className={`group p-6 bg-gradient-to-br ${action.color} rounded-2xl border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300`}
                >
                  <div
                    className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-6 h-6 ${action.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Navigation Links */}
        <div
          className={`mb-12 transition-all duration-1000 delay-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Explore More
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "All Expenses", href: "/expenses" },
                { name: "Categories", href: "/categories" },
                { name: "Analytics", href: "/analytics" },
                { name: "Settings", href: "/settings" },
              ].map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="group flex items-center justify-center py-3 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-xl transition-all duration-200"
                >
                  {link.name}
                  <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Back Navigation */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 transition-all duration-1000 delay-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors group"
          >
            <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
            <span className="text-sm font-medium">Go Back</span>
          </button>

          <div className="hidden sm:block w-px h-4 bg-gray-300" />

          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors group"
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Fun Footer Message */}
        <div
          className={`mt-16 transition-all duration-1000 delay-1200 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <p className="text-xs text-gray-400 leading-relaxed">
            &quot;The best way to predict your financial future is to track it.&quot;{" "}
            <br />
            Let&apos;s get back to building your wealth! 💪
          </p>
        </div>
      </div>
    </div>
  );
}
