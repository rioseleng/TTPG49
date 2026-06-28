"use client";

import { create } from "zustand";
import { createClient } from "@/lib/supabase";
import type { Conversation, Message } from "@/types";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useAuthStore } from "@/store/auth-store";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  unreadTotals: number;
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;

  fetchConversations: () => Promise<void>;
  findOrCreateConversation: (sellerId: string, productId?: string) => Promise<string | null>;
  openConversation: (id: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  subscribeToConversation: (conversationId: string) => () => void;
  setActiveConversation: (id: string | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  unreadTotals: 0,
  isLoadingConversations: false,
  isLoadingMessages: false,
  isSending: false,

  fetchConversations: async () => {
    set({ isLoadingConversations: true });
    try {
      const res = await fetch("/api/chat/conversations");
      if (!res.ok) return;
      const data = await res.json();
      const totalUnread = data.reduce(
        (sum: number, c: Conversation) => sum + (c.unreadCount ?? 0),
        0,
      );
      set({ conversations: data, unreadTotals: totalUnread });
    } finally {
      set({ isLoadingConversations: false });
    }
  },

  findOrCreateConversation: async (sellerId: string, productId?: string) => {
    const res = await fetch("/api/chat/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sellerId, productId }),
    });
    if (!res.ok) return null;
    const { id } = await res.json();
    return id as string;
  },

  openConversation: async (id: string) => {
    set({ activeConversationId: id, isLoadingMessages: true });
    try {
      const [conv] = get().conversations.filter((c) => c.id === id);
      if (!conv) {
        const res = await fetch(`/api/chat/conversations`);
        if (res.ok) {
          const data = await res.json();
          set({ conversations: data });
        }
      }

      const res = await fetch(`/api/chat/conversations/${id}/messages`);
      if (!res.ok) return;
      const data = await res.json();
      set((state) => ({
        messages: { ...state.messages, [id]: data },
      }));

      await get().markAsRead(id);
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (conversationId: string, content: string) => {
    if (!content.trim()) return;
    set({ isSending: true });
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const senderId = session?.user?.id ?? "00000000-0000-0000-0000-000000000001";

    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      conversationId,
      senderId,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [
          ...(state.messages[conversationId] ?? []),
          optimistic,
        ],
      },
    }));

    try {
      const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!res.ok) {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: (state.messages[conversationId] ?? []).filter(
              (m) => m.id !== optimistic.id,
            ),
          },
        }));
      } else {
        const saved = await res.json();
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: (state.messages[conversationId] ?? []).map((m) =>
              m.id === optimistic.id ? saved : m,
            ),
          },
        }));
      }
    } finally {
      set({ isSending: false });
    }
  },

  markAsRead: async (conversationId: string) => {
    await fetch(`/api/chat/conversations/${conversationId}/read`, {
      method: "POST",
    });
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c,
      ),
      unreadTotals: state.conversations
        .filter((c) => c.id !== conversationId)
        .reduce((sum, c) => sum + (c.unreadCount ?? 0), 0),
    }));
  },

  subscribeToConversation: (conversationId: string) => {
    const supabase = createClient();
    const currentUserId =
      useAuthStore.getState().user?.id ?? "00000000-0000-0000-0000-000000000001";

    const channel: RealtimeChannel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const msg = payload.new as Record<string, string>;
          const message: Message = {
            id: msg.id,
            conversationId: msg.conversation_id,
            senderId: msg.sender_id,
            content: msg.content,
            createdAt: msg.created_at,
          };

          const currentState = get();
          if (currentState.messages[conversationId]?.some((m) => m.id === message.id)) return;

          set((state) => {
            const updatedMessages = {
              ...state.messages,
              [conversationId]: [
                ...(state.messages[conversationId] ?? []),
                message,
              ],
            };

            const updatedConversations = state.conversations.map((c) =>
              c.id === conversationId
                ? {
                    ...c,
                    lastMessage: message.content,
                    lastMessageTime: message.createdAt,
                    unreadCount:
                      message.senderId !== currentUserId
                        ? (c.unreadCount ?? 0) + 1
                        : c.unreadCount,
                  }
                : c,
            );

            const totalUnread = updatedConversations.reduce(
              (sum, c) => sum + (c.unreadCount ?? 0),
              0,
            );

            return {
              messages: updatedMessages,
              conversations: updatedConversations,
              unreadTotals: totalUnread,
            };
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  setActiveConversation: (id) => set({ activeConversationId: id }),

  clearMessages: () =>
    set({ messages: {}, activeConversationId: null }),
}));
