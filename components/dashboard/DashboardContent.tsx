"use client";

import { useState } from "react";

import LeadsTable from "@/components/dashboard/LeadsTable";
import StatsCards from "@/components/dashboard/StatsCards";
import PhoneNumberCard from "@/components/dashboard/PhoneNumberCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DashboardData } from "@/types";

function DashboardContent({ initialData }: { initialData: DashboardData }) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const newData: DashboardData = await res.json();
      setData(newData);
    } catch (error) {
      console.error("Failed to refresh data:", error);
      setData({
        ...data,
        error: "Failed to refresh data",
      });
    } finally {
      setLoading(false);
    }
  };
  if (!initialData || initialData.error || !initialData.user) {
    return (
      <Card className="bg-[#0a0a0a]/60 backdrop-blur-sm border border-red-500/30">
        <CardContent className="p-6 text-center">
          <p className="text-red-500">
            {initialData?.error || "Failed to load dashboard data"}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (data.error || !data.user) {
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
          <p className="text-gray-500 text-sm mb-6">Error: {data.error}</p>
          <Button
            className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
            onClick={refreshData}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Try Again"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { leads, user } = data;

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={refreshData} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

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
            twilioNumber={user.twilioNumber!}
            phoneNumber={user.phone}
            isActive={user.isActive}
          />

          <Card className="bg-[#0a0a0a]/60 backdrop-blur-sm border border-[#00F0FF]/30">
            <CardContent className="p-6">
              <h3 className="font-semibold text-white mb-3">Quick Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Calls:</span>
                  <span className="font-medium text-white">{leads.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">This Week:</span>
                  <span className="font-medium text-white">
                    {
                      leads.filter((lead) => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        const leadDate =
                          typeof lead.createdAt === "string"
                            ? new Date(lead.createdAt)
                            : lead.createdAt;
                        return leadDate > weekAgo;
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
}

export default DashboardContent;
