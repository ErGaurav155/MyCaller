import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { connectToDatabase } from "@/lib/database/mongoose";
import User from "@/lib/database/models/user.model";

const questions = [
  "May I have your name please?",
  "What's the best phone number to reach you?",
  "Can you provide your email address?",
  "What's your address or location?",
];

const fieldMap = ["name", "phone", "email", "address"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const callSid = searchParams.get("callSid");
    const callerNumber = searchParams.get("callerNumber");
    const step = parseInt(searchParams.get("step") || "0");

    await connectToDatabase();
    const user = await User.findById(userId);

    if (!user) {
      const response = new twilio.twiml.VoiceResponse();
      response.say("Sorry, we cannot process your call.");
      response.hangup();
      return new NextResponse(response.toString(), {
        headers: { "Content-Type": "text/xml" },
      });
    }

    const response = new twilio.twiml.VoiceResponse();

    if (step < questions.length) {
      // Ask next question
      response.say(questions[step]);
      response.record({
        action: `/api/twilio/collect?userId=${userId}&callSid=${callSid}&callerNumber=${callerNumber}&step=${step}`,
        maxLength: 30,
        playBeep: false,
        finishOnKey: "#",
      });
    } else {
      // All information collected
      response.say(
        "Thank you for providing your information. Someone from our team will contact you shortly. Have a great day!"
      );
      response.hangup();

      // Send notification to business owner
      await sendLeadNotification(user, callSid!);
    }

    return new NextResponse(response.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("AI Assistant error:", error);

    const response = new twilio.twiml.VoiceResponse();
    response.say("Sorry, we encountered an error.");
    response.hangup();

    return new NextResponse(response.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }
}

async function sendLeadNotification(user: any, callSid: string) {
  // This would send SMS notification to business owner
  // Implementation depends on your notification preferences
}
