import { CallLog } from "@/lib/database/models/callLogs.model";
import { TwilioNumber } from "@/lib/database/models/twilioNumber.model";
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
    const twilioNumber = await TwilioNumber.findOne({ phoneNumber: to });

    if (!twilioNumber) {
      console.error("Twilio number not found:", to);
      return NextResponse.json(
        { error: "Number not configured" },
        { status: 404 }
      );
    }

    // Map Twilio status to our CallLog status
    const statusMap: Record<
      string,
      "completed" | "busy" | "no-answer" | "failed" | "canceled"
    > = {
      completed: "completed",
      busy: "busy",
      "no-answer": "no-answer",
      failed: "failed",
      canceled: "canceled",
      // Map initial statuses to 'completed' as placeholder
      queued: "completed",
      ringing: "completed",
      "in-progress": "completed",
    };

    const mappedStatus = statusMap[callStatus.toLowerCase()] || "completed";

    // Create new call log
    const callLog = new CallLog({
      userId: twilioNumber.userId,
      twilioNumber: to,
      callerNumber: from,
      callSid,
      direction: direction.toLowerCase() as "inbound" | "outbound",
      status: mappedStatus,
      duration: 0,
      startTime: new Date(),
      handledBy: "user", // Default, will be updated if AI handles
      leadGenerated: false,
      cost: 0,
    });

    await callLog.save();

    // Generate TwiML response
    let twimlResponse = "";

    if (callStatus === "ringing") {
      // First, try to forward to user's number
      twimlResponse = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Dial timeout="20" record="record-from-answer">
            <Number>${twilioNumber.forwardToNumber}</Number>
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
