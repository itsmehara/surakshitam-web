import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginView } from "@/components/auth/LoginView";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container py-24 text-center text-forest/50">Loading…</div>}>
      <LoginView />
    </Suspense>
  );
}
