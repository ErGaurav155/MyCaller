import { NextRequest } from "next/server";
import twilio from "twilio";
import { connectToDatabase } from "@/lib/database/mongoose";
import { TwilioNumber } from "@/lib/database/models/twilioNumber.model";
import { Lead } from "@/lib/database/models/lead.model";
import { CallLog } from "@/lib/database/models/callLogs.model";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const speechResult = formData.get("SpeechResult") as string;
    const callSid = formData.get("CallSid") as string;
    const from = formData.get("From") as string;
    const to = formData.get("To") as string;
    const conversationStep = formData.get("step") || "1";

    console.log("AI Handler called:", {
      speechResult,
      callSid,
      from,
      to,
      conversationStep,
    });

    let twimlResponse = "";
    let nextStep = parseInt(conversationStep as string) + 1;

    switch (conversationStep) {
      case "1":
        twimlResponse = `
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="Polly.Joanna">
              Hello! Thank you for calling. I'm an AI assistant. I'd be happy to help you today. 
              May I please have your name?
            </Say>
            <Gather input="speech" timeout="10" speechTimeout="3" action="/api/twilio/ai-handler?step=2&callSid=${callSid}">
              <Say voice="Polly.Joanna">Please tell me your name.</Say>
            </Gather>
          </Response>
        `;
        break;

      case "2":
        twimlResponse = `
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="Polly.Joanna">
              Thank you ${
                speechResult || "there"
              }. Could you please provide your email address?
            </Say>
            <Gather input="speech" timeout="15" speechTimeout="3" action="/api/twilio/ai-handler?step=3&callSid=${callSid}&name=${encodeURIComponent(
          speechResult || ""
        )}">
              <Say voice="Polly.Joanna">Please say your email address clearly.</Say>
            </Gather>
          </Response>
        `;
        break;

      case "3":
        const name = formData.get("name") as string;
        twimlResponse = `
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="Polly.Joanna">
              Thank you. What is your budget range for this project?
            </Say>
            <Gather input="speech" timeout="15" speechTimeout="3" action="/api/twilio/ai-handler?step=4&callSid=${callSid}&name=${encodeURIComponent(
          name || ""
        )}&email=${encodeURIComponent(speechResult || "")}">
              <Say voice="Polly.Joanna">Please tell me your budget range.</Say>
            </Gather>
          </Response>
        `;
        break;

      case "4":
        const name2 = formData.get("name") as string;
        const email = formData.get("email") as string;
        twimlResponse = `
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="Polly.Joanna">
              Finally, could you please describe the problem or service you need help with?
            </Say>
            <Gather input="speech" timeout="30" speechTimeout="5" action="/api/twilio/ai-handler?step=5&callSid=${callSid}&name=${encodeURIComponent(
          name2 || ""
        )}&email=${encodeURIComponent(email || "")}&budget=${encodeURIComponent(
          speechResult || ""
        )}">
              <Say voice="Polly.Joanna">Please describe your requirements in detail.</Say>
            </Gather>
          </Response>
        `;
        break;

      case "5":
        // Final step - save lead and end call
        const finalName = formData.get("name") as string;
        const finalEmail = formData.get("email") as string;
        const budget = formData.get("budget") as string;
        const problem = speechResult;

        try {
          await connectToDatabase();

          // Find the Twilio number document
          const twilioNumber = await TwilioNumber.findOne({ phoneNumber: to });

          if (!twilioNumber) {
            throw new Error(`Twilio number ${to} not found`);
          }

          // Create new lead
          const newLead = new Lead({
            userId: twilioNumber.userId,
            twilioNumber: to,
            callerNumber: from,
            name: finalName || "Unknown",
            email: finalEmail || "",
            address: "",
            budget: budget || "Not specified",
            problem: problem || "Not specified",
            status: "pending",
            createdAt: new Date(),
            source: "ai-call",
          });

          const savedLead = await newLead.save();

          // Update call log
          await CallLog.updateOne(
            { callSid },
            {
              leadGenerated: true,
              handledBy: "ai",
              leadId: savedLead._id,
            }
          );

          console.log("Lead saved successfully:", savedLead);
        } catch (error) {
          console.error("Error saving lead:", error);
        }

        twimlResponse = `
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="Polly.Joanna">
              Thank you ${
                finalName || "for your time"
              }. I have recorded all your information. 
              Someone from our team will contact you within 24 hours. Have a great day!
            </Say>
            <Hangup/>
          </Response>
        `;
        break;

      default:
        twimlResponse = `
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="Polly.Joanna">Thank you for calling. Goodbye!</Say>
            <Hangup/>
          </Response>
        `;
    }

    return new Response(twimlResponse, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error) {
    console.error("AI Handler error:", error);

    const errorResponse = `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say voice="Polly.Joanna">
          I'm sorry, there was a technical issue. Please try calling again later. Goodbye!
        </Say>
        <Hangup/>
      </Response>
    `;

    return new Response(errorResponse, {
      headers: { "Content-Type": "application/xml" },
    });
  }
}
