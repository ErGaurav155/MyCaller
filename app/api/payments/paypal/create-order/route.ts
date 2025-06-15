import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const { amount, plan, billingCycle } = await req.json();

    if (!amount || !plan || !billingCycle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const order = await createPayPalOrder(amount, "USD");

    return NextResponse.json({
      orderId: order.id,
      approvalUrl: order.links.find((link: any) => link.rel === "approve")
        ?.href,
    });
  } catch (error) {
    console.error("PayPal order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
