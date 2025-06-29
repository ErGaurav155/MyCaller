import { CallLog } from "@/lib/database/models/callLogs.model";
import { Lead } from "@/lib/database/models/lead.model";
import { User } from "@/lib/database/models/user.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { NextRequest, NextResponse } from "next/server";

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

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Total calls
    const totalCalls = await CallLog.countDocuments({ userId });

    // Total leads
    const totalLeads = await Lead.countDocuments({ userId });

    // Monthly stats for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await CallLog.aggregate([
      {
        $match: {
          userId: userId,
          startTime: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$startTime" },
            month: { $month: "$startTime" },
          },
          calls: { $sum: 1 },
          leads: { $sum: { $cond: [{ $eq: ["$leadGenerated", true] }, 1, 0] } },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Convert to more readable format
    const formattedMonthlyStats = monthlyStats.map((stat) => ({
      month: new Date(stat._id.year, stat._id.month - 1).toLocaleString(
        "default",
        { month: "short", year: "numeric" }
      ),
      calls: stat.calls,
      leads: stat.leads,
    }));

    // Lead status distribution
    const leadsByStatus = await Lead.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const pendingLeads =
      leadsByStatus.find((item) => item._id === "pending")?.count || 0;
    const resolvedLeads =
      leadsByStatus.find((item) => item._id === "resolved")?.count || 0;

    // Conversion rate
    const conversionRate =
      totalCalls > 0 ? Math.round((totalLeads / totalCalls) * 100) : 0;

    const stats = {
      totalCalls,
      totalLeads,
      pendingLeads,
      resolvedLeads,
      conversionRate,
      monthlyStats: formattedMonthlyStats,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
