import { createClient } from "./supabase";
import type { PremiumSubscription } from "@/types";

export async function getUserTier(): Promise<"FREE" | "PREMIUM" | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("tier")
    .single();
  return data?.tier ?? null;
}

export async function getActiveSubscription(): Promise<PremiumSubscription | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("premium_subscriptions")
    .select("*")
    .eq("status", "ACTIVE")
    .gte("expires_at", new Date().toISOString())
    .single();
  if (!data) return null;
  return {
    id: data.id,
    userId: data.user_id,
    status: data.status,
    expiresAt: new Date(data.expires_at),
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

export async function upgradeToPremium(): Promise<
  { url: string } | { error: string }
> {
  try {
    const res = await fetch("/api/create-premium-checkout", {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error ?? "Failed to create checkout" };
    }

    return { url: data.url };
  } catch {
    return { error: "Network error. Please try again." };
  }
}
