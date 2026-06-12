"use client";

import Link from "next/link";
import {
  Store,
  Receipt,
  Tag,
  Heart,
  LogOut,
  ChevronRight,
  Pencil,
} from "lucide-react";

// TEMPORARY: Mock user injected for UI development.
// Restore the real auth store import and block below when auth is ready.
/*
import { useAuthStore } from "@/store/auth-store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";

const ALLOWED_DOMAINS = ["@utp.edu.my", "@student.utp.edu.my"];

function isValidUtpEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return ALLOWED_DOMAINS.some((domain) => normalized.endsWith(domain));
}
*/

export default function ProfilePage() {
  // TEMPORARY: Hardcoded mock user replaces real auth store.
  const user = { email: "alex_21001234@utp.edu.my" };
  const logout = () => {};
  const initials = user.email.charAt(0).toUpperCase();
  const username = user.email.split("@")[0].split("_")[0];

  /*
  const { user, loading, sendMagicLink, logout, refreshSession } =
    useAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your UTP email address.");
      return;
    }

    if (!isValidUtpEmail(email)) {
      setError(
        "Access Denied: Please use your official UTP email address."
      );
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

  if (loading) {
    return (
      <div className="mx-auto flex max-w-lg items-center justify-center px-4 py-32">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }
  */

  if (user) {
    return (
      <div className="flex flex-col pb-6">
        {/* User Hero */}
        <section className="py-8 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#f3f3f4] shadow-[0px_4px_12px_rgba(0,33,71,0.08)] bg-[#002147] flex items-center justify-center text-white text-3xl font-bold">
              {initials}
            </div>
            <button className="absolute bottom-0 right-0 bg-[#fdc34d] text-[#271900] w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform">
              <Pencil className="w-[18px] h-[18px]" />
            </button>
          </div>
          <h2 className="font-headline text-headline-lg text-[#002147]">
            {username}
          </h2>
          <p className="font-body text-body-md text-[#44474e]">
            {user.email}
          </p>
          <div className="flex gap-3 mt-4">
            <span className="bg-[#e8e8e8] text-[#44474e] px-3 py-1 rounded-xl font-label text-label-md">
              4.9 ★ (12 Reviews)
            </span>
          </div>
        </section>

        {/* Navigation List Groups */}
        <div className="space-y-6 px-4">
          {/* Activity */}
          <div>
            <h3 className="font-label text-label-md text-[#44474e] uppercase tracking-widest px-1 mb-2">
              Activity
            </h3>
            <div className="bg-white rounded-xl overflow-hidden border border-[#c4c6cf]/30 shadow-[0px_4px_12px_rgba(0,33,71,0.08)]">
              <Link
                href="/dashboard"
                className="w-full flex items-center justify-between p-4 hover:bg-[#f3f3f4] transition-colors group border-b border-[#c4c6cf]/20"
              >
                <div className="flex items-center gap-4">
                  <Store className="w-5 h-5 text-[#002147]" />
                  <span className="font-body text-body-lg text-[#1a1c1c] font-bold">
                    Seller Dashboard
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#002147] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                    SELLER
                  </span>
                  <ChevronRight className="w-5 h-5 text-[#74777f] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <button className="w-full flex items-center justify-between p-4 hover:bg-[#f3f3f4] transition-colors group border-b border-[#c4c6cf]/20">
                <div className="flex items-center gap-4">
                  <Receipt className="w-5 h-5 text-[#002147]" />
                  <span className="font-body text-body-lg text-[#1a1c1c]">
                    Order History
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#fdc34d] text-[#271900] text-[10px] px-1.5 rounded-full font-bold">
                    3
                  </span>
                  <ChevronRight className="w-5 h-5 text-[#74777f] group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-[#f3f3f4] transition-colors group border-b border-[#c4c6cf]/20">
                <div className="flex items-center gap-4">
                  <Tag className="w-5 h-5 text-[#002147]" />
                  <span className="font-body text-body-lg text-[#1a1c1c]">
                    Sales History
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-[#74777f] group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-[#f3f3f4] transition-colors group">
                <div className="flex items-center gap-4">
                  <Heart className="w-5 h-5 text-[#002147]" />
                  <span className="font-body text-body-lg text-[#1a1c1c]">
                    Wishlist
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-[#74777f] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="w-full py-4 px-4 flex items-center justify-center gap-3 text-[#ba1a1a] border-2 border-[#ba1a1a]/20 rounded-xl font-headline text-headline-sm hover:bg-[#ba1a1a]/5 active:scale-95 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </div>
    );
  }

  // TEMPORARY: Login form return block is commented out while mock user is active.
  // Uncomment when restoring real auth.
  /*
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex flex-grow items-center justify-center px-4">
        <div className="w-full max-w-md -mt-6">
          {!sent ? (
            <>
              <div className="rounded-xl bg-white p-8 shadow-[0_0_60px_rgba(11,27,61,0.25)]">
                <div className="mb-8 text-center">
                  <h2 className="text-[28px] font-bold leading-9 tracking-tight text-[#1a1c1c] md:text-[32px]">
                    Welcome Back
                  </h2>
                  <p className="mt-1 text-sm text-[#44474e]">
                    Enter your university email to receive a secure login link.
                  </p>
                </div>

                <form onSubmit={handleSendLink} className="space-y-6">
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="ml-1 text-[11px] font-semibold uppercase tracking-wide text-[#44474e]"
                    >
                      UTP Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#74777f]">
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
                        className="w-full rounded-lg border border-[#c4c6cf] bg-white py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-[#c4c6cf] focus:border-[#002147] focus:ring-2 focus:ring-[#002147]"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="animate-in fade-in slide-in-from-top-1 text-sm font-medium text-destructive duration-200">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="group flex w-full items-center justify-center gap-3 rounded-lg bg-[#fdc34d] px-6 py-4 text-lg font-bold text-[#001b3d] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0px_8px_24px_rgba(253,195,77,0.32)] active:scale-[0.98] disabled:opacity-70"
                  >
                    {sending ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#001b3d]/30 border-t-[#001b3d]" />
                        Authenticating...
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
                  <p className="text-[11px] font-semibold tracking-wide text-[#74777f]">
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
            </>
          ) : (
            <div className="rounded-xl bg-white p-8 text-center shadow-[0_0_60px_rgba(11,27,61,0.25)]">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fdc34d]/20">
                <Mail className="h-7 w-7 text-[#715000]" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#1a1c1c]">
                Check your inbox
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#44474e]">
                We sent a magic login link to{" "}
                <span className="font-medium text-[#1a1c1c]">{email}</span>.
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
          )}
        </div>
      </main>

      <footer className="border-t border-[#c4c6cf]/30 py-6 text-center">
        <p className="text-[11px] font-semibold tracking-wide text-[#44474e]">
          &copy; 2026 UTPreneurs
        </p>
      </footer>
    </div>
  );
  */
}
