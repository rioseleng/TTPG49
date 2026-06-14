"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { ArrowLeft, Receipt, Truck, Check } from "lucide-react";

interface SaleItem {
  id: string;
  status: string;
  total_amount: number;
  subtotal: number;
  discount: number;
  tax: number;
  created_at: string;
  delivery_location: string;
  order_items: {
    product_title: string;
    product_category: string;
    quantity: number;
    unit_price: number;
  }[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function truncateId(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`;
}

export default function SalesHistoryPage() {
  const router = useRouter();
  const { user, refreshSession } = useAuthStore();
  const setHideNavbar = useUIStore((s) => s.setHideNavbar);
  const setHideBottomNav = useUIStore((s) => s.setHideBottomNav);
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setHideNavbar(true);
    setHideBottomNav(true);
    return () => {
      setHideNavbar(false);
      setHideBottomNav(false);
    };
  }, [setHideNavbar, setHideBottomNav]);

  useEffect(() => {
    refreshSession();
  }, []);

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();

    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("seller_id", user.id)
      .eq("status", "SHIPPED")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setSales(data as SaleItem[]);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f9f9f9] items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f3f4]">
          <Receipt className="h-8 w-8 text-[#44474e]" />
        </div>
        <h1 className="font-headline text-headline-lg text-[#002147] mb-2">Not signed in</h1>
        <p className="font-body text-body-md text-[#44474e] mb-6">
          Sign in to view your sales history.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-[#fdc34d] text-[#271900] font-bold text-sm hover:opacity-90 transition-all"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9f9]">
      <header className="bg-white sticky top-0 w-full z-50 shadow-[0px_4px_12px_rgba(0,33,71,0.08)]">
        <div className="flex justify-between items-center px-4 h-14 w-full mx-auto">
          <button
            onClick={() => router.push("/profile")}
            className="active:scale-95 transition-transform flex items-center text-[#000a1e]"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-headline text-headline-md font-bold text-[#000a1e] tracking-tight">
            Sales History
          </h1>
          <div className="w-6" />
        </div>
      </header>

      <main className="flex-1 px-4 pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="font-body text-body-md text-[#44474e]">Loading sales history...</p>
          </div>
        ) : sales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Receipt className="w-16 h-16 text-[#c4c6cf] mb-4" style={{ strokeWidth: 1 }} />
            <p className="font-headline text-headline-sm text-[#1a1c1c] mb-1">
              No completed sales yet
            </p>
            <p className="font-body text-body-md text-[#44474e] mb-4">
              Shipped orders will appear here once completed.
            </p>
            <Link
              href="/dashboard/products/add"
              className="font-bold text-[#002147] underline underline-offset-4"
            >
              Add a product to start selling
            </Link>
          </div>
        ) : (
          <div className="space-y-4 pb-8">
            {sales.map((sale) => {
              const firstItem = sale.order_items?.[0];
              return (
                <div
                  key={sale.id}
                  className="bg-white rounded-xl p-4 shadow-[0px_4px_12px_rgba(0,33,71,0.08)] border border-[#e2e2e2]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-label text-label-md text-[#74777f] uppercase tracking-wider">
                          {truncateId(sale.id)}
                        </span>
                        <span className="text-[#c4c6cf] text-xs">•</span>
                        <span className="font-body text-body-md text-[#44474e]">
                          {formatDate(sale.created_at)}
                        </span>
                        <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 font-label text-label-md">
                          <Check className="w-3 h-3" />
                          Completed
                        </span>
                      </div>
                      <p className="font-headline text-headline-sm text-[#000a1e] truncate mt-1">
                        {firstItem?.product_title || "Order"}
                        {sale.order_items && sale.order_items.length > 1 && (
                          <span className="font-body text-body-md text-[#44474e]">
                            {" "}+{sale.order_items.length - 1} more
                          </span>
                        )}
                      </p>
                      {sale.delivery_location && (
                        <p className="font-body text-body-md text-[#44474e] mt-0.5">
                          {sale.delivery_location}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#f9f9f9] rounded-lg p-3 mb-3 space-y-1">
                    {sale.order_items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="font-body text-body-md text-[#1a1c1c]">
                          {item.product_title}{" "}
                          <span className="text-[#44474e]">x{item.quantity}</span>
                        </span>
                        <span className="font-body text-body-md font-semibold text-[#1a1c1c]">
                          RM {(item.unit_price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-[#e2e2e2] pt-1 mt-1 flex justify-between">
                      <span className="font-body text-body-md font-bold text-[#000a1e]">
                        Total
                      </span>
                      <span className="font-headline text-headline-sm font-bold text-[#7b5800]">
                        RM {Number(sale.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-[#44474e]">
                    <Truck className="w-4 h-4 text-green-600" />
                    <span className="font-body text-body-md">Delivered</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
