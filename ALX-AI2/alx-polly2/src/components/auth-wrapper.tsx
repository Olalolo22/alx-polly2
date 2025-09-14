"use client";

import { AuthProvider } from "@/contexts/auth-context";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}