import { Suspense } from "react";
import { connectToDatabase } from "@/lib/database/mongoose";
import Lead from "@/models/Lead";
import User from "@/models/User";
import LeadsTable from "@/components/dashboard/LeadsTable";
import StatsCards from "@/components/dashboard/StatsCards";
import PhoneNumberCard from "@/components/dashboard/PhoneNumberCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Mock user ID for demo - in real app, get from authentication
const DEMO_USER_ID = "demo-user-123";

async function getLeads() {
  try {
    await connectToDatabase();

    // For demo purposes, create a user if it doesn't exist
    let user = await User.findOne({ _id: DEMO_USER_ID });
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

    const leads = await Lead.find({ businessOwner: DEMO_USER_ID })
      .sort({ createdAt: -1 })
      .lean();

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
    console.error("Error fetching data:", error);
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
    };
  }
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-64 w-full" />
        </div>
        <div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}

async function DashboardContent() {
  const { leads, user } = await getLeads();

  return (
    <>
      <StatsCards leads={leads} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Leads
            </h2>
            <LeadsTable leads={leads} />
          </div>
        </div>

        <div className="space-y-6">
          <PhoneNumberCard
            phoneNumber={user.twilioNumber}
            isActive={user.isActive}
          />

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Calls:</span>
                  <span className="font-medium">{leads.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Week:</span>
                  <span className="font-medium">
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
                  <span className="text-gray-600">Conversion Rate:</span>
                  <span className="font-medium">
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
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                AI Call Assistant Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your leads and monitor your AI assistant performance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">System Active</span>
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
