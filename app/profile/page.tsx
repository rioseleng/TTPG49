"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <div className="flex flex-col items-center justify-center gap-6 pt-12">
          <div className="text-center">
            <Mail className="mx-auto h-14 w-14 text-muted-foreground" />
            <h1 className="mt-4 text-2xl font-bold">Welcome to UTPreneurs</h1>
            <p className="mt-1 text-muted-foreground">
              Sign in to buy and sell with the UTP community.
            </p>
          </div>

          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>
                Enter your UTP email to receive a magic login link.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSendLink}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Enter your UTP Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@utp.edu.my"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  An authentication link will be sent to your student or staff
                  email inbox to log you in.
                </p>
              </CardContent>
              <div className="px-6 pb-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={sending}
                >
                  {sending ? "Sending..." : "Send Magic Login Link"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {!user && sent && (
        <div className="flex flex-col items-center justify-center gap-6 pt-12 text-center">
          <Mail className="mx-auto h-14 w-14 text-primary" />
          <h1 className="text-2xl font-bold">Check your inbox</h1>
          <p className="max-w-sm text-muted-foreground">
            We sent a magic login link to{" "}
            <span className="font-medium text-foreground">{email}</span>.
            Click the link in the email to sign in.
          </p>
          <Button
            variant="outline"
            onClick={() => setSent(false)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Use a different email
          </Button>
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
