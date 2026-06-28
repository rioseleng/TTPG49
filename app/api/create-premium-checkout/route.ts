import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST() {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("tier")
      .eq("id", user.id)
      .single();

    if (profile?.tier === "PREMIUM") {
      return NextResponse.json(
        { error: "Already a Premium member" },
        { status: 400 },
      );
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { data: subscription, error: insertError } = await supabase
      .from("premium_subscriptions")
      .upsert(
        {
          user_id: user.id,
          status: "PENDING",
          expires_at: expiresAt.toISOString(),
        },
        { onConflict: "user_id" },
      )
      .select()
      .single();

    if (insertError) {
      console.error("Failed to create subscription:", insertError);
      return NextResponse.json(
        { error: "Failed to create subscription" },
        { status: 500 },
      );
    }

    const referenceNumber = subscription?.id ?? crypto.randomUUID();
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/upgrade/success?subscription_id=${referenceNumber}`;

    const params = new URLSearchParams({
      amount: "25.00",
      currency: "MYR",
      reference_number: referenceNumber,
      redirect_url: redirectUrl,
      purpose: "UTPreneurs Premium Subscription (1 month)",
    });
    params.append("payment_methods[]", "duitnow");

    const hitpayResponse = await fetch(
      "https://api.sandbox.hit-pay.com/v1/payment-requests",
      {
        method: "POST",
        headers: {
          "X-BUSINESS-API-KEY": process.env.HITPAY_API_KEY ?? "",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      },
    );

    const data = await hitpayResponse.json();

    if (!hitpayResponse.ok) {
      console.error("HitPay error:", data);
      return NextResponse.json(
        { error: data.message ?? "HitPay payment creation failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error("Create premium checkout error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
