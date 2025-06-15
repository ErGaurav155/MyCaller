import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import { connectToDatabase } from "@/lib/database/mongoose";
import User from "@/lib/database/models/user.model";

export async function POST(req: NextRequest) {
  try {
    const { orderId, userId, plan, billingCycle } = await req.json();

    const result = await capturePayPalOrder(orderId);

    if (result.status === "COMPLETED") {
      // Update user subscription
      await connectToDatabase();
      const startDate = new Date();
      const endDate = new Date();

      if (billingCycle === "yearly") {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      await User.findByIdAndUpdate(userId, {
        subscription: {
          plan,
          status: "active",
          billingCycle,
          startDate,
          endDate,
          paymentMethod: "paypal",
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Payment not completed" },
      { status: 400 }
    );
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.json(
      { error: "Payment capture failed" },
      { status: 500 }
    );
  }
}
