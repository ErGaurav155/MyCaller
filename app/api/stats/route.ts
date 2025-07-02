// app/api/dashboard/monthly-stats/route.ts
import Lead from "@/lib/database/models/lead.model";
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
    // Calculate date ranges
    const now = new Date();
    const last30Days = new Date(now.setDate(now.getDate() - 30));
    const last60Days = new Date(now.setDate(now.getDate() - 60));
    const last90Days = new Date(now.setDate(now.getDate() - 90));

    // Get leads for each time period
    const [leads30, leads60, leads90] = await Promise.all([
      Lead.find({
        userId,
        createdAt: { $gte: last30Days },
      }),
      Lead.find({
        userId,
        createdAt: { $gte: last60Days, $lt: last30Days },
      }),
      Lead.find({
        userId,
        createdAt: { $gte: last90Days, $lt: last60Days },
      }),
    ]);

    // Get calls for each time period (assuming calls are tracked in Lead model)
    const calls30 = await Lead.countDocuments({
      userId,
      createdAt: { $gte: last30Days },
    });
    const calls60 = await Lead.countDocuments({
      userId,
      createdAt: { $gte: last60Days, $lt: last30Days },
    });
    const calls90 = await Lead.countDocuments({
      userId,
      createdAt: { $gte: last90Days, $lt: last60Days },
    });

    // Calculate resolved/pending and conversion rates
    const calculateStats = (leads: any[], calls: number) => {
      const resolved = leads.filter((l) => l.status === "resolved").length;
      const pending = leads.filter((l) => l.status === "pending").length;
      const conversionRate =
        calls > 0 ? Math.round((leads.length / calls) * 100) : 0;

      return {
        calls,
        leads: leads.length,
        resolved,
        pending,
        conversionRate,
      };
    };

    const stats30 = calculateStats(leads30, calls30);
    const stats60 = calculateStats(leads60, calls60);
    const stats90 = calculateStats(leads90, calls90);

    return NextResponse.json([
      {
        period: "Last 30 Days",
        ...stats30,
      },
      {
        period: "Last 60 Days",
        ...stats60,
      },
      {
        period: "Last 90 Days",
        ...stats90,
      },
    ]);
  } catch (error) {
    console.error("Error in monthly-stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly stats" },
      { status: 500 }
    );
  }
}
