"use client";

import { LeadType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Users, CheckCircle, Clock } from "lucide-react";

interface StatsCardsProps {
  leads: LeadType[];
}

export default function StatsCards({ leads }: StatsCardsProps) {
  const totalLeads = leads.length;
  const pendingLeads = leads.filter((lead) => lead.status === "pending").length;
  const contactedLeads = leads.filter(
    (lead) => lead.status === "contacted"
  ).length;
  const closedLeads = leads.filter((lead) => lead.status === "closed").length;

  const stats = [
    {
      title: "Total Leads",
      value: totalLeads,
      icon: Users,
      color: "text-[#00F0FF]",
      bgColor: "bg-[#00F0FF]/10",
    },
    {
      title: "Pending",
      value: pendingLeads,
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
    {
      title: "Contacted",
      value: contactedLeads,
      icon: Phone,
      color: "text-[#B026FF]",
      bgColor: "bg-[#B026FF]/10",
    },
    {
      title: "Closed",
      value: closedLeads,
      icon: CheckCircle,
      color: "text-[#FF2E9F]",
      bgColor: "bg-[#FF2E9F]/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="bg-[#0a0a0a]/60 backdrop-blur-sm border border-[#333] hover:border-[#00F0FF]/30 transition-colors"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
