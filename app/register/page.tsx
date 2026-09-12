import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginView } from "@/components/auth/LoginView";

export const metadata: Metadata = { title: "Create account" };

/** Same sign-in card as /login, opened on the "Register new" tab. */
export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-24 text-center text-forest/50">
          Loading…
        </div>
      }
    >
      <LoginView initialMethod="register" />
    </Suspense>
  );
}
