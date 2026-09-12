"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { requestOtp, isRegisteredMobile, DEMO_OTP } from "@/lib/auth";
import { useAuth } from "@/components/auth/AuthProvider";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Logo } from "@/components/ui/Logo";

type Method = "otp" | "password" | "register";
const METHODS: { id: Method; label: string }[] = [
  { id: "otp", label: "Mobile OTP" },
  { id: "password", label: "Password" },
  { id: "register", label: "Register new" },
];

/**
 * One sign-in card with three tabs — Mobile OTP / Password / Register new.
 * `/register` renders this same card with the Register tab pre-selected, and
 * `?method=` does the same from any link (e.g. `/login?method=register`).
 */
export function LoginView({ initialMethod }: { initialMethod?: Method } = {}) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/account";
  const { loginOtp, loginPassword } = useAuth();

  const fromQuery = params.get("method");
  const startMethod: Method =
    initialMethod ??
    (METHODS.some((m) => m.id === fromQuery) ? (fromQuery as Method) : "otp");
  const [method, setMethod] = useState<Method>(startMethod);
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isNew, setIsNew] = useState(false);

  function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (mobile.replace(/\D/g, "").length < 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    const unknown = !isRegisteredMobile(mobile);
    if (unknown && !name.trim()) {
      setIsNew(true);
      setError(
        "This number isn't registered yet. Add your name to create an account, or use the Register new tab.",
      );
      return;
    }
    setIsNew(unknown);
    requestOtp(mobile);
    setOtp(DEMO_OTP);
    setStep("otp");
  }

  function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const r = loginOtp(mobile, otp, name);
    if (r.ok) router.push(next);
    else setError(r.error);
  }

  function verifyPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const r = loginPassword(username, password);
    if (r.ok) router.push(next);
    else setError(r.error);
  }

  const inputCls =
    "w-full rounded-lg border border-forest/15 px-4 py-2.5 text-sm focus:border-moss focus:outline-none";
  const labelCls = "mb-1 block text-xs font-medium text-forest/60";

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-lg border border-forest/8 bg-white/70 p-8 shadow-soft">
        <Logo />
        <h1 className="mt-6 font-serif text-2xl font-semibold text-forest">
          {method === "register" ? "Create your account" : "Sign in"}
        </h1>
        <p className="mt-1 text-sm text-forest/60">
          {method === "register"
            ? "Takes a minute — your mobile is your login."
            : "New here? Pick Register new to create an account."}
        </p>

        {/* Method tabs */}
        <div
          role="tablist"
          aria-label="Sign-in method"
          className="mt-4 flex w-full rounded-full border border-forest/15 bg-white/60 p-1"
        >
          {METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={method === m.id}
              onClick={() => {
                setMethod(m.id);
                setError("");
                setStep("mobile");
              }}
              className={`flex-1 whitespace-nowrap rounded-full px-2 py-1.5 text-sm font-medium transition-colors ${
                method === m.id
                  ? "bg-forest text-cream"
                  : "text-forest/65 hover:text-forest"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {method === "register" ? (
          <div className="mt-6">
            <RegisterForm next={next} inputCls={inputCls} labelCls={labelCls} />
          </div>
        ) : method === "otp" ? (
          step === "mobile" ? (
            <form onSubmit={sendOtp} className="mt-6 space-y-3">
              <div>
                <label className={labelCls}>Mobile number</label>
                <input
                  inputMode="numeric"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit mobile"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  Name{" "}
                  <span className="text-forest/40">(new customers only)</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={`${inputCls} ${isNew && !name.trim() ? "border-clay" : ""}`}
                />
              </div>
              {error && <p className="text-sm text-clay">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-full bg-forest px-5 py-3 text-sm font-medium text-cream hover:bg-ink"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="mt-6 space-y-3">
              <p className="text-sm text-forest/60">
                Enter the code sent to {mobile}.
                {isNew && (
                  <span className="mt-1 block text-moss">
                    We&apos;ll create your account as {name.trim()}.
                  </span>
                )}
              </p>
              <div>
                <label className={labelCls}>One-time code</label>
                <input
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="4–6 digit code"
                  className={`${inputCls} tracking-widest`}
                />
              </div>
              {error && <p className="text-sm text-clay">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-full bg-forest px-5 py-3 text-sm font-medium text-cream hover:bg-ink"
              >
                Verify &amp; sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("mobile");
                  setError("");
                }}
                className="w-full rounded-full px-5 py-2 text-sm font-medium text-forest/60 hover:text-forest"
              >
                ← Change number
              </button>
            </form>
          )
        ) : (
          <form onSubmit={verifyPassword} className="mt-6 space-y-3">
            <div>
              <label className={labelCls}>Username / email / mobile</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. bhavesh"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={inputCls}
              />
            </div>
            {error && <p className="text-sm text-clay">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-full bg-forest px-5 py-3 text-sm font-medium text-cream hover:bg-ink"
            >
              Sign in
            </button>
          </form>
        )}

        <p className="mt-4 rounded-lg bg-parchment px-3 py-2 text-xs text-forest/60">
          {method === "otp" ? (
            <>
              Demo: OTP is simulated — use <b>{DEMO_OTP}</b> (any 4–6 digits
              work).
            </>
          ) : method === "register" ? (
            <>
              Demo: OTP is simulated — use <b>{DEMO_OTP}</b>. Accounts are
              stored in this browser only.
            </>
          ) : (
            <>
              Demo account — username <b>bhavesh</b>, password <b>demo123</b>.
              Registered customers sign in with their mobile or email.
            </>
          )}
        </p>
        <p className="mt-3 text-center text-xs text-forest/50">
          Prefer to browse?{" "}
          <Link href="/shop" className="font-medium text-moss">
            Continue shopping
          </Link>
        </p>
      </div>
    </div>
  );
}
