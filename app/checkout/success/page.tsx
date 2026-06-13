"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Store, Check } from "lucide-react";
import { useUIStore } from "@/store/ui-store";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const status = searchParams.get("status");
  const setHideNavbar = useUIStore((s) => s.setHideNavbar);
  const setHideBottomNav = useUIStore((s) => s.setHideBottomNav);

  useEffect(() => {
    setHideNavbar(true);
    setHideBottomNav(true);
    return () => {
      setHideNavbar(false);
      setHideBottomNav(false);
    };
  }, [setHideNavbar, setHideBottomNav]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#f9f9f9]">
      <header className="fixed top-0 left-0 right-0 z-40 mx-auto max-w-md bg-[#002147] shadow-[0_4px_12px_rgba(0,33,71,0.08)]">
        <div className="flex h-14 items-center justify-center px-4">
          <div className="flex select-none items-center gap-2">
            <Store className="h-6 w-6 text-[#fdc34d]" />
            <span className="text-xl font-bold tracking-tight text-white">
              UTPreneurs
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pt-14 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500 shadow-[0px_4px_12px_rgba(0,33,71,0.08)]">
          <Check className="h-10 w-10 text-white" strokeWidth={3} />
        </div>

        <h1 className="mb-2 font-headline text-headline-lg font-bold text-[#002147]">
          Payment Successful!
        </h1>
        <p className="mb-8 font-body text-body-md text-[#44474e]">
          Your order has been confirmed and the seller has been notified.
        </p>

        <div className="w-full rounded-xl bg-white p-4 shadow-[0px_4px_12px_rgba(0,33,71,0.08)]">
          <div className="flex items-center justify-between border-b border-[#c4c6cf] pb-3">
            <span className="font-body text-body-md text-[#44474e]">
              Order Reference
            </span>
            <span className="font-body text-body-md font-semibold text-[#002147]">
              {orderId || "—"}
            </span>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="font-body text-body-md text-[#44474e]">Status</span>
            <span className="rounded-full bg-green-100 px-3 py-1 font-label text-label-md font-semibold text-green-700">
              {status === "completed" ? "Paid" : status || "Paid"}
            </span>
          </div>
        </div>

        <div className="mt-8 flex w-full gap-3">
          <Link
            href="/"
            className="flex-1 rounded-xl border-2 border-[#002147] py-3 text-center font-headline text-headline-sm font-bold text-[#002147] active:scale-95 transition-transform"
          >
            Back to Home
          </Link>
          <Link
            href="/profile"
            className="flex-1 rounded-xl border-2 border-[#002147] py-3 text-center font-headline text-headline-sm font-bold text-[#002147] active:scale-95 transition-transform"
          >
            Order History
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
