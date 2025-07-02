import User from "@/lib/database/models/user.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Parse Twilio webhook data
    const callSid = formData.get("CallSid") as string;
    const from = formData.get("From") as string;
    const to = formData.get("To") as string;
    const callStatus = formData.get("CallStatus") as string;
    const direction = formData.get("Direction") as string;

    console.log("Twilio webhook received:", {
      callSid,
      from,
      to,
      callStatus,
      direction,
    });

    await connectToDatabase();

    // Find the Twilio number configuration
    const user = await User.findOne({ twilioNumber: to });

    if (!user) {
      console.error("Twilio number not found:", to);
      return NextResponse.json(
        { error: "Number not configured" },
        { status: 404 }
      );
    }

    // Generate TwiML response
    let twimlResponse = "";

    if (callStatus === "ringing") {
      // First, try to forward to user's number
      twimlResponse = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Dial timeout="20" record="record-from-answer">
            <Number>${user.phone}</Number>
          </Dial>
          <Redirect>${process.env.NEXT_PUBLIC_APP_URL}/api/twilio/ai-handler?callSid=${callSid}</Redirect>
        </Response>
      `;
    }

    return new Response(twimlResponse, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Twilio webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
