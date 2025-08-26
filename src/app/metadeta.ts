import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track your expenses and manage your budget",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["expense tracker", "budget", "finance", "pwa", "nextjs"],
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  authors: [{ name: "FinoTrack" }],
  viewport: "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "/icon-192x192.png" },
    { rel: "icon", url: "/icon-192x192.png" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Expense Tracker",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Expense Tracker",
    title: "Expense Tracker - Manage Your Budget",
    description: "Track your expenses and manage your budget efficiently",
  },
  twitter: {
    card: "summary",
    title: "Expense Tracker - Manage Your Budget",
    description: "Track your expenses and manage your budget efficiently",
  },
};

