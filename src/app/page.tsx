"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  PieChart,
  Target,
  Sparkles,
  CheckCircle,
  Users,
  Shield,
  IndianRupee,
  Download,
  X,
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);

    // PWA Install Prompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowInstall(false);
      console.log(`Install outcome: ${outcome}`);
    }
  };

  const features = [
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description:
        "AI-powered insights that help you understand your spending patterns and make better financial decisions.",
      stats: "92% accuracy",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description:
        "Set financial goals and track your progress with intelligent recommendations and milestone celebrations.",
      stats: "3x faster results",
    },
    {
      icon: PieChart,
      title: "Visual Reports",
      description:
        "Beautiful, intuitive reports that make complex financial data easy to understand and act upon.",
      stats: "50+ chart types",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Freelancer",
      quote: "Finally, a tool that makes expense tracking effortless.",
    },
    {
      name: "Mike Torres",
      role: "Small Business Owner",
      quote: "Saved me Rs 2,000 in the first month alone.",
    },
    {
      name: "Lisa Park",
      role: "Budget Enthusiast",
      quote: "The insights are incredibly accurate and helpful.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Install Button - Fixed Top Right */}
      {showInstall && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-gray-900 text-white rounded-full shadow-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-800 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:block">Install App</span>
              </button>
              <button
                onClick={() => setShowInstall(false)}
                className="p-3 hover:bg-gray-800 border-l border-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gray-900 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-gray-700 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div
              className={`inline-flex items-center px-4 py-2 bg-gray-100 rounded-full mb-8 transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <Sparkles className="w-4 h-4 mr-2 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">
                Trusted by 10,000+ users
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className={`text-5xl sm:text-6xl lg:text-7xl font-light text-gray-900 mb-8 tracking-tight transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <span className="block mb-2">Expense Tracking</span>
              <span className="font-bold">Simplified</span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              Take control of your finances with intelligent tracking, beautiful
              insights, and actionable recommendations.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-1000 delay-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="group bg-gray-900 hover:bg-gray-800 text-white rounded-full px-10 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Tracking Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-10 py-4 text-lg font-medium transition-all duration-300"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div
              className={`flex items-center justify-center space-x-8 text-sm text-gray-500 transition-all duration-1000 delay-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Bank-level security
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                10K+ active users
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                99.9% uptime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Everything you need to
              <span className="block font-bold">master your money</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make expense tracking effortless and
              insights actionable.
            </p>
          </div>

          {/* Interactive Features */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;

              return (
                <div
                  key={index}
                  className={`group relative p-8 bg-white rounded-3xl border transition-all duration-500 cursor-pointer ${
                    isActive
                      ? "border-gray-900 shadow-xl scale-105"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                      isActive
                        ? "bg-gray-900"
                        : "bg-gray-100 group-hover:bg-gray-200"
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 transition-colors duration-300 ${
                        isActive ? "text-white" : "text-gray-600"
                      }`}
                    />
                  </div>

                  <h3
                    className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                      isActive ? "text-gray-900" : "text-gray-800"
                    }`}
                  >
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  <div
                    className={`text-sm font-medium ${
                      isActive ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {feature.stats}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl lg:text-5xl font-light text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                10K+
              </div>
              <p className="text-gray-600 font-medium">Happy Users</p>
            </div>

            <div className="group">
              <div className="text-4xl lg:text-5xl font-light text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                $2M+
              </div>
              <p className="text-gray-600 font-medium">Tracked</p>
            </div>

            <div className="group">
              <div className="text-4xl lg:text-5xl font-light text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                99.9%
              </div>
              <p className="text-gray-600 font-medium">Uptime</p>
            </div>

            <div className="group">
              <div className="text-4xl lg:text-5xl font-light text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                4.9★
              </div>
              <p className="text-gray-600 font-medium">Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-light text-gray-900 text-center mb-16 tracking-tight">
            What our users say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
              >
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="bg-gray-900 rounded-3xl p-12 lg:p-16 text-white">
            <h2 className="text-4xl sm:text-5xl font-light mb-6 tracking-tight">
              Ready to take control of
              <span className="block font-bold">your finances?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who&apos;ve already transformed their financial
              habits.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="group bg-white text-gray-900 hover:bg-gray-100 rounded-full px-10 py-4 text-lg font-medium transition-all duration-300"
                >
                  Start Free Today
                  <IndianRupee className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>

              <p className="text-sm text-gray-400">No credit card required</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
