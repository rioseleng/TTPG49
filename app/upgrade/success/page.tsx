"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Crown, X } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const subscriptionId = searchParams.get("subscription_id");

    if (!subscriptionId) {
      setStatus("error");
      setErrorMessage("Missing subscription reference.");
      return;
    }

    fetch("/api/activate-premium-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriptionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStatus("error");
          setErrorMessage(data.error);
        } else {
          setStatus("success");
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMessage("Network error. Please try again.");
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center min-h-screen">
      <div className="w-full max-w-md">
        {status === "verifying" && (
          <div className="bg-white rounded-xl p-8 shadow-[0px_4px_12px_rgba(0,33,71,0.08)]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fdc34d]/20">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#715000]/30 border-t-[#715000]" />
            </div>
            <h2 className="font-headline text-[28px] font-bold text-[#1a1c1c] mb-2">
              Verifying Payment
            </h2>
            <p className="font-body text-body-md text-[#44474e]">
              Please wait while we confirm your payment...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="bg-white rounded-xl p-8 shadow-[0px_4px_12px_rgba(0,33,71,0.08)]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
              <Check className="h-8 w-8 text-green-700" />
            </div>
            <h2 className="font-headline text-[28px] font-bold text-[#1a1c1c] mb-2">
              Welcome to Premium!
            </h2>
            <p className="font-body text-body-md text-[#44474e] mb-6">
              Your Premium subscription is now active. You can start selling
              products on UTPreneurs.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl font-bold text-lg bg-[#fdc34d] text-[#001b3d] hover:shadow-[0px_8px_24px_rgba(253,195,77,0.32)] active:scale-[0.98] transition-all"
            >
              <Crown className="w-5 h-5" />
              Go to Dashboard
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="bg-white rounded-xl p-8 shadow-[0px_4px_12px_rgba(0,33,71,0.08)]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
              <X className="h-8 w-8 text-red-700" />
            </div>
            <h2 className="font-headline text-[28px] font-bold text-[#1a1c1c] mb-2">
              Payment Error
            </h2>
            <p className="font-body text-body-md text-[#ba1a1a] mb-6">
              {errorMessage || "Something went wrong. Please try again."}
            </p>
            <Link
              href="/upgrade"
              className="inline-flex items-center justify-center w-full py-4 px-6 rounded-xl font-bold text-lg bg-[#fdc34d] text-[#001b3d] hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Try Again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UpgradeSuccessPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20 text-[#44474e]">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
