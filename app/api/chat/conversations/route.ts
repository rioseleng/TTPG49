import { NextResponse } from "next/server";
import {
  createServerSupabase,
  createServiceRoleSupabase,
  getUserIdOrThrow,
  unauthorizedResponse,
} from "@/lib/supabase-server";

export async function GET() {
  const authSupabase = await createServerSupabase();
  const db = createServiceRoleSupabase();
  let userId: string;
  try {
    userId = await getUserIdOrThrow(authSupabase);
  } catch {
    return unauthorizedResponse();
  }

  const { data: conversations, error } = await db
    .from("conversations")
    .select(`
      *,
      buyer:user_profiles!conversations_buyer_id_fkey(id, full_name),
      seller:user_profiles!conversations_seller_id_fkey(id, full_name)
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[chat] GET conversations query error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    const result = await Promise.all(
      (conversations ?? []).map(async (conv) => {
        const otherName =
          conv.buyer_id === userId
            ? conv.seller?.full_name || "Seller"
            : conv.buyer?.full_name || "Buyer";

        const { data: lastMsg } = await db
          .from("messages")
          .select("content, created_at")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        const { count: unreadCount } = await db
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .neq("sender_id", userId);

        const { data: read } = await db
          .from("message_reads")
          .select("last_read_at")
          .eq("user_id", userId)
          .eq("conversation_id", conv.id)
          .maybeSingle();

        let actualUnread = 0;
        if (read?.last_read_at) {
          const { count } = await db
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", conv.id)
            .neq("sender_id", userId)
            .gt("created_at", read.last_read_at);
          actualUnread = count ?? 0;
        } else {
          actualUnread = unreadCount ?? 0;
        }

        return {
          id: conv.id,
          buyerId: conv.buyer_id,
          sellerId: conv.seller_id,
          productId: conv.product_id ?? undefined,
          createdAt: conv.created_at,
          updatedAt: conv.updated_at,
          otherUserName: otherName,
          lastMessage: lastMsg?.content ?? undefined,
          lastMessageTime: lastMsg?.created_at ?? undefined,
          unreadCount: actualUnread,
        };
      }),
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("[chat] GET conversations map error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const authSupabase = await createServerSupabase();
  const db = createServiceRoleSupabase();
  let userId: string;
  try {
    userId = await getUserIdOrThrow(authSupabase);
  } catch {
    return unauthorizedResponse();
  }

  const { sellerId, productId } = await request.json();

  if (!sellerId) {
    return NextResponse.json({ error: "sellerId is required" }, { status: 400 });
  }

  if (sellerId === userId && process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Cannot chat with yourself" }, { status: 400 });
  }

  const { data: existing } = await db
    .from("conversations")
    .select("id")
    .eq("buyer_id", userId)
    .eq("seller_id", sellerId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ id: existing.id });
  }

  const { data: reverse } = await db
    .from("conversations")
    .select("id")
    .eq("buyer_id", sellerId)
    .eq("seller_id", userId)
    .maybeSingle();

  if (reverse) {
    return NextResponse.json({ id: reverse.id });
  }

  const { data: created, error } = await db
    .from("conversations")
    .insert({
      buyer_id: userId,
      seller_id: sellerId,
      product_id: productId ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[chat] insert conversation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: created.id });
}
