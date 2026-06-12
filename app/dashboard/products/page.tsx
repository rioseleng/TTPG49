"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthGuard } from "@/components/RouteGuard";
import { MOCK_PRODUCTS } from "@/mock/products";
import { useAuthStore } from "@/store/auth-store";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardProductsPage() {
  const user = useAuthStore((s) => s.user);
  const sellerProducts = MOCK_PRODUCTS.filter(
    (p) => p.sellerId === user?.id
  );

  return (
    <AuthGuard>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              My Products
            </h1>
            <p className="text-muted-foreground">
              Manage your product listings
            </p>
          </div>
          <Link
            href="/dashboard/products/add"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Add New Product
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Listings</CardTitle>
            <CardDescription>
              Showing {sellerProducts.length} product
              {sellerProducts.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No products yet. Click &quot;Add New Product&quot; to
                        get started.
                      </td>
                    </tr>
                  )}
                  {sellerProducts.map((product) => (
                    <tr key={product.id} className="border-b last:border-0">
                      <td className="py-3 font-medium">{product.title}</td>
                      <td className="py-3 text-muted-foreground">
                        {product.category}
                      </td>
                      <td className="py-3">
                        RM {product.price.toFixed(2)}
                      </td>
                      <td className="py-3">
                        {product.isAvailable ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            Sold
                          </Badge>
                        )}
                      </td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
