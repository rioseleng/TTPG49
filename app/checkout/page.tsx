"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, MapPin, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { user, loading: authLoading, refreshSession } = useAuthStore();
  const cartItems = useUIStore((s) => s.cartItems);
  const setHideNavbar = useUIStore((s) => s.setHideNavbar);
  const setHideBottomNav = useUIStore((s) => s.setHideBottomNav);

  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [placing, setPlacing] = useState(false);

  const productId = searchParams.get("productId");

  const [items, setItems] = useState<{
    productId: string;
    title: string;
    price: number;
    category: string;
    quantity: number;
    image: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshSession();
  }, []);

  useEffect(() => {
    async function load() {
      if (productId) {
        const { data } = await supabase
          .from("product_listings")
          .select("*")
          .eq("id", productId)
          .single();
        if (data) {
          setItems([
            {
              productId: data.id,
              title: data.title,
              price: data.price,
              category: data.category,
              quantity: 1,
              image: "",
            },
          ]);
        }
      } else {
        setItems(cartItems);
      }
      setLoading(false);
    }
    load();
  }, [productId, cartItems]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = subtotal * 0.05;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + tax;

  useEffect(() => {
    setHideNavbar(true);
    setHideBottomNav(true);
    return () => {
      setHideNavbar(false);
      setHideBottomNav(false);
    };
  }, [setHideNavbar, setHideBottomNav]);

  const handlePayNow = async () => {
    if (!user) {
      alert("Please sign in to place an order.");
      return;
    }
    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    setPlacing(true);

    const resolvedLocation =
      deliveryLocation === "Others" ? customLocation : deliveryLocation;

    const { data: firstProduct } = await supabase
      .from("product_listings")
      .select("seller_id")
      .eq("id", items[0].productId)
      .single();

    const { error: orderError } = await supabase.from("orders").insert({
      buyer_id: user.id,
      seller_id: firstProduct?.seller_id ?? user.id,
      delivery_location: resolvedLocation,
      delivery_note: deliveryNote,
      subtotal,
      discount,
      tax,
      total_amount: total,
      status: "PENDING",
    });

    if (orderError) {
      alert("Failed to place order. Please try again.");
      setPlacing(false);
      return;
    }

    const { data: order } = await supabase
      .from("orders")
      .select("id")
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!order) {
      alert("Failed to retrieve order. Please try again.");
      setPlacing(false);
      return;
    }

    if (order) {
      const { error: itemsError } = await supabase.from("order_items").insert(
        items.map((item) => ({
          order_id: order.id,
          product_id: item.productId,
          product_title: item.title,
          product_category: item.category,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      );
      if (itemsError) {
        alert("Order created but failed to save items.");
        setPlacing(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, orderId: order.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to initiate payment: " + (data.error ?? "Unknown error"));
        setPlacing(false);
      }
    } catch {
      alert("Failed to connect to payment gateway.");
      setPlacing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f9f9f9] items-center justify-center">
        <p className="text-[#44474e]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9f9]">
      <header className="bg-white sticky top-0 w-full z-50 shadow-[0px_4px_12px_rgba(0,33,71,0.08)]">
        <div className="flex justify-between items-center px-4 py-2 w-full mx-auto">
          <button
            onClick={() => router.push("/cart")}
            className="text-[#000a1e] active:scale-95 transition-transform hover:opacity-80"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-headline text-headline-md font-bold text-[#000a1e] tracking-tight">
            Checkout
          </h1>
          <div className="w-6" />
        </div>
      </header>

      <main className="px-4 pb-8 pt-6 space-y-8">
        <section>
          <h2 className="font-headline text-headline-sm text-[#000a1e] mb-4">
            Delivery Information
          </h2>
          <div className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(0,33,71,0.08)] border border-[#e2e2e2] space-y-3">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-[#fdc34d] mt-0.5 flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <select
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="w-full font-body text-body-lg font-semibold text-[#1a1c1c] bg-transparent border border-[#c4c6cf] rounded-lg px-3 py-2 focus:outline-none focus:border-[#fdc34d] focus:ring-1 focus:ring-[#fdc34d] appearance-none"
                >
                  <option value="" disabled>
                    Select delivery location
                  </option>
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <option key={n} value={`Village ${n}`}>
                      Village {n}
                    </option>
                  ))}
                  <option value="Others">Others</option>
                </select>
                {deliveryLocation === "Others" && (
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="Enter your delivery location"
                    className="w-full font-body text-body-md text-[#1a1c1c] bg-transparent border border-[#c4c6cf] rounded-lg px-3 py-2 focus:outline-none focus:border-[#fdc34d] focus:ring-1 focus:ring-[#fdc34d] placeholder:text-[#44474e]"
                  />
                )}
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FileText className="w-6 h-6 text-[#fdc34d] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <textarea
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="Add a delivery note for the seller (optional)"
                  rows={2}
                  className="w-full font-body text-body-md text-[#1a1c1c] bg-transparent border border-[#c4c6cf] rounded-lg px-3 py-2 focus:outline-none focus:border-[#fdc34d] focus:ring-1 focus:ring-[#fdc34d] placeholder:text-[#44474e] resize-none"
                />
              </div>
            </div>
            {(deliveryLocation && (deliveryLocation !== "Others" || customLocation)) && (
              <div className="flex items-center justify-between pt-2 border-t border-[#e2e2e2]">
                <p className="font-body text-body-sm text-[#5d4200]">
                  {deliveryLocation === "Others" ? customLocation : deliveryLocation}
                </p>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-headline text-headline-sm text-[#000a1e] mb-4">
            Payment Method
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(0,33,71,0.08)] border-2 border-[#fdc34d]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-10 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/DuitNow_QR_Logo.svg"
                    alt="DuitNow QR"
                    width={36}
                    height={39}
                    className="object-contain"
                  />
                </div>
                <p className="font-body text-body-lg font-semibold text-[#1a1c1c]">
                  DuitNow QR
                </p>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-[#fdc34d] flex items-center justify-center">
                <div className="w-3 h-3 bg-[#fdc34d] rounded-full" />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-headline text-headline-sm text-[#000a1e] mb-4">
            Order Summary
          </h2>
          <div className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(0,33,71,0.08)] border border-[#e2e2e2] space-y-3">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between items-center text-[#1a1c1c] pb-2 border-b border-[#c4c6cf] last:border-b-0 last:pb-0"
              >
                <span className="font-body text-body-md">
                  {item.title}
                  <span className="text-on-surface-variant">
                    {" "}
                    x{item.quantity}
                  </span>
                </span>
                <span className="font-body text-body-md font-semibold">
                  RM {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center text-[#1a1c1c]">
              <span className="font-body text-body-md">Subtotal</span>
              <span className="font-body text-body-md font-semibold">
                RM {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-[#5d4200]">
              <span className="font-body text-body-md">
                Student Discount (5%)
              </span>
              <span className="font-body text-body-md font-semibold">
                -RM {discount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-[#1a1c1c]">
              <span className="font-body text-body-md">Campus Delivery</span>
              <span className="font-body text-body-md font-bold text-[#5d4200] uppercase tracking-wider">
                FREE
              </span>
            </div>
            <div className="flex justify-between items-center text-[#1a1c1c] pb-3">
              <span className="font-body text-body-md">Tax</span>
              <span className="font-body text-body-md font-semibold">
                RM {tax.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-[#c4c6cf] pt-4 flex justify-between items-end">
              <span className="font-headline text-headline-sm text-[#000a1e]">
                Total Amount
              </span>
              <div className="text-right">
                <span className="font-headline text-[28px] leading-9 font-bold text-[#5d4200] block">
                  RM {total.toFixed(2)}
                </span>
                <span className="font-label text-label-md text-on-surface-variant uppercase">
                  VAT Included
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="pt-4">
          <button
            onClick={handlePayNow}
            disabled={placing || items.length === 0}
            className="w-full bg-[#fdc34d] text-[#271900] font-bold py-3 px-6 rounded-lg shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
          >
            {placing ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
