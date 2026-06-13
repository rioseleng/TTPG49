"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";
import {
  Store,
  Receipt,
  Tag,
  Heart,
  LogOut,
  ChevronRight,
  Pencil,
} from "lucide-react";

export default function ProfilePage() {
  const { user, loading, refreshSession, logout } = useAuthStore();
  const supabase = createClient();
  const [profile, setProfile] = useState<{
    full_name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    refreshSession();
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-lg items-center justify-center px-4 py-32">
        <p className="text-[#44474e]">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <p className="text-6xl mb-4">🔒</p>
        <h1 className="text-2xl font-bold mb-2">Not signed in</h1>
        <p className="text-[#44474e] mb-6">
          Sign in to view your profile and orders.
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

  const displayEmail = profile?.email ?? user.email ?? "";
  const displayName = profile?.full_name ?? user.email?.split("@")[0]?.split("_")[0] ?? "User";
  const initials = displayEmail.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col pb-6">
      {/* User Hero */}
      <section className="py-8 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#f3f3f4] shadow-[0px_4px_12px_rgba(0,33,71,0.08)] bg-[#002147] flex items-center justify-center text-white text-3xl font-bold">
            {initials}
          </div>
          <button className="absolute bottom-0 right-0 bg-[#fdc34d] text-[#271900] w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform">
            <Pencil className="w-[18px] h-[18px]" />
          </button>
        </div>
        <h2 className="font-headline text-headline-lg text-[#002147]">
          {displayName}
        </h2>
        <p className="font-body text-body-md text-[#44474e]">
          {displayEmail}
        </p>
        <div className="flex gap-3 mt-4">
          <span className="bg-[#e8e8e8] text-[#44474e] px-3 py-1 rounded-xl font-label text-label-md">
            4.9 ★ (12 Reviews)
          </span>
        </div>
      </section>

      {/* Navigation List Groups */}
      <div className="space-y-6 px-4">
        {/* Activity */}
        <div>
          <h3 className="font-label text-label-md text-[#44474e] uppercase tracking-widest px-1 mb-2">
            Activity
          </h3>
          <div className="bg-white rounded-xl overflow-hidden border border-[#c4c6cf]/30 shadow-[0px_4px_12px_rgba(0,33,71,0.08)]">
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-between p-4 hover:bg-[#f3f3f4] transition-colors group border-b border-[#c4c6cf]/20"
            >
              <div className="flex items-center gap-4">
                <Store className="w-5 h-5 text-[#002147]" />
                <span className="font-body text-body-lg text-[#1a1c1c] font-bold">
                  Seller Dashboard
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[#002147] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                  SELLER
                </span>
                <ChevronRight className="w-5 h-5 text-[#74777f] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <button className="w-full flex items-center justify-between p-4 hover:bg-[#f3f3f4] transition-colors group border-b border-[#c4c6cf]/20">
              <div className="flex items-center gap-4">
                <Receipt className="w-5 h-5 text-[#002147]" />
                <span className="font-body text-body-lg text-[#1a1c1c]">
                  Order History
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[#fdc34d] text-[#271900] text-[10px] px-1.5 rounded-full font-bold">
                  3
                </span>
                <ChevronRight className="w-5 h-5 text-[#74777f] group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-[#f3f3f4] transition-colors group border-b border-[#c4c6cf]/20">
              <div className="flex items-center gap-4">
                <Tag className="w-5 h-5 text-[#002147]" />
                <span className="font-body text-body-lg text-[#1a1c1c]">
                  Sales History
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#74777f] group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-[#f3f3f4] transition-colors group">
              <div className="flex items-center gap-4">
                <Heart className="w-5 h-5 text-[#002147]" />
                <span className="font-body text-body-lg text-[#1a1c1c]">
                  Wishlist
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#74777f] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
          className="w-full py-4 px-4 flex items-center justify-center gap-3 text-[#ba1a1a] border-2 border-[#ba1a1a]/20 rounded-xl font-headline text-headline-sm hover:bg-[#ba1a1a]/5 active:scale-95 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}
