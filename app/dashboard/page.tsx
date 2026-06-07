"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SellerGuard } from "@/components/RouteGuard";
import { MOCK_PRODUCTS } from "@/mock/products";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const sellerProducts = MOCK_PRODUCTS.filter(
    (p) => p.sellerId === user?.id
  );

  const totalSales = sellerProducts
    .filter((p) => !p.isAvailable)
    .reduce((sum, p) => sum + p.price, 0);

  const activeListings = sellerProducts.filter((p) => p.isAvailable).length;

  return (
    <SellerGuard>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Seller Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.fullName}
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Sales (RM)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">RM {totalSales.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Listings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{activeListings}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Subscription Status</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                ACTIVE — BASIC
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Link
            href="/dashboard/products"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Manage Products
          </Link>
        </div>
      </div>
    </SellerGuard>
  );
}
