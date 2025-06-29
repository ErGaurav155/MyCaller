// import { NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/database/mongoose";
// import Lead from "@/lib/database/models/lead.model";
// import User from "@/lib/database/models/user.model";

// const DEMO_USER_ID = "684eb625b30670b468652a10";

// export async function GET() {
//   try {
//     await connectToDatabase();

//     const user = await User.findOne({ _id: DEMO_USER_ID });
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const leads = await Lead.find({ businessOwner: DEMO_USER_ID })
//       .sort({ createdAt: -1 })
//       .lean();

//     return NextResponse.json({
//       leads: leads.map((lead) => ({
//         ...lead,
//         _id: lead._id as string,
//         businessOwner: lead.businessOwner.toString(),
//         createdAt: lead.createdAt.toISOString(),
//         updatedAt: lead.updatedAt.toISOString(),
//       })),
//       user: {
//         ...user.toObject(),
//         _id: user._id.toString(),
//         createdAt: user.createdAt.toISOString(),
//       },
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch leads" },
//       { status: 500 }
//     );
//   }
// }
// export async function PUT(req: NextRequest) {
//   try {
//     const { leadId, status } = await req.json();

//     if (!leadId || !status) {
//       return NextResponse.json(
//         { error: "Lead ID and status required" },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     const updatedLead = await Lead.findByIdAndUpdate(
//       leadId,
//       { status },
//       { new: true }
//     );

//     if (!updatedLead) {
//       return NextResponse.json({ error: "Lead not found" }, { status: 404 });
//     }

//     return NextResponse.json({ lead: updatedLead });
//   } catch (error) {
//     console.error("Update lead error:", error);
//     return NextResponse.json(
//       { error: "Failed to update lead" },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import { User } from "@/lib/database/models/user.model";
import { Lead } from "@/lib/database/models/lead.model";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Build filter
    const filter: any = { userId };
    if (status) {
      filter.status = status;
    }

    // Fetch leads using Mongoose model
    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    return NextResponse.json({
      leads: leads.map((lead) => ({
        ...lead,
        _id: lead._id.toString(),
        createdAt: lead.createdAt.toISOString(),
        resolvedAt: lead.resolvedAt?.toISOString(),
      })),
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
    const { leadId, status, notes } = await request.json();

    if (!leadId || !status) {
      return NextResponse.json(
        { error: "Lead ID and status are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updateData: any = {
      status,
      ...(notes && { notes }),
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
