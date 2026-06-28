import { NextResponse } from "next/server";
import {
  createServerSupabase,
  createServiceRoleSupabase,
  getUserIdOrThrow,
  unauthorizedResponse,
} from "@/lib/supabase-server";

export async function POST(
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

  const { error } = await db.from("message_reads").upsert(
    {
      user_id: userId,
      conversation_id: id,
      last_read_at: new Date().toISOString(),
    },
    { onConflict: "user_id, conversation_id" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
