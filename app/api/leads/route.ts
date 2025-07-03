import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import Lead from "@/lib/database/models/lead.model";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "2");
    const skip = (page - 1) * limit;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const leads = await Lead.find({ userId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    if (!leads) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    const total = await Lead.countDocuments({ userId: userId });
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      leads: leads.map((lead) => ({
        ...lead,
        _id: lead._id as string,
        createdAt: lead.createdAt.toISOString(),
        resolvedAt: lead.resolvedAt?.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json();

    // Validate required fields
    const requiredFields = [
      "userId",
      "twilioNumber",
      "callerNumber",
      "name",
      "problem",
    ];
    for (const field of requiredFields) {
      if (!leadData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    await connectToDatabase();

    // Create new lead using Mongoose model
    const newLead = new Lead({
      ...leadData,
      status: "pending",
      createdAt: new Date(),
      source: "ai-call",
    });

    const savedLead = await newLead.save();

    return NextResponse.json(
      {
        success: true,
        leadId: savedLead._id,
        lead: savedLead.toObject(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { leadId, status } = await request.json();

    if (!leadId || !status) {
      return NextResponse.json(
        { error: "Lead ID and status are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updateData: any = {
      status,
    };

    if (status === "resolved") {
      updateData.resolvedAt = new Date();
    }

    // Update lead using Mongoose model
    const updatedLead = await Lead.findByIdAndUpdate(leadId, updateData, {
      new: true,
    });

    if (!updatedLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      lead: updatedLead.toObject(),
    });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}
