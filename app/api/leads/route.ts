import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import Lead from "@/lib/database/models/lead.model";
import User from "@/lib/database/models/user.model";

const DEMO_USER_ID = "684eb625b30670b468652a10";

export async function GET() {
  try {
    await connectToDatabase();

    const user = await User.findOne({ _id: DEMO_USER_ID });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const leads = await Lead.find({ businessOwner: DEMO_USER_ID })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      leads: leads.map((lead) => ({
        ...lead,
        _id: lead._id as string,
        businessOwner: lead.businessOwner.toString(),
        createdAt: lead.createdAt.toISOString(),
        updatedAt: lead.updatedAt.toISOString(),
      })),
      user: {
        ...user.toObject(),
        _id: user._id.toString(),
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (error) {
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
