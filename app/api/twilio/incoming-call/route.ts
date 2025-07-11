// import { NextRequest, NextResponse } from "next/server";
// import twilio from "twilio";
// import { connectToDatabase } from "@/lib/database/mongoose";
// import User from "@/lib/database/models/user.model";

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const to = formData.get("To") as string;
//     const from = formData.get("From") as string;
//     const callSid = formData.get("CallSid") as string;

//     await connectToDatabase();

//     // Find business owner by Twilio number
//     const owner = await User.findOne({ twilioNumber: to });

//     if (!owner) {
//       const response = new twilio.twiml.VoiceResponse();
//       response.say(
//         "Sorry, this number is not configured. Please try again later."
//       );
//       response.hangup();

//       return new NextResponse(response.toString(), {
//         headers: { "Content-Type": "text/xml" },
//       });
//     }

//     const response = new twilio.twiml.VoiceResponse();

//     // Try connecting to owner first
//     response.say("Please hold while we connect you.");

//     const dial = response.dial({
//       action: `/api/twilio/status?userId=${owner._id}&callSid=${callSid}&callerNumber=${from}`,
//       timeout: 20,
//       callerId: from,
//     });

//     dial.number(owner.phone);

//     return new NextResponse(response.toString(), {
//       headers: { "Content-Type": "text/xml" },
//     });
//   } catch (error) {
//     console.error("Incoming call error:", error);

//     const response = new twilio.twiml.VoiceResponse();
//     response.say("Sorry, we encountered an error. Please try again later.");
//     response.hangup();

//     return new NextResponse(response.toString(), {
//       headers: { "Content-Type": "text/xml" },
//     });
//   }
// }
// app/api/twilio/incoming-call/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const callSid = formData.get("CallSid") as string;
    const from = formData.get("From") as string;
    const to = formData.get("To") as string;
    const callStatus = formData.get("CallStatus") as string;

    // Check if call is unanswered after 15 seconds
    if (
      callStatus === "no-answer" ||
      callStatus === "busy" ||
      callStatus === "failed"
    ) {
      // Route to AI assistant
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Redirect method="POST">/api/twilio/ai-handler?step=1</Redirect>
        </Response>`,
        { headers: { "Content-Type": "application/xml" } }
      );
    }

    // If answered, route to your human agent
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Dial timeout="15">YOUR_AGENT_PHONE_NUMBER</Dial>
      </Response>`,
      { headers: { "Content-Type": "application/xml" } }
    );
  } catch (error) {
    console.error("Incoming call error:", error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>We're experiencing technical difficulties. Please try again later.</Say>
        <Hangup/>
      </Response>`,
      { headers: { "Content-Type": "application/xml" } }
    );
  }
}
