import { connectToDatabase } from "@/lib/database/mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/database/models/user.model";

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
    const user = await User.findOne({ _id: userId });
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching Twilio numbers:", error);
    return NextResponse.json(
      { error: "Failed to fetch Twilio numbers" },
      { status: 500 }
    );
  }
}
