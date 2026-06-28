import { create } from "zustand";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { PremiumSubscription } from "@/types";

const MOCK_USER: User = {
  id: "00000000-0000-0000-0000-000000000001",
  aud: "authenticated",
  role: "authenticated",
  email: "test@utp.edu.my",
  app_metadata: {},
  user_metadata: {},
  created_at: new Date().toISOString(),
};

interface AuthState {
  user: User | null;
  loading: boolean;
  tier: "FREE" | "PREMIUM" | null;
  subscription: PremiumSubscription | null;
  sendMagicLink: (email: string) => Promise<string | null>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  fetchUserTier: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  tier: null,
  subscription: null,

  sendMagicLink: async (email: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) return error.message;
    return null;
  },

  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, tier: null, subscription: null });
  },

  refreshSession: async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ user: session?.user ?? MOCK_USER, loading: false });
  },

  fetchUserTier: async () => {
    const { user } = get();
    if (!user) return;

    const supabase = createClient();

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("tier")
      .eq("id", user.id)
      .single();

    let tier = profile?.tier ?? "FREE";

    const { data: sub } = await supabase
      .from("premium_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "ACTIVE")
      .single();

    let subscription: PremiumSubscription | null = null;

    if (sub) {
      const expiresAt = new Date(sub.expires_at);
      if (expiresAt < new Date()) {
        await supabase
          .from("premium_subscriptions")
          .update({ status: "INACTIVE" })
          .eq("id", sub.id);
        await supabase
          .from("user_profiles")
          .update({ tier: "FREE" })
          .eq("id", user.id);
        tier = "FREE";
      } else {
        subscription = {
          id: sub.id,
          userId: sub.user_id,
          status: sub.status,
          expiresAt,
          createdAt: new Date(sub.created_at),
          updatedAt: new Date(sub.updated_at),
        };
        tier = "PREMIUM";
      }
    }

    set({ tier, subscription });
  },
}));
