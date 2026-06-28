"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export function PremiumGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, tier, subscription, fetchUserTier, refreshSession } =
    useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user && loading) {
      refreshSession();
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchUserTier().finally(() => setChecking(false));
  }, [user]);

  useEffect(() => {
    if (loading || checking) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (tier !== "PREMIUM") {
      router.replace("/upgrade?reason=premium_required");
      return;
    }

    if (
      !subscription ||
      subscription.status !== "ACTIVE" ||
      new Date(subscription.expiresAt) < new Date()
    ) {
      router.replace("/upgrade?reason=expired");
      return;
    }
  }, [loading, checking, user, tier, subscription, router]);

  if (loading || checking || !user || tier !== "PREMIUM") {
    return null;
  }

  return <>{children}</>;
}
