"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { ArrowLeft, Package, Clock, Truck, CreditCard, ChevronRight, Receipt, Camera, X } from "lucide-react";

type OrderStatus = "PENDING" | "CONFIRMED" | "PACKED" | "SHIPPED";

interface OrderItem {
  order_id: string;
  product_id: string;
  product_title: string;
  product_category: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  delivery_proof?: string | null;
  order_items: OrderItem[];
}

const TABS = [
  { key: "PENDING", label: "Unpaid", icon: Clock },
  { key: "CONFIRMED", label: "Paid", icon: CreditCard },
  { key: "PACKED", label: "Packed", icon: Package },
  { key: "SHIPPED", label: "Sent", icon: Truck },
] as const;

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-[#fdc34d]/20 text-[#7b5800]",
  CONFIRMED: "bg-green-100 text-green-700",
  PACKED: "bg-[#002147]/10 text-[#002147]",
  SHIPPED: "bg-green-100 text-green-700",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Unpaid",
  CONFIRMED: "Paid",
  PACKED: "Packed",
  SHIPPED: "Sent",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function truncateId(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`;
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshSession } = useAuthStore();
  const setHideNavbar = useUIStore((s) => s.setHideNavbar);
  const setHideBottomNav = useUIStore((s) => s.setHideBottomNav);
  const [activeTab, setActiveTab] = useState<OrderStatus>("PENDING");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [proofImage, setProofImage] = useState<string | null>(null);

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
    if (authLoading || !user) return;

    const supabase = createClient();

    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("buyer_id", user.id)
      .eq("status", activeTab)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setOrders(data as unknown as Order[]);
        }
        setLoading(false);
      });
  }, [user, authLoading, activeTab]);

  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f9f9f9] items-center justify-center">
        <p className="font-body text-body-md text-[#44474e]">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f9f9f9] items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f3f4]">
          <Receipt className="h-8 w-8 text-[#44474e]" />
        </div>
        <h1 className="font-headline text-headline-lg text-[#002147] mb-2">Not signed in</h1>
        <p className="font-body text-body-md text-[#44474e] mb-6">
          Sign in to view your order history.
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
            Order History
          </h1>
          <div className="w-6" />
        </div>
      </header>

      <main className="flex-1 px-4 pt-4">
        <div className="flex gap-2 mb-6">
          {TABS.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveTab(key);
                  setLoading(true);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl font-headline text-headline-sm transition-all active:scale-95 ${
                  isActive
                    ? "bg-[#002147] text-white shadow-md"
                    : "bg-white text-[#44474e] border border-[#c4c6cf]/40 hover:bg-[#f3f3f4]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#fdc34d]" : ""}`} />
                {label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="font-body text-body-md text-[#44474e]">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Receipt className="w-16 h-16 text-[#c4c6cf] mb-4" style={{ strokeWidth: 1 }} />
            <p className="font-headline text-headline-sm text-[#1a1c1c] mb-1">
              No {activeTab === "PENDING" ? "unpaid" : activeTab === "CONFIRMED" ? "paid" : activeTab === "PACKED" ? "packed" : "sent"} orders
            </p>
            <p className="font-body text-body-md text-[#44474e] mb-4">
              {activeTab === "PENDING"
                ? "Orders you place will appear here."
                : "No orders in this status yet."}
            </p>
            <Link
              href="/"
              className="font-bold text-[#002147] underline underline-offset-4"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4 pb-8">
            {orders.map((order) => {
              const firstItem = order.order_items?.[0];
              const statusLabel = STATUS_LABELS[order.status] || order.status;
              const statusStyle = STATUS_STYLES[order.status] || "bg-[#e2e2e2] text-[#44474e]";
              return (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => {
                    if (order.status === "PENDING") {
                      router.push(`/checkout?orderId=${order.id}`);
                    }
                  }}
                  className="w-full bg-white rounded-xl p-4 shadow-[0px_4px_12px_rgba(0,33,71,0.08)] border border-[#e2e2e2] text-left hover:shadow-[0px_8px_24px_rgba(0,33,71,0.12)] transition-all active:scale-[0.98] group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-label text-label-md text-[#74777f] uppercase tracking-wider">
                          {truncateId(order.id)}
                        </span>
                        <span className="text-[#c4c6cf] text-xs">•</span>
                        <span className="font-body text-body-md text-[#44474e]">
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                      <p className="font-headline text-headline-sm text-[#000a1e] truncate">
                        {firstItem?.product_title || "Order"}
                        {order.order_items && order.order_items.length > 1 && (
                          <span className="font-body text-body-md text-[#44474e]">
                            {" "} +{order.order_items.length - 1} more
                          </span>
                        )}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#74777f] mt-1 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-headline text-headline-md font-bold text-[#002147]">
                        RM {Number(order.total_amount).toFixed(2)}
                      </span>
                      {order.status === "SHIPPED" && order.delivery_proof && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProofImage(order.delivery_proof!);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#002147]/10 text-[#002147] font-label text-label-md hover:bg-[#002147]/20 transition-colors"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          View Proof
                        </button>
                      )}
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full font-label text-label-md ${statusStyle}`}>
                      {statusLabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
      {/* Proof Image Modal */}
      {proofImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setProofImage(null)}
        >
          <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setProofImage(null)}
              className="absolute -top-10 right-0 text-white hover:opacity-80 transition-opacity"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={proofImage}
              alt="Delivery proof"
              className="w-full rounded-xl shadow-modal"
            />
            <p className="text-center text-white font-body text-body-md mt-3">
              Delivery Proof
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
