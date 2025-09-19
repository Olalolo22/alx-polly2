"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthForm } from "@/components/ui/AuthForm";
import { createClient } from "@/lib/supabase-client";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  const handleAuth = async (email: string, password: string) => {
    setLoading(true);
    let error;
    if (mode === "login") {
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
    } else {
      ({ error } = await supabase.auth.signUp({ email, password }));
    }
    setLoading(false);
    if (error) return error.message;
    router.push("/polls");
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Sign in to your account to access your polls"
              : "Register to start creating and voting on polls"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode={mode} onSubmit={handleAuth} loading={loading} />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => setMode("register")}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => setMode("login")}
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
