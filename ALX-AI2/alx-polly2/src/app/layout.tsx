import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/navigation";
import { AuthWrapper } from "@/components/auth-wrapper";
import { ErrorBoundary } from "@/components/error-boundary";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Improve perceived performance
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Improve perceived performance
});

export const metadata: Metadata = {
  title: "PollApp - Create and Vote on Polls",
  description: "A modern polling application built with Next.js",
  openGraph: {
    title: "PollApp - Create and Vote on Polls",
    description: "A modern polling application built with Next.js",
    type: "website",
    locale: "en_US",
    url: "https://pollapp.vercel.app",
    siteName: "PollApp",
  },
  twitter: {
    card: "summary_large_image",
    title: "PollApp - Create and Vote on Polls",
    description: "A modern polling application built with Next.js",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthWrapper>
          <ErrorBoundary>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-blue-600">
              Skip to content
            </a>
            <div className="flex flex-col min-h-screen">
              <header role="banner" className="sticky top-0 z-10 w-full">
                <Navigation />
              </header>
              <main id="main-content" className="flex-grow bg-gray-50">
                <Suspense fallback={<div className="flex justify-center items-center h-full p-4">Loading...</div>}>
                  {children}
                </Suspense>
              </main>
              <footer className="py-4 text-center text-sm text-gray-500 border-t bg-white" role="contentinfo">
                <div className="container mx-auto px-4">
                  <p>&copy; {new Date().getFullYear()} PollApp. All rights reserved.</p>
                  <div className="mt-2 flex justify-center space-x-4">
                    <a href="#" className="text-gray-500 hover:text-blue-600">Terms</a>
                    <a href="#" className="text-gray-500 hover:text-blue-600">Privacy</a>
                    <a href="#" className="text-gray-500 hover:text-blue-600">Contact</a>
                  </div>
                </div>
              </footer>
            </div>
          </ErrorBoundary>
        </AuthWrapper>
      </body>
    </html>
  );
}
