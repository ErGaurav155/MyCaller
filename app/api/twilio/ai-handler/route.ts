// // app/api/twilio/ai-handler/route.ts
// import { NextRequest } from "next/server";
// import { connectToDatabase } from "@/lib/database/mongoose";
// import Lead from "@/lib/database/models/lead.model";
// import User from "@/lib/database/models/user.model";
// import { updateCredits } from "@/lib/action/user.actions";
// import { getSubscriptionInfo } from "@/lib/action/subscription.action";

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();
//     const speechResult = formData.get("SpeechResult") as string;
//     const callSid = formData.get("CallSid") as string;
//     const from = formData.get("From") as string;
//     const to = formData.get("To") as string;
//     const conversationStep = formData.get("step") || "1";

//     console.log("AI Handler called:", {
//       speechResult,
//       callSid,
//       from,
//       to,
//       conversationStep,
//     });

//     await connectToDatabase();

//     // Find user by Twilio number
//     const user = await User.findOne({ twilioNumber: to });
//     if (!user) {
//       throw new Error(`Twilio number ${to} not found`);
//     }

//     // Check subscription status and credits (only on first step)
//     if (conversationStep === "1") {
//       const subscriptions = await getSubscriptionInfo(user.clerkId);
//       const hasActiveSubscription = subscriptions.some(
//         (sub: any) => sub.subscriptionStatus === "active"
//       );

//       if (!hasActiveSubscription || user.creditBalance <= 0) {
//         return new Response(
//           `<?xml version="1.0" encoding="UTF-8"?>
//           <Response>
//             <Say voice="Polly.Joanna">
//               We're sorry, but your subscription is not active or you have no credits remaining.
//               Please contact support to resolve this issue. Goodbye.
//             </Say>
//             <Hangup/>
//           </Response>`,
//           { headers: { "Content-Type": "application/xml" } }
//         );
//       }
//     }

//     // Rest of your existing conversation handling code...
//     let twimlResponse = "";
//     let nextStep = parseInt(conversationStep as string) + 1;

//     switch (conversationStep) {
//       case "1":
//         twimlResponse = `
//                 <?xml version="1.0" encoding="UTF-8"?>
//                 <Response>
//                   <Say voice="Polly.Joanna">
//                     Hello! Thank you for calling. I'm an AI assistant. I'd be happy to help you today.
//                     May I please have your name?
//                   </Say>
//                   <Gather input="speech" timeout="10" speechTimeout="3" action="/api/twilio/ai-handler?step=2&callSid=${callSid}">
//                     <Say voice="Polly.Joanna">Please tell me your name.</Say>
//                   </Gather>
//                 </Response>
//               `;
//         break;

//       case "2":
//         twimlResponse = `
//                 <?xml version="1.0" encoding="UTF-8"?>
//                 <Response>
//                   <Say voice="Polly.Joanna">
//                     Thank you ${
//                       speechResult || "there"
//                     }. Could you please provide your email address?
//                   </Say>
//                   <Gather input="speech" timeout="15" speechTimeout="3" action="/api/twilio/ai-handler?step=3&callSid=${callSid}&name=${encodeURIComponent(
//           speechResult || ""
//         )}">
//                     <Say voice="Polly.Joanna">Please say your email address clearly.</Say>
//                   </Gather>
//                 </Response>
//               `;
//         break;

//       case "3":
//         const name = formData.get("name") as string;
//         twimlResponse = `
//                 <?xml version="1.0" encoding="UTF-8"?>
//                 <Response>
//                   <Say voice="Polly.Joanna">
//                     Thank you. What is your budget range for this project?
//                   </Say>
//                   <Gather input="speech" timeout="15" speechTimeout="3" action="/api/twilio/ai-handler?step=4&callSid=${callSid}&name=${encodeURIComponent(
//           name || ""
//         )}&email=${encodeURIComponent(speechResult || "")}">
//                     <Say voice="Polly.Joanna">Please tell me your budget range.</Say>
//                   </Gather>
//                 </Response>
//               `;
//         break;

//       case "4":
//         const name2 = formData.get("name") as string;
//         const email = formData.get("email") as string;
//         twimlResponse = `
//                 <?xml version="1.0" encoding="UTF-8"?>
//                 <Response>
//                   <Say voice="Polly.Joanna">
//                     Finally, could you please describe the problem or service you need help with?
//                   </Say>
//                   <Gather input="speech" timeout="30" speechTimeout="5" action="/api/twilio/ai-handler?step=5&callSid=${callSid}&name=${encodeURIComponent(
//           name2 || ""
//         )}&email=${encodeURIComponent(email || "")}&budget=${encodeURIComponent(
//           speechResult || ""
//         )}">
//                     <Say voice="Polly.Joanna">Please describe your requirements in detail.</Say>
//                   </Gather>
//                 </Response>
//               `;
//         break;

//       case "5":
//         // Final step - save lead and end call
//         const finalName = formData.get("name") as string;
//         const finalEmail = formData.get("email") as string;
//         const budget = formData.get("budget") as string;
//         const problem = speechResult;

//         // Create new lead
//         const newLead = new Lead({
//           userId: user.clerkId,
//           twilioNumber: to,
//           callerNumber: from,
//           name: finalName || "Unknown",
//           email: finalEmail || "",
//           address: "",
//           budget: budget || "Not specified",
//           problem: problem || "Not specified",
//           status: "pending",
//           createdAt: new Date(),
//           source: "ai-call",
//         });

//         const savedLead = await newLead.save();

//         // Deduct credit only if this is an AI-handled call
//         await updateCredits(user._id, -1);

//         twimlResponse = `
//           <?xml version="1.0" encoding="UTF-8"?>
//           <Response>
//             <Say voice="Polly.Joanna">
//               Thank you ${
//                 finalName || "for your time"
//               }. I have recorded all your information.
//               Someone from our team will contact you within 24 hours. Have a great day!
//             </Say>
//             <Hangup/>
//           </Response>
//         `;
//         break;

//       default:
//         twimlResponse = `
//                 <?xml version="1.0" encoding="UTF-8"?>
//                 <Response>
//                   <Say voice="Polly.Joanna">Thank you for calling. Goodbye!</Say>
//                   <Hangup/>
//                 </Response>
//               `;
//     }

//     return new Response(twimlResponse, {
//       headers: { "Content-Type": "application/xml" },
//     });
//   } catch (error) {
//     console.error("AI Handler error:", error);

//     const errorResponse = `
//       <?xml version="1.0" encoding="UTF-8"?>
//       <Response>
//         <Say voice="Polly.Joanna">
//           I'm sorry, there was a technical issue. Please try calling again later. Goodbye!
//         </Say>
//         <Hangup/>
//       </Response>
//     `;

//     return new Response(errorResponse, {
//       headers: { "Content-Type": "application/xml" },
//     });
//   }
// }import { NextRequest } from "next/server";
import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import Lead from "@/lib/database/models/lead.model";
import User from "@/lib/database/models/user.model";
import QuestionTemplate, {
  IQuestionTemplate,
} from "@/lib/database/models/questionTemp.model";
import { updateCredits } from "@/lib/action/user.actions";
import { defaultQuestions } from "@/lib/database/models/questionTemp.model";

interface Question {
  _id: string;
  question: string;
  order: number;
  required: boolean;
  type: "name" | "email" | "phone" | "address" | "budget" | "problem";
}

interface TemplateData {
  userId: string;
  twilioNumber: string;
  greeting: string;
  questions: Question[];
  closingMessage: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
  __v?: number;
}

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

    await connectToDatabase();

    // Find user by Twilio number
    const user = await User.findOne({ twilioNumber: to });
    if (!user) {
      throw new Error(`Twilio number ${to} not found`);
    }

    // Get the question template for this user and number
    const dbTemplate = await QuestionTemplate.findOne({
      userId: user.clerkId,
      twilioNumber: to,
      isActive: true,
    }).lean();

    // Create template data structure
    let template: TemplateData;

    // Use default template if no custom template exists
    if (!dbTemplate) {
      template = {
        userId: user.clerkId,
        twilioNumber: to,
        greeting:
          "Hello! Thank you for calling. I'm an AI assistant. I'd be happy to help you today.",
        questions: defaultQuestions,
        closingMessage:
          "Thank you for your time. I have recorded all your information. Someone from our team will contact you within 24 hours. Have a great day!",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: "default-template",
      };
    } else {
      // Cast to TemplateData type
      template = dbTemplate as unknown as TemplateData;
    }

    // Sort questions by order
    const sortedQuestions = [...template.questions].sort(
      (a, b) => a.order - b.order
    );

    let twimlResponse = "";
    const step = parseInt(conversationStep as string);
    let nextStep = step + 1;

    // Handle greeting step
    if (step === 1) {
      twimlResponse = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say voice="Polly.Joanna">
            ${template.greeting}
          </Say>
          <Gather 
            input="speech" 
            timeout="10" 
            speechTimeout="3" 
            action="/api/twilio/ai-handler?step=2"
          >
            <Say voice="Polly.Joanna">
              ${sortedQuestions[0].question}
            </Say>
          </Gather>
        </Response>
      `;
    }
    // Handle question steps
    else if (step <= sortedQuestions.length + 1) {
      const questionIndex = step - 2;
      const currentQuestion = sortedQuestions[questionIndex];
      const collectedData: Record<string, string> = {};

      // Collect previous answers from query params
      const formEntries = Array.from(formData.entries());
      for (const [key, value] of formEntries) {
        if (key.startsWith("ans_")) {
          collectedData[key.replace("ans_", "")] = value as string;
        }
      }

      // Add current answer to collected data
      if (speechResult && currentQuestion) {
        collectedData[currentQuestion.type] = speechResult;
      }

      // Build query params for next step
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(collectedData)) {
        queryParams.set(`ans_${key}`, value);
      }

      // Handle next question or final step
      if (step <= sortedQuestions.length) {
        const nextQuestion = sortedQuestions[step - 1];

        twimlResponse = `
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="Polly.Joanna">
              ${nextQuestion.question}
            </Say>
            <Gather 
              input="speech" 
              timeout="15" 
              speechTimeout="3" 
              action="/api/twilio/ai-handler?step=${nextStep}&${queryParams.toString()}"
            >
              <Say voice="Polly.Joanna">
                ${nextQuestion.question}
              </Say>
            </Gather>
          </Response>
        `;
      } else {
        // Final step - save lead with mapped fields
        const newLead = new Lead({
          userId: user.clerkId,
          twilioNumber: to,
          callerNumber: from,
          name: collectedData["name"] || "Unknown",
          email: collectedData["email"] || "",
          phone: collectedData["phone"] || from,
          address: collectedData["address"] || "Not specified",
          budget: collectedData["budget"] || "Not specified",
          problem: collectedData["problem"] || "Not specified",
          status: "pending",
          createdAt: new Date(),
          source: "ai-call",
          questionnaire: sortedQuestions.map((q) => ({
            question: q.question,
            answer: collectedData[q.type] || "",
            type: q.type,
            required: q.required,
          })),
        });

        await newLead.save();
        await updateCredits(user._id, -1);

        twimlResponse = `
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="Polly.Joanna">
              ${template.closingMessage}
            </Say>
            <Hangup/>
          </Response>
        `;
      }
    }
    // Handle unknown steps
    else {
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
