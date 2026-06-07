"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth-store";
import { UserCircle, Package, Store, LogOut } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const { user, login, logout } = useAuthStore();
  const router = useRouter();
  const [role, setRole] = useState<"BUYER" | "SELLER">("BUYER");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8 pb-4">
      {!user && (
        <div className="space-y-6">
          <div className="text-center">
            <UserCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h1 className="mt-2 text-2xl font-bold">Welcome</h1>
            <p className="text-muted-foreground">
              Log in or create an account to get started.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Login (Mock)</CardTitle>
              <CardDescription>
                Select a role to test the app
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
                    onValueChange={(v) =>
                      v && setRole(v as "BUYER" | "SELLER")
                    }
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
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Register</CardTitle>
            </CardHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                login(role);
              }}
            >
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Full Name</Label>
                  <Input
                    id="reg-name"
                    placeholder="John Doe"
                    defaultValue="New User"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="your@email.com"
                    defaultValue="new@utp.edu.my"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="••••••••"
                    defaultValue="password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-role">I want to join as</Label>
                  <Select
                    value={role}
                    onValueChange={(v) =>
                      v && setRole(v as "BUYER" | "SELLER")
                    }
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
              <CardFooter>
                <Button type="submit" className="w-full">
                  Create {role === "BUYER" ? "Buyer" : "Seller"} Account
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      {user?.role === "BUYER" && (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="mb-3 h-20 w-20">
              <AvatarFallback className="text-2xl">
                {user.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-xl font-bold">{user.fullName}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                My Orders
              </CardTitle>
              <CardDescription>
                Track your recent purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="py-8 text-center text-sm text-muted-foreground">
                No orders yet. Start browsing the marketplace!
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

      {user?.role === "SELLER" && (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="mb-3 h-20 w-20">
              <AvatarFallback className="text-2xl">
                {user.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-xl font-bold">{user.fullName}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <Link href="/dashboard" className="block">
            <Card className="cursor-pointer border-primary/50 bg-primary/5 transition-colors hover:bg-primary/10">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Go to Seller Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your products, view sales stats, and more
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                My Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="py-8 text-center text-sm text-muted-foreground">
                No orders yet.
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
