"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Mail, ArrowLeft, Sparkles } from "lucide-react";

const ALLOWED_DOMAINS = ["@utp.edu.my", "@student.utp.edu.my"];

function isValidUtpEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return ALLOWED_DOMAINS.some((domain) => normalized.endsWith(domain));
}

export default function LoginPage() {
  const sendMagicLink = useAuthStore((s) => s.sendMagicLink);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your UTP email address.");
      return;
    }

    if (!isValidUtpEmail(email)) {
      setError("Access Denied: Please use your official UTP email address.");
      return;
    }

    setSending(true);
    const err = await sendMagicLink(email);
    setSending(false);

    if (err) {
      setError(err);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/[0.02] p-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/[0.07] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/[0.04] via-transparent to-transparent" />
        <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
          <div className="space-y-7 rounded-2xl border bg-card/80 p-8 text-center shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Check your inbox
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We sent a magic login link to{" "}
                <span className="font-medium text-foreground">{email}</span>.
                Click the link in the email to sign in.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Use a different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/[0.02] p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/[0.07] via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/[0.04] via-transparent to-transparent" />

      <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.03] blur-3xl" />

      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="rounded-2xl border bg-card/80 p-8 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-10">
          <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
              Welcome to UTPreneurs
            </h1>
            <p className="text-balance px-2 text-center text-sm text-muted-foreground">
              Connecting the UTP community to buy and sell. Fast and secure.
            </p>
          </div>

          <form onSubmit={handleSendLink} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                UTP Email Address
              </label>
              <div className="relative">
                <Mail
                  className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                    focused ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <input
                  id="email"
                  type="email"
                  placeholder="your@utp.edu.my"
                  value={email}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="h-12 w-full rounded-xl border bg-background pl-10 pr-3.5 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                />
              </div>
              <p className="mt-2.5 text-left text-xs leading-relaxed text-muted-foreground/70">
                An authentication link will be sent to your email, use it to login
              </p>
            </div>

            {error && (
              <p className="animate-in fade-in slide-in-from-top-1 text-sm font-medium text-destructive duration-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="group relative w-full overflow-hidden rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              {sending ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Sending...
                </span>
              ) : (
                "Send Link"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground/50">
          UTPreneurs &mdash; UTP Marketplace
        </p>
      </div>
    </div>
  );
}
