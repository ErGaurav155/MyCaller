import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import {
  QuestionTemplate,
  IQuestionTemplate,
  defaultQuestions,
} from "@/lib/database/models/questionTemp.model";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const twilioNumber = searchParams.get("twilioNumber");

    if (!userId || !twilioNumber) {
      return NextResponse.json(
        { error: "User ID and Twilio number are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let template = await QuestionTemplate.findOne({
      userId,
      twilioNumber,
    }).lean();

    // If no template exists, create a default one
    if (!template) {
      const defaultTemplate = {
        userId,
        twilioNumber,
        greeting:
          "Hello! Thank you for calling. I'm an AI assistant and I'd be happy to help you today.",
        questions: defaultQuestions,
        closingMessage:
          "Thank you for your time. I have recorded all your information. Someone from our team will contact you within 24 hours. Have a great day!",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newTemplate = new QuestionTemplate(defaultTemplate);
      await newTemplate.save();
      template = newTemplate.toObject() as any;
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const templateData = await request.json();
    const { userId, twilioNumber, greeting, questions, closingMessage } =
      templateData;

    if (!userId || !twilioNumber) {
      return NextResponse.json(
        { error: "User ID and Twilio number are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updateData = {
      greeting,
      questions,
      closingMessage,
      updatedAt: new Date(),
    };

    const options = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      lean: true,
    };

    const updatedTemplate = await QuestionTemplate.findOneAndUpdate(
      { userId, twilioNumber },
      {
        $set: updateData,
        $setOnInsert: {
          isActive: true,
          createdAt: new Date(),
        },
      },
      options
    );

    return NextResponse.json({ success: true, template: updatedTemplate });
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { error: "Failed to update template" },
      { status: 500 }
    );
  }
}
