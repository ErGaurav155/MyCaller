import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { connectToDatabase } from "@/lib/database/mongoose";
import User from "@/lib/database/models/user.model";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const dialStatus = formData.get("DialCallStatus") as string;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const callSid = searchParams.get("callSid");
    const callerNumber = searchParams.get("callerNumber");

    const response = new twilio.twiml.VoiceResponse();

    if (dialStatus !== "completed") {
      await connectToDatabase();
      const user = await User.findById(userId);

      if (user) {
        // Redirect to AI assistant
        response.say(user.aiSettings.greeting);
        response.redirect(
          `/api/twilio/ai-assistant?userId=${userId}&callSid=${callSid}&callerNumber=${callerNumber}&step=0`
        );
      } else {
        response.say("Sorry, we cannot process your call at this time.");
        response.hangup();
      }
    }

    return new NextResponse(response.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Status callback error:", error);

    const response = new twilio.twiml.VoiceResponse();
    response.say("Sorry, we encountered an error.");
    response.hangup();

    return new NextResponse(response.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }
}
