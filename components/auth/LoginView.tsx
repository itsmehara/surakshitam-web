"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { requestOtp, DEMO_OTP } from "@/lib/auth";
import { useAuth } from "@/components/auth/AuthProvider";
import { Logo } from "@/components/ui/Logo";

type Method = "otp" | "password";

export function LoginView() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/account";
  const { loginOtp, loginPassword } = useAuth();

  const [method, setMethod] = useState<Method>("otp");
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (mobile.replace(/\D/g, "").length < 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    requestOtp(mobile);
    setOtp(DEMO_OTP);
    setStep("otp");
  }

  function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (loginOtp(mobile, otp, name)) router.push(next);
    else setError("Invalid code. Use a 4–6 digit OTP (demo: 1234).");
  }

  function verifyPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (loginPassword(username, password)) router.push(next);
    else setError("Incorrect username or password.");
  }

  const inputCls =
    "w-full rounded-lg border border-forest/15 px-4 py-2.5 text-sm focus:border-moss focus:outline-none";
  const labelCls = "mb-1 block text-xs font-medium text-forest/60";

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-lg border border-forest/8 bg-white/70 p-8 shadow-soft">
        <Logo />
        <h1 className="mt-6 font-serif text-2xl font-semibold text-forest">Sign in / Sign up</h1>

        {/* Method tabs */}
        <div className="mt-4 inline-flex rounded-full border border-forest/15 bg-white/60 p-1">
          {(["otp", "password"] as Method[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMethod(m);
                setError("");
                setStep("mobile");
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                method === m ? "bg-forest text-cream" : "text-forest/65 hover:text-forest"
              }`}
            >
              {m === "otp" ? "Mobile OTP" : "Password"}
            </button>
          ))}
        </div>

        {method === "otp" ? (
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
                  Name <span className="text-forest/40">(new customers)</span>
                </label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputCls} />
              </div>
              {error && <p className="text-sm text-clay">{error}</p>}
              <button type="submit" className="w-full rounded-full bg-forest px-5 py-3 text-sm font-medium text-cream hover:bg-ink">
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="mt-6 space-y-3">
              <p className="text-sm text-forest/60">Enter the code sent to {mobile}.</p>
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
              <button type="submit" className="w-full rounded-full bg-forest px-5 py-3 text-sm font-medium text-cream hover:bg-ink">
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
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. bhavesh" className={inputCls} />
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
            <button type="submit" className="w-full rounded-full bg-forest px-5 py-3 text-sm font-medium text-cream hover:bg-ink">
              Sign in
            </button>
          </form>
        )}

        <p className="mt-4 rounded-lg bg-parchment px-3 py-2 text-xs text-forest/60">
          {method === "otp" ? (
            <>
              Demo: OTP is simulated — use <b>{DEMO_OTP}</b> (any 4–6 digits work).
            </>
          ) : (
            <>
              Demo account — username <b>bhavesh</b>, password <b>demo123</b>.
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
