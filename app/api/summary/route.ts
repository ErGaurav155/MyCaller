// app/api/dashboard/summary/route.ts
import Lead from "@/lib/database/models/lead.model";
import UserStats from "@/lib/database/models/userStats.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Get total calls and leads
    const userStat = await UserStats.findOne({ userId });
    if (!userStat) {
      return NextResponse.json([]);
    }
    // Get lead counts by status
    const [pending, resolved] = await Promise.all([
      Lead.countDocuments({ userId, status: "pending" }),
      Lead.countDocuments({ userId, status: "resolved" }),
    ]);

    return NextResponse.json({
      stats: {
        totalCalls: userStat?.totalCalls || 0,
        totalLeads: userStat?.totalLeads || 0,
        pendingLeads: pending,
        resolvedLeads: resolved,
        conversionRate: userStat.userStat,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard summary" },
      { status: 500 }
    );
  }
}
