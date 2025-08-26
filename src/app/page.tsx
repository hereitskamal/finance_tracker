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
  Code,
  Coffee,
  Github,
  Mail,
  Heart,
  Zap,
  Star,
  BarChart3,
  DollarSign,
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);
    
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );
    return () => {
      clearInterval(interval);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowInstall(false);
      console.log(`Install outcome: ${outcome}`);
    } else {
      alert("To install this app:\n\n• On Android: Tap the menu (⋮) and select 'Install app'\n• On iOS: Tap Share (📤) and select 'Add to Home Screen'\n• On Desktop: Look for the install icon in your browser's address bar");
    }
  };


  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Freelancer",
      quote: "Finally, a tool that makes expense tracking effortless.",
      rating: 5
    },
    {
      name: "Mike Torres",
      role: "Small Business Owner",
      quote: "Saved me Rs 2,000 in the first month alone.",
      rating: 5
    },
    {
      name: "Lisa Park",
      role: "Budget Enthusiast",
      quote: "The insights are incredibly accurate and helpful.",
      rating: 5
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Glassmorphism Install Button */}
      {showInstall && (
        <div className="fixed top-6 right-6 z-50">
          <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 transition-all duration-300"
              >
                <Download className="w-4 h-4 text-gray-900" />
                <span className="text-sm font-medium text-gray-900 hidden sm:block">
                  Install App
                </span>
              </button>
              <button
                onClick={() => setShowInstall(false)}
                className="p-3 hover:bg-white/10 border-l border-white/20 transition-all duration-300"
              >
                <X className="w-4 h-4 text-gray-900" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Enhanced Typography */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="relative max-w-6xl mx-auto px-4 py-20 text-center">
          {/* Trust Badge */}
          <div
            className={`inline-flex items-center px-6 py-3 backdrop-blur-lg bg-white/30 border border-white/40 rounded-full mb-8 transition-all duration-1000 shadow-lg ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <Sparkles className="w-4 h-4 mr-2 text-gray-700" />
            <span className="text-sm font-medium text-gray-800">
              Trusted by 10,000+ users worldwide
            </span>
          </div>
          
          {/* Big Typography Hero */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-light text-gray-900 mb-4 tracking-tight leading-none">
              Smart
            </h1>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 mb-8 tracking-tight leading-none">
              Expenses
            </h1>
          </div>
          
          {/* Subtitle with Glassmorphism */}
          <div
            className={`backdrop-blur-lg bg-white/20 border border-white/30 rounded-3xl p-8 mb-12 max-w-3xl mx-auto transition-all duration-1000 delay-500 shadow-xl ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed">
              Take control of your finances with intelligent tracking, beautiful insights, and actionable recommendations.
            </p>
          </div>
          
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
                className="group bg-gray-900 hover:bg-gray-800 text-white rounded-full px-12 py-6 text-lg font-medium shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105"
              >
                Start Tracking Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="backdrop-blur-lg bg-white/30 border-2 border-white/40 text-gray-800 hover:bg-white/40 rounded-full px-12 py-6 text-lg font-medium transition-all duration-500 hover:scale-105 shadow-lg"
              >
                Sign In
              </Button>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div
            className={`flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 transition-all duration-1000 delay-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {[
              { icon: Shield, text: "Bank-level security" },
              { icon: Users, text: "10K+ active users" },
              { icon: CheckCircle, text: "99.9% uptime" }
            ].map((item, index) => (
              <div key={index} className="flex items-center backdrop-blur-lg bg-white/20 border border-white/30 rounded-full px-4 py-2">
                <item.icon className="w-4 h-4 mr-2" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-light text-gray-900 mb-4 tracking-tight">
              Everything you
            </h2>
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make expense tracking effortless and insights actionable.
            </p>
          </div>
          
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px]">
            {/* Main Feature Card - Large */}
            <div className="lg:col-span-8 lg:row-span-2 group relative overflow-hidden">
              <div className="h-full backdrop-blur-lg bg-gradient-to-br from-white/40 to-white/20 border border-white/30 rounded-3xl p-8 hover:scale-[1.02] transition-all duration-500 shadow-xl hover:shadow-2xl">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mb-6">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Smart Analytics</h3>
                    <p className="text-lg text-gray-700 leading-relaxed mb-8">
                      AI-powered insights that help you understand your spending patterns and make better financial decisions with real-time analysis.
                    </p>
                  </div>
                  <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/40">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-600">Accuracy Rate</span>
                      <span className="text-2xl font-bold text-gray-900">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-gray-900 to-gray-700 h-2 rounded-full w-[92%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Feature Cards */}
            <div className="lg:col-span-4 group">
              <div className="h-full backdrop-blur-lg bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-white/30 rounded-3xl p-6 hover:scale-[1.02] transition-all duration-500 shadow-xl">
                <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-gray-800" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Goal Tracking</h3>
                <p className="text-gray-700 text-sm">Set and achieve financial goals 3x faster</p>
              </div>
            </div>

            <div className="lg:col-span-4 group">
              <div className="h-full backdrop-blur-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/30 rounded-3xl p-6 hover:scale-[1.02] transition-all duration-500 shadow-xl">
                <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center mb-4">
                  <PieChart className="w-6 h-6 text-gray-800" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Visual Reports</h3>
                <p className="text-gray-700 text-sm">50+ beautiful chart types available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Stats Cards */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Happy Users", icon: Users },
              { value: "$2M+", label: "Tracked", icon: DollarSign },
              { value: "99.9%", label: "Uptime", icon: Shield },
              { value: "4.9★", label: "Rating", icon: Star }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="backdrop-blur-lg bg-white/30 border border-white/40 rounded-3xl p-8 text-center hover:scale-105 transition-all duration-500 shadow-xl">
                  <stat.icon className="w-8 h-8 mx-auto mb-4 text-gray-700" />
                  <div className="text-4xl lg:text-5xl font-light text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Glassmorphism Testimonials */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-5xl font-light text-gray-900 text-center mb-16 tracking-tight">
            What our <span className="font-bold">users say</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group">
                <div className="backdrop-blur-lg bg-white/30 border border-white/40 rounded-3xl p-8 hover:scale-[1.02] transition-all duration-500 shadow-xl">
                  <div className="flex items-center mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed italic">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Developer Section with Glassmorphism */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 backdrop-blur-lg bg-white/10 border border-white/20 rounded-full mb-6">
              <Code className="w-4 h-4 mr-2 text-gray-300" />
              <span className="text-sm font-medium text-gray-300">Made with passion</span>
            </div>
            <h2 className="text-5xl font-light text-white mb-6 tracking-tight">
              Crafted by a
              <span className="block font-bold">passionate developer</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built with modern technologies and attention to detail for the perfect user experience.
            </p>
          </div>
          
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 lg:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-600/50 to-gray-800/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-6 border border-white/20">
                    <Coffee className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">Kamal Sharma</h3>
                    <p className="text-gray-300 text-lg">Full Stack Developer</p>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                  Passionate about creating beautiful, functional applications that solve real-world problems. 
                  This expense tracker represents my commitment to clean code, user experience, and cutting-edge design.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="mailto:itskamalofficial@gmail.com" 
                    className="group inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Get in touch
                  </a>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group inline-flex items-center px-8 py-4 backdrop-blur-lg bg-white/10 border border-white/30 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  >
                    <Github className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    View Projects
                  </a>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Zap className="w-6 h-6 mr-2 text-yellow-400" />
                    Modern Tech Stack
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {["Next.js", "TypeScript", "Tailwind CSS", "PWA Ready"].map((tech) => (
                      <div key={tech} className="backdrop-blur-sm bg-white/5 rounded-lg p-3 text-center">
                        <span className="text-gray-300 text-sm font-medium">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Heart className="w-6 h-6 mr-2 text-red-400" />
                    Key Features
                  </h4>
                  <div className="space-y-3">
                    {["Responsive design for all devices", "Glassmorphism UI effects", "Offline functionality", "Lightning fast performance"].map((feature) => (
                      <div key={feature} className="flex items-center text-gray-300">
                        <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA with Enhanced Glassmorphism */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl"></div>
            <div className="absolute inset-0 backdrop-blur-lg bg-white/5 rounded-3xl"></div>
            <div className="relative p-12 lg:p-16 text-center text-white">
              <h2 className="text-5xl sm:text-6xl font-light mb-6 tracking-tight">
                Ready to take control of
                <span className="block font-bold">your finances?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Join thousands of users who&apos;ve already transformed their financial habits with our intelligent tracking system.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="group bg-white text-gray-900 hover:bg-gray-100 rounded-full px-12 py-6 text-xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl"
                  >
                    Start Free Today
                    <IndianRupee className="w-6 h-6 ml-2 group-hover:scale-110 transition-transform" />
                  </Button>
                </Link>
                <p className="text-gray-400 font-medium">No credit card required • 30-day free trial</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}