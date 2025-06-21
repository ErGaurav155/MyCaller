import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { amount, productId, billingCycle, buyerId } = await req.json();

    if (!amount || !productId || !billingCycle || !buyerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const subscription = await razorpay.subscriptions.create({
      plan_id: productId,
      total_count: 12,
      customer_notify: 1 as 0 | 1,

      notes: {
        buyerId: buyerId,
        productId: productId,
      },
    });

    if (!subscription) {
      throw new Error("Subscription creation failed");
    }

    const subscriptionId = subscription.id;

    return NextResponse.json({
      isOk: true,
      subsId: subscriptionId,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
