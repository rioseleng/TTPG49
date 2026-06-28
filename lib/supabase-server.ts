import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001";

/**
 * Creates a Supabase client that uses cookies for auth (respects RLS).
 * Use this when you need the real authenticated user context.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

/**
 * Returns the authenticated user ID.
 * Falls back to the mock user ID in development so the chat feature
 * works without a real Supabase auth session (matching the client-side pattern).
 */
export async function getUserIdOrThrow(supabase: Awaited<ReturnType<typeof createServerSupabase>>): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!error && user?.id) {
    return user.id;
  }

  // Fallback: try session-based lookup for backward compat
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user?.id) {
    return session.user.id;
  }

  if (process.env.NODE_ENV === "development") {
    return MOCK_USER_ID;
  }

  throw new Error("Unauthorized");
}

/**
 * Creates a Supabase client with the service_role key.
 * Bypasses RLS — use only in trusted server-side API routes
 * where auth validation is handled in application code.
 */
export function createServiceRoleSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}

/**
 * Creates a 401 JSON response (used in API routes).
 */
export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
