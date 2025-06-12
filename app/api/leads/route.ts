import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    await connectToDatabase();

    const leads = await Lead.find({ businessOwner: userId })
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Get leads error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { leadId, status } = await req.json();

    if (!leadId || !status) {
      return NextResponse.json(
        { error: "Lead ID and status required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updatedLead = await Lead.findByIdAndUpdate(
      leadId,
      { status },
      { new: true }
    );

    if (!updatedLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ lead: updatedLead });
  } catch (error) {
    console.error("Update lead error:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}
