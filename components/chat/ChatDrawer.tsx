"use client";

import { useEffect, useState, useCallback } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ConversationList } from "./ConversationList";
import { ChatWindow } from "./ChatWindow";
import { useChatStore } from "@/store/chat-store";
import { useAuthStore } from "@/store/auth-store";
import { MessageCircle } from "lucide-react";
import type { Conversation } from "@/types";

export function ChatDrawer({
  open,
  onOpenChange,
  initialSellerId,
  initialProductId,
  sellerName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSellerId?: string;
  initialProductId?: string;
  sellerName?: string;
}) {
  const conversations = useChatStore((s) => s.conversations);
  const isLoadingConversations = useChatStore((s) => s.isLoadingConversations);
  const fetchConversations = useChatStore((s) => s.fetchConversations);
  const findOrCreateConversation = useChatStore((s) => s.findOrCreateConversation);
  const openConversationAction = useChatStore((s) => s.openConversation);
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const user = useAuthStore((s) => s.user);

  const [activeConversation, setActiveConversationState] = useState<Conversation | null>(null);
  const [showList, setShowList] = useState(true);

  useEffect(() => {
    if (open && !initialSellerId) {
      fetchConversations();
    }
  }, [open, initialSellerId, fetchConversations]);

  useEffect(() => {
    if (!open) {
      setActiveConversationState(null);
      setShowList(true);
      setActiveConversation(null);
    }
  }, [open, setActiveConversation]);

  const handleStartConversation = useCallback(async (sellerId: string, productId?: string) => {
    const id = await findOrCreateConversation(sellerId, productId);
    if (id) {
      const currentUserId = user?.id ?? "00000000-0000-0000-0000-000000000001";
      const conv: Conversation = {
        id,
        buyerId: currentUserId,
        sellerId,
        productId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        otherUserName: sellerName ?? "Seller",
      };
      setActiveConversationState(conv);
      setShowList(false);
      setActiveConversation(id);
      openConversationAction(id);
    }
  }, [findOrCreateConversation, openConversationAction, setActiveConversation, user?.id, sellerName]);

  useEffect(() => {
    if (initialSellerId && open) {
      handleStartConversation(initialSellerId, initialProductId);
    }
  }, [initialSellerId, initialProductId, open, handleStartConversation]);

  const handleSelectConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      setActiveConversationState(conv);
      setShowList(false);
      setActiveConversation(id);
      openConversationAction(id);
    }
  };

  const handleBack = () => {
    setShowList(true);
    setActiveConversationState(null);
    setActiveConversation(null);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col" showCloseButton={false}>
        {showList ? (
          <>
            <SheetHeader className="border-b border-gray-200 px-4 py-3">
              <SheetTitle className="flex items-center gap-2 text-base">
                <MessageCircle className="h-5 w-5 text-[#002147]" />
                Messages
              </SheetTitle>
            </SheetHeader>
            <ConversationList
              conversations={conversations}
              activeId={null}
              isLoading={isLoadingConversations}
              onSelect={handleSelectConversation}
            />
          </>
        ) : activeConversation ? (
          <ChatWindow conversation={activeConversation} onBack={handleBack} />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
