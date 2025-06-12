import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { connectToDatabase } from "@/lib/database/mongoose";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const to = formData.get("To") as string;
    const from = formData.get("From") as string;
    const callSid = formData.get("CallSid") as string;

    await connectToDatabase();

    // Find business owner by Twilio number
    const owner = await User.findOne({ twilioNumber: to });

    if (!owner) {
      const response = new twilio.twiml.VoiceResponse();
      response.say(
        "Sorry, this number is not configured. Please try again later."
      );
      response.hangup();

      return new NextResponse(response.toString(), {
        headers: { "Content-Type": "text/xml" },
      });
    }

    const response = new twilio.twiml.VoiceResponse();

    // Try connecting to owner first
    response.say("Please hold while we connect you.");

    const dial = response.dial({
      action: `/api/twilio/status?userId=${owner._id}&callSid=${callSid}&callerNumber=${from}`,
      timeout: 20,
      callerId: from,
    });

    dial.number(owner.phone);

    return new NextResponse(response.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Incoming call error:", error);

    const response = new twilio.twiml.VoiceResponse();
    response.say("Sorry, we encountered an error. Please try again later.");
    response.hangup();

    return new NextResponse(response.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }
}
