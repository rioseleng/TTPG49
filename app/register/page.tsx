"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { Mail, ArrowRight, ArrowLeft, UserPlus } from "lucide-react";

const ALLOWED_DOMAINS = ["@utp.edu.my", "@student.utp.edu.my"];

function isValidUtpEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return ALLOWED_DOMAINS.some((domain) => normalized.endsWith(domain));
}

export default function RegisterPage() {
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
              We sent a magic sign-up link to{" "}
              <span className="font-semibold text-[#1a1c1c]">{email}</span>.
              Click the link in the email to activate your account.
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
            <UserPlus className="h-6 w-6 text-[#002147]" />
          </div>

          <div className="text-center mb-6">
            <h1 className="font-headline text-[28px] md:text-[32px] font-bold text-[#1a1c1c]">
              Create an account
            </h1>
            <p className="font-body text-body-md text-[#44474e] mt-1">
              Enter your UTP email to receive a magic sign-up link.
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
              <p className="mt-2 font-body text-body-md text-[#44474e]/70">
                An authentication link will be sent to your student or staff
                email inbox.
              </p>
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
                  <span>Send Magic Link</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-label text-label-md text-[#74777f]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#715000] hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
