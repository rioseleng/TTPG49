import { create } from "zustand";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

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
  sendMagicLink: (email: string) => Promise<string | null>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

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
    set({ user: null });
  },

  refreshSession: async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ user: session?.user ?? MOCK_USER, loading: false });
  },
}));
