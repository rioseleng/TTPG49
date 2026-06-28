"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { TIER_CONFIG } from "@/lib/tier-config";
import { upgradeToPremium } from "@/lib/subscription";
import { Crown, ArrowLeft, Check, Sparkles } from "lucide-react";

function UpgradeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tier, subscription } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reason = searchParams.get("reason");
  const isAlreadyPremium = tier === "PREMIUM" && subscription?.status === "ACTIVE";
  const premium = TIER_CONFIG.PREMIUM;

  const handleUpgrade = async () => {
    setLoading(true);
    setError("");

    const result = await upgradeToPremium();

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
      return;
    }

    window.location.href = result.url;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white sticky top-0 w-full z-50 shadow-[0px_4px_12px_rgba(0,33,71,0.08)]">
        <div className="flex items-center px-4 h-14">
          <button
            onClick={() => router.back()}
            className="active:scale-95 transition-transform flex items-center text-[#000a1e]"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-headline text-headline-md font-bold text-[#000a1e] tracking-tight ml-2">
            Premium Plan
          </h1>
        </div>
      </header>

      <main className="px-4 py-6 flex flex-col items-center">
        {reason === "premium_required" && (
          <div className="w-full mb-4 bg-[#002147]/5 border border-[#002147]/20 rounded-xl p-4 text-center">
            <p className="font-body text-body-md text-[#002147]">
              You need a <strong>Premium</strong> subscription to access the seller dashboard.
            </p>
          </div>
        )}
        {reason === "expired" && (
          <div className="w-full mb-4 bg-[#ba1a1a]/5 border border-[#ba1a1a]/20 rounded-xl p-4 text-center">
            <p className="font-body text-body-md text-[#ba1a1a]">
              Your Premium subscription has expired. Renew to continue selling.
            </p>
          </div>
        )}

        {isAlreadyPremium ? (
          <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-[0px_4px_12px_rgba(0,33,71,0.08)] text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fdc34d]/20">
              <Crown className="h-8 w-8 text-[#715000]" />
            </div>
            <h2 className="font-headline text-[24px] font-bold text-[#1a1c1c] mb-2">
              You are Premium
            </h2>
            <p className="font-body text-body-md text-[#44474e] mb-4">
              Your plan is active until{" "}
              <span className="font-semibold">
                {subscription?.expiresAt?.toLocaleDateString() ?? "N/A"}
              </span>
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-[#fdc34d] text-[#001b3d] hover:shadow-[0px_8px_24px_rgba(253,195,77,0.32)] active:scale-[0.98] transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fdc34d]/20">
                <Sparkles className="h-8 w-8 text-[#715000]" />
              </div>
              <h2 className="font-headline text-[24px] font-bold text-[#1a1c1c]">
                Upgrade to Premium
              </h2>
              <p className="font-body text-body-md text-[#44474e] mt-1">
                Start selling your products on UTPreneurs
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-[0px_4px_12px_rgba(0,33,71,0.08)] border border-[#c4c6cf]/30">
              <div className="text-center mb-6">
                <p className="text-[#74777f] font-label text-label-md uppercase tracking-wider">
                  Monthly
                </p>
                <p className="font-headline text-[40px] font-bold text-[#002147]">
                  RM{premium.price}
                  <span className="text-[#74777f] text-[16px] font-body">/mo</span>
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {premium.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#fdc34d] flex-shrink-0 mt-0.5" />
                    <span className="font-body text-body-md text-[#1a1c1c]">{perk}</span>
                  </li>
                ))}
              </ul>

              {error && (
                <p className="text-sm font-medium text-[#ba1a1a] mb-4 text-center">{error}</p>
              )}

              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-[#fdc34d] text-[#001b3d] transition-all hover:shadow-[0px_8px_24px_rgba(253,195,77,0.32)] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:hover:shadow-none disabled:hover:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#001b3d]/30 border-t-[#001b3d]" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <Crown className="w-5 h-5" />
                    Upgrade to Premium
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-[#74777f] font-body text-body-md">
                Secure payment via HitPay (DuitNow QR)
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20 text-[#44474e]">Loading...</div>}>
      <UpgradeContent />
    </Suspense>
  );
}
