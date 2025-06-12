import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { connectToDatabase } from "@/lib/database/mongoose";
import Lead from "@/models/Lead";
import { transcribeAudio } from "@/lib/openai";
import { twilioClient } from "@/lib/twilio";

const fieldMap = ["name", "phone", "email", "address"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const callSid = searchParams.get("callSid");
    const callerNumber = searchParams.get("callerNumber");
    const step = parseInt(searchParams.get("step") || "0");

    const recordingUrl = formData.get("RecordingUrl") as string;

    if (recordingUrl) {
      // Transcribe the recording
      const transcription = await transcribeAudio(recordingUrl);

      if (transcription) {
        await connectToDatabase();

        // Update or create lead
        const fieldName = fieldMap[step];
        const updateData: any = {};
        updateData[fieldName] = transcription;

        await Lead.findOneAndUpdate(
          { callSid },
          {
            ...updateData,
            businessOwner: userId,
            phone: callerNumber,
          },
          { upsert: true, new: true }
        );
      }
    }

    // Continue to next step
    const response = new twilio.twiml.VoiceResponse();
    const nextStep = step + 1;

    response.redirect(
      `/api/twilio/ai-assistant?userId=${userId}&callSid=${callSid}&callerNumber=${callerNumber}&step=${nextStep}`
    );

    return new NextResponse(response.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Collect error:", error);

    const response = new twilio.twiml.VoiceResponse();
    response.say(
      "Sorry, we had trouble recording your information. Let me try the next question."
    );

    const nextStep =
      parseInt(new URL(req.url).searchParams.get("step") || "0") + 1;
    const userId = new URL(req.url).searchParams.get("userId");
    const callSid = new URL(req.url).searchParams.get("callSid");
    const callerNumber = new URL(req.url).searchParams.get("callerNumber");

    response.redirect(
      `/api/twilio/ai-assistant?userId=${userId}&callSid=${callSid}&callerNumber=${callerNumber}&step=${nextStep}`
    );

    return new NextResponse(response.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }
}
