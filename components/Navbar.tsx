"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Store } from "lucide-react";
import { ChatButton } from "@/components/chat/ChatButton";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { useChatStore } from "@/store/chat-store";
import { createClient } from "@/lib/supabase";

export function Navbar() {
  const [chatOpen, setChatOpen] = useState(false);
  const fetchConversations = useChatStore((s) => s.fetchConversations);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("global-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => {
          fetchConversations();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchConversations]);

  const handleOpenChat = useCallback(() => {
    setChatOpen(true);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 mx-auto max-w-md bg-[#002147] shadow-[0_4px_12px_rgba(0,33,71,0.08)]">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex select-none items-center gap-2">
            <Store className="h-6 w-6 text-[#fdc34d]" />
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-white"
            >
              UTPreneurs
            </Link>
          </div>
          <ChatButton onClick={handleOpenChat} />
        </div>
      </header>
      <ChatDrawer open={chatOpen} onOpenChange={setChatOpen} />
    </>
  );
}
