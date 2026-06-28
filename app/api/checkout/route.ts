import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields: amount, orderId" },
        { status: 400 },
      );
    }

    const supabase = await createServerSupabase();
    const { data: order } = await supabase
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .single();

    if (order && order.status !== "PENDING") {
      const successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?order_id=${orderId}`;
      return NextResponse.json({ url: successUrl });
    }

    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?order_id=${orderId}`;

    const params = new URLSearchParams({
      amount: String(amount),
      currency: "MYR",
      reference_number: orderId,
      redirect_url: redirectUrl,
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
    console.error("Checkout API error:", error);
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
