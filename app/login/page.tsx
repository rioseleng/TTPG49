"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { createClient } from "@/lib/supabase";
import { Mail, ArrowRight, ArrowLeft, Sparkles, ChevronDown, Lock } from "lucide-react";

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

  // Test login state
  const [testEmail, setTestEmail] = useState("");
  const [testPassword, setTestPassword] = useState("");
  const [testLogging, setTestLogging] = useState(false);
  const [testError, setTestError] = useState("");
  const [showTestLogin, setShowTestLogin] = useState(true);

  const handleTestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestError("");

    if (!testEmail.trim() || !testPassword.trim()) {
      setTestError("Please enter email and password.");
      return;
    }

    setTestLogging(true);
    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail.trim(),
      password: testPassword,
    });

    if (signInError) {
      setTestError(signInError.message);
      setTestLogging(false);
      return;
    }

    // Refresh the auth store to pick up the new session
    // The page will redirect via the auth state listener
    window.location.href = "/profile";
  };

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
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl p-8 shadow-[0px_4px_12px_rgba(0,33,71,0.08)]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fdc34d]/20">
              <Mail className="h-7 w-7 text-[#715000]" />
            </div>
            <h2 className="font-headline text-[28px] md:text-[32px] font-bold text-[#1a1c1c] mb-2">
              Check your inbox
            </h2>
            <p className="font-body text-body-md text-[#44474e] max-w-sm mx-auto">
              We sent a magic login link to{" "}
              <span className="font-semibold text-[#1a1c1c]">{email}</span>.
              Click the link in the email to sign in.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#715000] underline-offset-4 transition-colors hover:text-[#001b3d] hover:underline"
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
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl p-8 shadow-[0px_4px_12px_rgba(0,33,71,0.08)]">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#002147]/10">
            <Sparkles className="h-6 w-6 text-[#002147]" />
          </div>

          <div className="text-center mb-6">
            <h1 className="font-headline text-[28px] md:text-[32px] font-bold text-[#1a1c1c]">
              Welcome Back
            </h1>
            <p className="font-body text-body-md text-[#44474e] mt-1">
              Enter your university email to receive a secure login link.
            </p>
          </div>

          <form onSubmit={handleSendLink} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="font-label text-label-md text-[#44474e] ml-1 uppercase mb-1 block"
              >
                UTP Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#74777f]">
                  <Mail
                    className={`h-4 w-4 transition-colors ${
                      focused ? "text-[#002147]" : ""
                    }`}
                  />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="student@utp.edu"
                  value={email}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#c4c6cf] rounded-lg outline-none transition-all placeholder:text-[#c4c6cf] font-body text-body-md focus:border-[#002147] focus:ring-2 focus:ring-[rgba(0,33,71,0.12)]"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-[#ba1a1a]">{error}</p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-2 bg-[#fdc34d] text-[#001b3d] transition-all hover:shadow-[0px_8px_24px_rgba(253,195,77,0.32)] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:hover:shadow-none disabled:hover:translate-y-0"
            >
              {sending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#001b3d]/30 border-t-[#001b3d]" />
                  Sending...
                </span>
              ) : (
                <>
                  <span>Send Authentication Link</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-label text-label-md text-[#74777f]">
              By signing in, you agree to our{" "}
              <a
                href="#"
                className="font-bold text-[#715000] hover:underline"
              >
                Academic Integrity Guidelines
              </a>
              .
            </p>
          </div>
        </div>

        <p className="mt-6 text-center font-label text-label-md text-[#74777f]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-[#715000] hover:underline"
          >
            Sign up
          </Link>
        </p>

        {/* Test Login Collapsible */}
        <div className="mt-8 border-t border-[#e2e2e2] pt-6">
          <button
            type="button"
            onClick={() => setShowTestLogin(!showTestLogin)}
            className="w-full flex items-center justify-center gap-2 text-sm text-[#74777f] hover:text-[#002147] transition-colors"
          >
            <Lock className="w-4 h-4" />
            <span className="font-medium">
              {showTestLogin ? "Hide Test Login" : "Test Login (Development Only)"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showTestLogin ? "rotate-180" : ""
              }`}
            />
          </button>

          {showTestLogin && (
            <div className="mt-4 bg-[#f3f3f4] rounded-xl p-5 border border-[#c4c6cf]/40">
              <p className="font-body text-body-md text-[#44474e] mb-4">
                Quick sign-in for testing. Create a test user in your{" "}
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#002147] underline underline-offset-2"
                >
                  Supabase Auth dashboard
                </a>{" "}
                first, then use those credentials here.
              </p>
              <form onSubmit={handleTestLogin} className="space-y-3">
                <div>
                  <input
                    type="email"
                    placeholder="Test email"
                    value={testEmail}
                    onChange={(e) => {
                      setTestEmail(e.target.value);
                      setTestError("");
                    }}
                    className="w-full bg-white border border-[#c4c6cf] rounded-lg px-4 py-3 font-body text-body-md outline-none transition-all focus:border-[#002147] focus:ring-2 focus:ring-[rgba(0,33,71,0.12)] placeholder:text-[#c4c6cf]"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={testPassword}
                    onChange={(e) => {
                      setTestPassword(e.target.value);
                      setTestError("");
                    }}
                    className="w-full bg-white border border-[#c4c6cf] rounded-lg px-4 py-3 font-body text-body-md outline-none transition-all focus:border-[#002147] focus:ring-2 focus:ring-[rgba(0,33,71,0.12)] placeholder:text-[#c4c6cf]"
                  />
                </div>

                {testError && (
                  <p className="text-sm font-medium text-[#ba1a1a]">{testError}</p>
                )}

                <button
                  type="submit"
                  disabled={testLogging}
                  className="w-full py-3 px-6 rounded-lg font-bold text-sm flex items-center justify-center gap-2 bg-[#002147] text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
                >
                  {testLogging ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Sign In with Password
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
