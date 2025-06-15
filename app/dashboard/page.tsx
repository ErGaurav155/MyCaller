"use client";

import { Suspense } from "react";
import { connectToDatabase } from "@/lib/database/mongoose";
import Lead from "@/lib/database/models/lead.model";
import User from "@/lib/database/models/user.model";
import LeadsTable from "@/components/dashboard/LeadsTable";
import StatsCards from "@/components/dashboard/StatsCards";
import PhoneNumberCard from "@/components/dashboard/PhoneNumberCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const DEMO_USER_ID = "684eb625b30670b468652a10";

async function getLeads() {
  try {
    await connectToDatabase();

    // For demo purposes, create a user if it doesn't exist
    let user;
    try {
      user = await User.findOne({ _id: DEMO_USER_ID });
      if (!user) {
        user = await User.create({
          _id: DEMO_USER_ID,
          name: "Demo Business Owner",
          email: "demo@business.com",
          phone: "+1234567890",
          twilioNumber: "+1987654321",
          isActive: true,
        });
      }
    } catch (userError) {
      console.error("Error creating/fetching user:", userError);
      throw new Error("Failed to initialize user account");
    }

    let leads;
    try {
      leads = await Lead.find({ businessOwner: DEMO_USER_ID })
        .sort({ createdAt: -1 })
        .lean();
    } catch (leadsError) {
      console.error("Error fetching leads:", leadsError);
      throw new Error("Failed to fetch leads data");
    }

    return {
      leads: leads.map((lead) => ({
        ...lead,
        _id: lead._id as string,
        businessOwner: lead.businessOwner.toString(),
        createdAt: new Date(lead.createdAt),
        updatedAt: new Date(lead.updatedAt),
        phone: lead.phone || "", // Fallback for required field
        callSid: lead.callSid || "", // Fallback for required field
        status: lead.status || "pending", // Fallback for required field
      })),
      user,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);

    // Return safe fallback data
    return {
      leads: [],
      user: {
        _id: DEMO_USER_ID,
        name: "Demo Business Owner",
        email: "demo@business.com",
        phone: "+1234567890",
        twilioNumber: "+1987654321",
        isActive: true,
        aiSettings: {
          greeting: "Hello! Our team is currently busy, but I'm here to help.",
          questions: [],
          businessInfo: "Demo business",
        },
        createdAt: new Date(),
      },
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card
            key={i}
            className="bg-[#0a0a0a]/60 backdrop-blur-sm border border-[#333]"
          >
            <CardContent className="p-6">
              <Skeleton className="h-4 w-20 mb-2 bg-gray-700" />
              <Skeleton className="h-8 w-12 bg-gray-700" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-64 w-full bg-gray-700 rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-64 w-full bg-gray-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

async function DashboardContent() {
  const router = useRouter();

  try {
    const result = await getLeads();

    // If there was an error in getLeads, show error UI
    if (result.error) {
      return (
        <Card className="bg-[#0a0a0a]/60 backdrop-blur-sm border border-red-500/30">
          <CardContent className="p-6 text-center">
            <div className="text-red-400 text-2xl mb-3">⚠️</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Failed to Load Dashboard Data
            </h2>
            <p className="text-gray-400 mb-4">
              We encountered an issue while loading your dashboard information.
            </p>
            <p className="text-gray-500 text-sm mb-6">Error: {result.error}</p>
            <Button
              className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
              onClick={() => router.refresh()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    const { leads, user } = result;

    return (
      <>
        <StatsCards leads={leads} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Recent Leads</h2>
              <LeadsTable leads={leads} />
            </div>
          </div>

          <div className="space-y-6">
            <PhoneNumberCard
              phoneNumber={user.twilioNumber}
              isActive={user.isActive}
            />

            <Card className="bg-[#0a0a0a]/60 backdrop-blur-sm border border-[#00F0FF]/30">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-3">Quick Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Calls:</span>
                    <span className="font-medium text-white">
                      {leads.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">This Week:</span>
                    <span className="font-medium text-white">
                      {
                        leads.filter((lead) => {
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return new Date(lead.createdAt) > weekAgo;
                        }).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Conversion Rate:</span>
                    <span className="font-medium text-white">
                      {leads.length > 0
                        ? Math.round(
                            (leads.filter((l) => l.status === "closed").length /
                              leads.length) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error in DashboardContent:", error);

    return (
      <Card className="bg-[#0a0a0a]/60 backdrop-blur-sm border border-red-500/30">
        <CardContent className="p-6 text-center">
          <div className="text-red-400 text-2xl mb-3">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Unexpected Error
          </h2>
          <p className="text-gray-400 mb-4">
            Something went wrong while rendering the dashboard content.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
          <Button
            className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
            onClick={() => window.location.reload()}
          >
            Reload Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const { userId } = useAuth();

  if (!userId) {
    router.push("/sign-in");
  }
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 w-full">
            <Link
              href="/"
              className="flex items-center gap-2 text-white border border-gray-400 p-2 rounded-md hover:border-[#00F0FF] transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" /> Go Home
            </Link>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-white">
                AI Call Assistant Dashboard
              </h1>
              <p className="text-gray-400 mt-1 font-mono">
                Manage your leads and monitor your AI assistant performance
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">System Active</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  );
}
