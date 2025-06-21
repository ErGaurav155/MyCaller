"use client";

import { useState } from "react";
import { LeadType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock, User } from "lucide-react";
import { format } from "date-fns";

interface LeadsTableProps {
  leads: LeadType[];
}

export default function LeadsTable({ leads: initialLeads }: LeadsTableProps) {
  const [leads, setLeads] = useState(initialLeads);

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const response = await fetch("/api/leads", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leadId, status }),
      });

      if (response.ok) {
        const { lead } = await response.json();
        setLeads((prev) => prev.map((l) => (l._id === leadId ? lead : l)));
      }
    } catch (error) {
      console.error("Failed to update lead status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900/20 text-yellow-400 border-yellow-400/20";
      case "contacted":
        return "bg-blue-900/20 text-blue-400 border-blue-400/20";
      case "closed":
        return "bg-green-900/20 text-green-400 border-green-400/20";
      default:
        return "bg-gray-900/20 text-gray-400 border-gray-400/20";
    }
  };

  if (leads.length === 0) {
    return (
      <Card className="bg-[#0a0a0a]/60 backdrop-blur-sm border border-[#333]">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Phone className="h-12 w-12 text-gray-500 mb-4" />
          <p className="text-lg font-medium text-white mb-2">No leads yet</p>
          <p className="text-gray-400 text-center max-w-md font-mono">
            When customers call your AI assistant number, their information will
            appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {leads.map((lead) => (
        <Card
          key={lead._id}
          className="bg-[#0a0a0a]/60 backdrop-blur-sm border border-[#333] hover:border-[#00F0FF]/30 transition-colors"
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <User className="h-4 w-4 text-[#00F0FF]" />
                  {lead.name || "Unknown Caller"}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="h-3 w-3" />
                  {format(new Date(lead.createdAt), "MMM dd, yyyy at h:mm a")}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(lead.status)}>
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </Badge>
                <Select
                  value={lead.status}
                  onValueChange={(value) => updateLeadStatus(lead._id, value)}
                >
                  <SelectTrigger className="w-32 bg-[#0a0a0a] border-[#333] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-[#333] text-white">
                    <SelectItem value="pending" className="hover:bg-[#1a1a1a]">
                      Pending
                    </SelectItem>
                    <SelectItem
                      value="contacted"
                      className="hover:bg-[#1a1a1a]"
                    >
                      Contacted
                    </SelectItem>
                    <SelectItem value="closed" className="hover:bg-[#1a1a1a]">
                      Closed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#00F0FF]" />
                <span className="text-sm text-gray-300">
                  {lead.phone || "No phone provided"}
                </span>
              </div>
              {lead.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#B026FF]" />
                  <span className="text-sm text-gray-300">{lead.email}</span>
                </div>
              )}
              {lead.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#FF2E9F]" />
                  <span className="text-sm text-gray-300">{lead.address}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`tel:${lead.phone}`)}
                disabled={!lead.phone}
                className="bg-transparent border-[#333] text-white hover:bg-[#00F0FF]/10 hover:border-[#00F0FF]"
              >
                <Phone className="h-3 w-3 mr-1" />
                Call
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`mailto:${lead.email}`)}
                disabled={!lead.email}
                className="bg-transparent border-[#333] text-white hover:bg-[#B026FF]/10 hover:border-[#B026FF]"
              >
                <Mail className="h-3 w-3 mr-1" />
                Email
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
