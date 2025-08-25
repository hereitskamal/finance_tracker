"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Shield,
} from "lucide-react";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (password.length < 6)
      return { strength: "weak", color: "text-red-500", bg: "bg-red-100" };
    if (password.length < 8)
      return {
        strength: "fair",
        color: "text-orange-500",
        bg: "bg-orange-100",
      };
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) {
      return {
        strength: "strong",
        color: "text-green-500",
        bg: "bg-green-100",
      };
    }
    return { strength: "good", color: "text-blue-500", bg: "bg-blue-100" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await apiClient.register({ name, email, password });
      router.push(
        "/login?message=Account created successfully! Please sign in.",
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">💰</span>
        </div>
        <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-2">
          Create Account
        </h1>
        <p className="text-gray-500">
          Start your journey to better financial management
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-400" />
              Full Name
            </label>
            <Input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 px-4 rounded-xl border-gray-200 focus:border-gray-900 focus:ring-0 text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              Email Address
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 px-4 rounded-xl border-gray-200 focus:border-gray-900 focus:ring-0 text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Lock className="w-4 h-4 mr-2 text-gray-400" />
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-12 px-4 pr-12 rounded-xl border-gray-200 focus:border-gray-900 focus:ring-0 text-gray-900 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div
                className={`flex items-center space-x-2 p-2 rounded-lg ${passwordStrength.bg}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${passwordStrength.color.replace("text-", "bg-")}`}
                />
                <span
                  className={`text-xs font-medium ${passwordStrength.color}`}
                >
                  Password strength: {passwordStrength.strength}
                </span>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                Your data is secure
              </p>
              <p className="text-xs text-blue-700">
                We use industry-standard encryption to protect your information
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-xl border border-red-100">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-all duration-200 group"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </Button>

          {/* Terms Notice */}
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link
              href="/terms"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </form>
      </div>

      {/* Sign In Link */}
      <div className="text-center mt-8">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
