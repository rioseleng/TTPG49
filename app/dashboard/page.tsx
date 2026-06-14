"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, TrendingUp, Edit3, Package, Truck, Check, Camera, X } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { toProductListing } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import type { ProductListing } from "@/types";

const CATEGORY_ICONS: Record<string, string> = {
  FOOD: "🍪",
  CLOTHING: "👕",
  ACCESSORIES: "⌚",
  OTHER: "📦",
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, refreshSession } = useAuthStore();
  const setHideNavbar = useUIStore((s) => s.setHideNavbar);
  const setHideBottomNav = useUIStore((s) => s.setHideBottomNav);
  const [myProducts, setMyProducts] = useState<ProductListing[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [shipModal, setShipModal] = useState<{
    orderId: string;
    imageFile: File | null;
    preview: string | null;
    uploading: boolean;
  } | null>(null);

  useEffect(() => {
    refreshSession();
  }, []);

  useEffect(() => {
    setHideNavbar(true);
    setHideBottomNav(true);
    return () => {
      setHideNavbar(false);
      setHideBottomNav(false);
    };
  }, [setHideNavbar]);

  const supabase = createClient();

  useEffect(() => {
    if (loading) return;

    const fetchProducts = () => {
      supabase
        .from("product_listings")
        .select("*")
        .eq("seller_id", user?.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setMyProducts((data ?? []).map(toProductListing));
        });
    };

    fetchProducts();

    const channel = supabase
      .channel("dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "product_listings" },
        () => {
          fetchProducts();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loading, user]);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("seller_id", user.id)
      .in("status", ["CONFIRMED", "PACKED", "SHIPPED"])
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("Failed to fetch orders:", error.message);
        if (data) setOrders(data);
      });
  }, [user]);

  const openShipModal = (orderId: string) => {
    setShipModal({ orderId, imageFile: null, preview: null, uploading: false });
  };

  const handleShipImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !shipModal) return;
    setShipModal({ ...shipModal, imageFile: file, preview: URL.createObjectURL(file) });
  };

  const handleConfirmShipped = async () => {
    if (!shipModal || !shipModal.imageFile) return;
    setShipModal({ ...shipModal, uploading: true });

    const ext = shipModal.imageFile.name.split(".").pop();
    const filePath = `proof_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("delivery-proofs")
      .upload(filePath, shipModal.imageFile);

    if (uploadError) {
      alert("Failed to upload proof: " + uploadError.message);
      setShipModal({ ...shipModal, uploading: false });
      return;
    }

    const { data: urlData } = supabase.storage
      .from("delivery-proofs")
      .getPublicUrl(filePath);
    const proofUrl = urlData.publicUrl;

    const { error } = await supabase
      .from("orders")
      .update({ status: "SHIPPED", delivery_proof: proofUrl })
      .eq("id", shipModal.orderId);

    if (error) {
      alert("Failed to update order: " + error.message);
      setShipModal({ ...shipModal, uploading: false });
      return;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === shipModal.orderId
          ? { ...o, status: "SHIPPED", delivery_proof: proofUrl }
          : o,
      ),
    );
    setShipModal(null);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    if (error) {
      console.error("Order status update error:", error.message);
      alert("Failed to update order: " + error.message);
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    }
    setUpdatingOrder(null);
  };

  const totalSales = orders
    .filter((o) => o.status === "SHIPPED")
    .reduce((sum: number, o: { total_amount: number }) => sum + Number(o.total_amount), 0);

  const activeListings = myProducts.filter((p) => p.isAvailable).length;

  return (
    <div className="flex flex-col pb-8">
      <header className="bg-white sticky top-0 w-full z-50 shadow-[0px_4px_12px_rgba(0,33,71,0.08)]">
        <div className="flex justify-between items-center px-4 h-14 w-full mx-auto">
          <button
            onClick={() => router.push("/profile")}
            className="active:scale-95 transition-transform flex items-center text-[#000a1e]"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-headline text-headline-md font-bold text-[#000a1e] tracking-tight">
            Dashboard Overview
          </h1>
          <div className="w-6" />
        </div>
      </header>

      <div className="px-4 pt-4 pb-4">
        <p className="font-body text-body-md text-[#44474e]">
          Your sales performance this month
        </p>
      </div>

      <div className="px-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-card border-l-4 border-[#fdc34d]">
            <p className="text-on-surface-variant font-label text-label-md uppercase tracking-wider mb-1">
              Total Sales
            </p>
            <p className="font-headline text-headline-lg text-[#002147]">
              RM {totalSales.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-card border-l-4 border-[#000a1e]">
            <p className="text-on-surface-variant font-label text-label-md uppercase tracking-wider mb-1">
              Active Items
            </p>
            <p className="font-headline text-headline-lg text-[#002147]">
              {activeListings}
            </p>
            <p className="text-on-surface-variant text-sm mt-1">
              Across {new Set(myProducts.map((p) => p.category)).size} categories
            </p>
          </div>
        </div>
      </div>

      {/* Shipment Proof Modal */}
      {shipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-modal">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-headline-md text-[#002147]">
                Delivery Proof
              </h3>
              <button
                type="button"
                onClick={() => setShipModal(null)}
                className="text-[#74777f] hover:text-[#000a1e] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="font-body text-body-md text-[#44474e] mb-4">
              Take a photo of the parcel before marking as shipped.
            </p>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleShipImageSelect}
              className="hidden"
              id="proof-upload"
            />

            {shipModal.preview ? (
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#f3f3f4] mb-4">
                <img
                  src={shipModal.preview}
                  alt="Parcel proof"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setShipModal({ ...shipModal, imageFile: null, preview: null })}
                  className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md"
                >
                  <X className="w-4 h-4 text-[#ba1a1a]" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="proof-upload"
                className="flex flex-col items-center justify-center w-full aspect-square rounded-lg border-2 border-dashed border-[#c4c6cf] bg-[#f9f9f9] cursor-pointer hover:border-[#002147] transition-colors mb-4"
              >
                <Camera className="w-10 h-10 text-[#74777f] mb-2" />
                <p className="font-body text-body-md text-[#44474e]">
                  Tap to take a photo
                </p>
              </label>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShipModal(null)}
                className="flex-1 h-11 border-2 border-[#000a1e] text-[#000a1e] rounded-lg font-bold text-sm hover:bg-[#f3f3f4] active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!shipModal.imageFile || shipModal.uploading}
                onClick={handleConfirmShipped}
                className="flex-1 h-11 bg-[#fdc34d] text-[#715000] rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {shipModal.uploading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#715000]/30 border-t-[#715000]" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    Confirm Shipped
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Orders */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-headline-md text-[#002147]">
            Manage Orders
          </h2>
        </div>
        <div className="space-y-4">
          {orders.length === 0 && (
            <div className="text-center py-8 text-on-surface-variant font-body text-body-md">
              No orders yet. Orders from buyers will appear here.
            </div>
          )}
          {orders.map((order) => {
            const firstItem = order.order_items?.[0];
            const isUpdating = updatingOrder === order.id;
            return (
              <div
                key={order.id}
                className="bg-white p-4 rounded-xl shadow-card border border-[#c4c6cf]"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-label text-label-md text-[#74777f] uppercase tracking-wider">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <p className="font-headline text-headline-sm text-[#000a1e] mt-1">
                      {firstItem?.product_title || "Order"}
                    </p>
                    <p className="font-body text-body-md text-[#44474e]">
                      RM {Number(order.total_amount).toFixed(2)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full font-label text-label-md ${
                      order.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "PACKED"
                          ? "bg-[#002147]/10 text-[#002147]"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status === "CONFIRMED"
                      ? "Paid"
                      : order.status === "PACKED"
                        ? "Packed"
                        : "Shipped"}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  {order.status === "CONFIRMED" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(order.id, "PACKED")}
                      className="flex-1 h-10 bg-[#002147] text-white rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                    >
                      <Package className="w-4 h-4" />
                      {isUpdating ? "Updating..." : "Mark as Packed"}
                    </button>
                  )}
                  {(order.status === "CONFIRMED" || order.status === "PACKED") && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => openShipModal(order.id)}
                      className="flex-1 h-10 bg-[#fdc34d] text-[#715000] rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                    >
                      <Truck className="w-4 h-4" />
                      {isUpdating ? "Updating..." : "Mark as Shipped"}
                    </button>
                  )}
                  {order.status === "SHIPPED" && (
                    <div className="flex-1 h-10 bg-green-100 text-green-700 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4" />
                      Delivered
                      {order.delivery_proof && (
                        <button
                          type="button"
                          onClick={() => window.open(order.delivery_proof, "_blank")}
                          className="ml-1 underline text-xs"
                        >
                          View Proof
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-headline text-headline-md text-[#002147]">
            Manage Listings
          </h2>
          <Link
            href="/dashboard/products"
            className="text-[#715000] font-semibold font-label text-label-md hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {myProducts.slice(0, 2).map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-xl shadow-card border border-[#c4c6cf] flex items-center gap-4"
            >
              <div className="w-20 h-20 rounded-lg bg-[#e2e2e2] flex-shrink-0 overflow-hidden border border-[#c4c6cf] flex items-center justify-center text-2xl">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                ) : CATEGORY_ICONS[product.category] || "📦"}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="min-w-0">
                    <p className="font-bold text-[#000a1e] font-headline text-headline-sm truncate">
                      {product.title}
                    </p>
                    <span className="bg-[#000a1e]/5 text-[#000a1e] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tight">
                      {product.category}
                    </span>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ml-2">
                    {product.isAvailable ? "Active" : "Sold"}
                  </span>
                </div>
                <div className="flex justify-between items-end mt-3">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">
                        Qty
                      </p>
                      <p className="font-semibold text-[#1a1c1c]">{product.quantity ?? 1}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">
                        Price
                      </p>
                      <p className="font-bold text-[#715000]">
                        RM {product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}
                    className="text-on-surface-variant hover:text-[#000a1e] transition-colors p-2 bg-[#f3f3f4] rounded-full"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => router.push("/dashboard/products/add")}
            className="bg-[#fdc34d] text-[#715000] font-bold py-4 px-6 rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1 text-sm uppercase tracking-wider"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>
      </div>
    </div>
  );
}
