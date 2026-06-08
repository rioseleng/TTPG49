"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth-store";
import {
  Mail,
  Store,
  Package,
  Heart,
  LogOut,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

const ALLOWED_DOMAINS = ["@utp.edu.my", "@student.utp.edu.my"];

function isValidUtpEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return ALLOWED_DOMAINS.some((domain) => normalized.endsWith(domain));
}

export default function ProfilePage() {
  const { user, loading, sendMagicLink, logout, refreshSession } =
    useAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

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

  return (
    <div className="mx-auto max-w-lg px-4 py-8 pb-4">
      {!user && !sent && (
        <div className="flex flex-col items-center gap-7 pt-8">
          <div className="space-y-1.5 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to UTPreneurs
            </h1>
            <p className="text-balance text-sm text-muted-foreground">
              Sign in to buy and sell with the UTP community.
            </p>
          </div>

          <div className="w-full rounded-2xl border bg-card/80 p-6 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-8">
            <form onSubmit={handleSendLink} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  UTP Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="your@utp.edu.my"
                    value={email}
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
        </div>
      )}

      {!user && sent && (
        <div className="flex flex-col items-center gap-7 pt-8 text-center">
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
      )}

      {user && (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="mb-3 h-20 w-20">
              <AvatarFallback className="text-2xl">
                {(user.email?.charAt(0) ?? "?").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">
                {user.email?.split("@")[0] ?? "User"}
              </h1>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 hover:bg-blue-100"
              >
                <ShieldCheck className="mr-0.5 h-3 w-3" />
                UTP Verified
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <Link href="/dashboard">
            <Card className="cursor-pointer border-primary/50 bg-primary/5 transition-colors hover:bg-primary/10">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">
                    List an Item / Seller Dashboard
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Add new listings and manage your shop
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                My Purchases
              </CardTitle>
              <CardDescription>
                Track your recent orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="py-8 text-center text-sm text-muted-foreground">
                No purchases yet. Start browsing the marketplace!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Liked Items
              </CardTitle>
              <CardDescription>Items you have saved</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="py-8 text-center text-sm text-muted-foreground">
                No liked items yet. Tap the heart icon to save items.
              </p>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}
