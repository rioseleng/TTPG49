import { NextResponse } from "next/server";
import {
  createServerSupabase,
  createServiceRoleSupabase,
  getUserIdOrThrow,
  unauthorizedResponse,
} from "@/lib/supabase-server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const authSupabase = await createServerSupabase();
  const db = createServiceRoleSupabase();
  let userId: string;
  try {
    userId = await getUserIdOrThrow(authSupabase);
  } catch {
    return unauthorizedResponse();
  }

  const { data: conv } = await db
    .from("conversations")
    .select("id")
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .eq("id", id)
    .single();

  if (!conv) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: messages, error } = await db
    .from("messages")
    .select("*")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const result = (messages ?? []).map((msg) => ({
    id: msg.id,
    conversationId: msg.conversation_id,
    senderId: msg.sender_id,
    content: msg.content,
    createdAt: msg.created_at,
  }));

  return NextResponse.json(result);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const authSupabase = await createServerSupabase();
  const db = createServiceRoleSupabase();
  let userId: string;
  try {
    userId = await getUserIdOrThrow(authSupabase);
  } catch {
    return unauthorizedResponse();
  }

  const { content } = await request.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const { data: conv } = await db
    .from("conversations")
    .select("id")
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .eq("id", id)
    .single();

  if (!conv) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: message, error } = await db
    .from("messages")
    .insert({
      conversation_id: id,
      sender_id: userId,
      content: content.trim(),
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    id: message.id,
    conversationId: message.conversation_id,
    senderId: message.sender_id,
    content: message.content,
    createdAt: message.created_at,
  });
}
