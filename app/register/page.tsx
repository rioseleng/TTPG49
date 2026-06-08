"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { ArrowLeft, Mail } from "lucide-react";

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
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center gap-6 px-4 text-center">
        <Mail className="h-14 w-14 text-primary" />
        <h1 className="text-2xl font-bold">Check your inbox</h1>
        <p className="max-w-sm text-muted-foreground">
          We sent a magic login link to{" "}
          <span className="font-medium text-foreground">{email}</span>.
          Click the link in the email to sign in.
        </p>
        <Button variant="outline" onClick={() => setSent(false)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Use a different email
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center px-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your UTP email to receive a magic sign-up link.
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
            {error && <p className="text-sm text-destructive">{error}</p>}
            <p className="text-xs text-muted-foreground">
              An authentication link will be sent to your student or staff
              email inbox.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={sending}
            >
              {sending ? "Sending..." : "Send Magic Login Link"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium underline underline-offset-4"
              >
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
