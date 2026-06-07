"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [role, setRole] = useState<"BUYER" | "SELLER">("BUYER");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    router.push("/");
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center px-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Mock login — select a role to test different flows
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                defaultValue="test@utp.edu.my"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                defaultValue="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Mock Role</Label>
              <Select
                value={role}
                onValueChange={(v) => v && setRole(v as "BUYER" | "SELLER")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUYER">Buyer</SelectItem>
                  <SelectItem value="SELLER">Seller</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full">
              Log in as {role === "BUYER" ? "Buyer" : "Seller"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium underline underline-offset-4">
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
