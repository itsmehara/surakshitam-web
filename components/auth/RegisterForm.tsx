"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEMO_OTP, requestOtp } from "@/lib/auth";
import { isValidEmail, isValidMobile, findAccount } from "@/lib/users";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Customer self-registration: name + mobile (+ optional email and password),
 * then a simulated OTP to confirm the mobile before the account is created.
 * Rendered as the "Register new" tab of the sign-in card (`LoginView`).
 */
export function RegisterForm({
  next,
  inputCls,
  labelCls,
}: {
  next: string;
  inputCls: string;
  labelCls: string;
}) {
  const router = useRouter();
  const { register } = useAuth();

  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  function validateDetails(): string {
    if (name.trim().length < 2) return "Please enter your name.";
    if (!isValidMobile(mobile))
      return "Enter a valid 10-digit Indian mobile number.";
    if (email.trim() && !isValidEmail(email))
      return "That email address doesn't look right.";
    if (password && password.length < 4)
      return "Password must be at least 4 characters.";
    if (password !== confirm) return "Password and confirmation don't match.";
    const clash =
      findAccount(mobile) || (email.trim() ? findAccount(email) : null);
    if (clash)
      return "An account with this mobile or email already exists — please sign in instead.";
    return "";
  }

  function submitDetails(e: React.FormEvent) {
    e.preventDefault();
    const err = validateDetails();
    setError(err);
    if (err) return;
    requestOtp(mobile);
    setOtp(DEMO_OTP);
    setStep("otp");
  }

  function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^\d{4,6}$/.test(otp.trim())) {
      setError("Enter the 4–6 digit code.");
      return;
    }
    const r = register({
      name,
      mobile,
      email: email.trim() || undefined,
      password: password || undefined,
    });
    if (r.ok) router.push(next);
    else setError(r.error);
  }

  return (
    <>
      {step === "details" ? (
        <form onSubmit={submitDetails} className="mt-6 space-y-3" noValidate>
          <div>
            <label className={labelCls}>Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Mobile number</label>
            <input
              inputMode="numeric"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit mobile"
              autoComplete="tel"
              className={inputCls}
            />
            <p className="mt-1 text-[11px] text-forest/45">
              Your mobile is your login ID and where order updates go.
            </p>
          </div>
          <div>
            <label className={labelCls}>
              Email <span className="text-forest/40">(optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>
              Password{" "}
              <span className="text-forest/40">
                (optional — you can always sign in with OTP)
              </span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 4 characters"
              autoComplete="new-password"
              className={inputCls}
            />
          </div>
          {password && (
            <div>
              <label className={labelCls}>Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password"
                autoComplete="new-password"
                className={inputCls}
              />
            </div>
          )}
          {error && <p className="text-sm text-clay">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-forest px-5 py-3 text-sm font-medium text-cream hover:bg-ink"
          >
            Continue — verify mobile
          </button>
        </form>
      ) : (
        <form onSubmit={submitOtp} className="mt-6 space-y-3">
          <p className="text-sm text-forest/60">
            Enter the code sent to {mobile} to confirm your number.
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
            Verify &amp; create account
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("details");
              setError("");
            }}
            className="w-full rounded-full px-5 py-2 text-sm font-medium text-forest/60 hover:text-forest"
          >
            ← Edit details
          </button>
        </form>
      )}
    </>
  );
}
