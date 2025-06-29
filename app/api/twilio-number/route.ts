import { connectToDatabase } from "@/lib/database/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { TwilioNumber } from "@/lib/database/models/twilioNumber.model";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find all Twilio numbers for the user
    const twilioNumbers = await TwilioNumber.find({ userId }).lean();

    return NextResponse.json({
      twilioNumbers: twilioNumbers.map((num) => ({
        ...num,
        _id: num._id.toString(),
        createdAt: num.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching Twilio numbers:", error);
    return NextResponse.json(
      { error: "Failed to fetch Twilio numbers" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { twilioNumberId, forwardToNumber } = await request.json();

    if (!twilioNumberId || !forwardToNumber) {
      return NextResponse.json(
        { error: "Twilio number ID and forward number are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Convert string ID to ObjectId
    const objectId = new mongoose.Types.ObjectId(twilioNumberId);

    // Update the Twilio number
    const updatedNumber = await TwilioNumber.findByIdAndUpdate(
      objectId,
      { forwardToNumber },
      { new: true }
    ).lean();

    if (!updatedNumber) {
      return NextResponse.json(
        { error: "Twilio number not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      twilioNumber: {
        ...updatedNumber,
        _id: updatedNumber._id.toString(),
        createdAt: updatedNumber.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating Twilio number:", error);
    return NextResponse.json(
      { error: "Failed to update Twilio number" },
      { status: 500 }
    );
  }
}
