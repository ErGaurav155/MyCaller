"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle,
  MessageSquare,
} from "lucide-react";

interface Lead {
  _id: string;
  name: string;
  phone: string;
  email: string;
  budget: string;
  problem: string;
  address: string;
  status: "pending" | "resolved";
  createdAt: string;
  twilioNumber: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function LeadPage({
  response,
  buyer,
}: {
  response: boolean;
  buyer: string;
}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 2,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();
  const router = useRouter();

  // Wrap fetchLeads in useCallback to prevent unnecessary recreations
  const fetchLeads = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);

        const leadsRes = await fetch(
          `/api/leads?userId=${buyer}&page=${page}&limit=${pagination.limit}`
        );
        const leadsData = await leadsRes.json();
        setLeads(
          leadsData.leads.map((lead: any) => ({
            ...lead,
            phone: lead.callerNumber,
            budget: lead.budget || "Not specified",
            address: lead.address || "Not specified",
          }))
        );

        setPagination(
          leadsData.pagination || {
            page,
            limit: pagination.limit,
            total: 0,
            totalPages: 1,
          }
        );
      } catch (error) {
        console.error("Failed to fetch leads:", error);
      } finally {
        setLoading(false);
      }
    },
    [buyer, pagination.limit]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= pagination.totalPages) {
        fetchLeads(newPage);
      }
    },
    [fetchLeads, pagination.totalPages]
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusChange = async (
    leadId: string,
    newStatus: "pending" | "resolved"
  ) => {
    try {
      if (buyer) {
        const response = await fetch("/api/leads", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leadId,
            status: newStatus,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update lead status");
        }

        const data = await response.json();

        setLeads((prev) =>
          prev.map((lead) =>
            lead._id === leadId ? { ...lead, ...data.lead } : lead
          )
        );
      }
    } catch (error) {
      console.error("Error updating lead status:", error);
    }
  };

  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    if (response === false) {
      setLeads([
        {
          _id: "1",
          name: "Rahul Sharma",
          phone: "+91 98765 43210",
          email: "rahul@example.com",
          budget: "₹50,000 - ₹1,00,000",
          problem: "Need digital marketing services for restaurant",
          address: "Mumbai, Maharashtra",
          status: "pending",
          createdAt: "2025-01-08T10:30:00Z",
          twilioNumber: "+1 234 567 8901",
        },
        {
          _id: "2",
          name: "Priya Patel",
          phone: "+91 87654 32109",
          email: "priya@example.com",
          budget: "₹25,000 - ₹50,000",
          problem: "Website development for small business",
          address: "Ahmedabad, Gujarat",
          status: "resolved",
          createdAt: "2025-01-07T14:15:00Z",
          twilioNumber: "+1 234 567 8901",
        },
        {
          _id: "3",
          name: "Amit Kumar",
          phone: "+91 76543 21098",
          email: "amit@example.com",
          budget: "₹1,00,000+",
          problem: "Complete IT infrastructure setup",
          address: "Delhi, India",
          status: "pending",
          createdAt: "2025-01-06T09:45:00Z",
          twilioNumber: "+1 234 567 8901",
        },
        {
          _id: "4",
          name: "Amit Kumar",
          phone: "+91 76543 21098",
          email: "amit@example.com",
          budget: "₹1,00,000+",
          problem: "Complete IT infrastructure setup",
          address: "Delhi, India",
          status: "pending",
          createdAt: "2025-01-06T09:45:00Z",
          twilioNumber: "+1 234 567 8901",
        },
        {
          _id: "5",
          name: "Amit Kumar",
          phone: "+91 76543 21098",
          email: "amit@example.com",
          budget: "₹1,00,000+",
          problem: "Complete IT infrastructure setup",
          address: "Delhi, India",
          status: "pending",
          createdAt: "2025-01-06T09:45:00Z",
          twilioNumber: "+1 234 567 8901",
        },
        {
          _id: "6",
          name: "Amit Kumar",
          phone: "+91 76543 21098",
          email: "amit@example.com",
          budget: "₹1,00,000+",
          problem: "Complete IT infrastructure setup",
          address: "Delhi, India",
          status: "pending",
          createdAt: "2025-01-06T09:45:00Z",
          twilioNumber: "+1 234 567 8901",
        },
        {
          _id: "7",
          name: "Amit Kumar",
          phone: "+91 76543 21098",
          email: "amit@example.com",
          budget: "₹1,00,000+",
          problem: "Complete IT infrastructure setup",
          address: "Delhi, India",
          status: "pending",
          createdAt: "2025-01-06T09:45:00Z",
          twilioNumber: "+1 234 567 8901",
        },
        {
          _id: "8",
          name: "Amit Kumar",
          phone: "+91 76543 21098",
          email: "amit@example.com",
          budget: "₹1,00,000+",
          problem: "Complete IT infrastructure setup",
          address: "Delhi, India",
          status: "pending",
          createdAt: "2025-01-06T09:45:00Z",
          twilioNumber: "+1 234 567 8901",
        },
        {
          _id: "9",
          name: "Amit Kumar",
          phone: "+91 76543 21098",
          email: "amit@example.com",
          budget: "₹1,00,000+",
          problem: "Complete IT infrastructure setup",
          address: "Delhi, India",
          status: "pending",
          createdAt: "2025-01-06T09:45:00Z",
          twilioNumber: "+1 234 567 8901",
        },
        {
          _id: "10",
          name: "Amit Kumar",
          phone: "+91 76543 21098",
          email: "amit@example.com",
          budget: "₹1,00,000+",
          problem: "Complete IT infrastructure setup",
          address: "Delhi, India",
          status: "pending",
          createdAt: "2025-01-06T09:45:00Z",
          twilioNumber: "+1 234 567 8901",
        },
      ]);

      // Set pagination for sample data
      setPagination({
        page: 1,
        limit: 4,
        total: 10,
        totalPages: 3,
      });
      setLoading(false);
    } else {
      fetchLeads();
    }
  }, [fetchLeads, router, userId, response]);

  if (loading) return <div>Loading leads...</div>;

  return (
    <div>
      <div className="space-y-4">
        {leads.map((lead) => (
          <div
            key={lead._id}
            className="border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{lead.name}</h3>
                <p className="text-sm text-gray-400 font-mono">
                  {lead.phone} • {lead.email}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    lead.status === "pending" ? "destructive" : "default"
                  }
                  className={
                    lead.status === "pending"
                      ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
                      : "bg-green-500/20 text-green-300 border-green-500/30"
                  }
                >
                  {lead.status === "pending" ? (
                    <AlertCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm text-gray-400 font-mono">Budget</p>
                <p className="text-white">{lead.budget}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 font-mono">Location</p>
                <p className="text-white">{lead.address}</p>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-400 font-mono">
                Problem Description
              </p>
              <p className="text-white">{lead.problem}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-0 items-center justify-between">
              <div className="flex items-center text-sm text-gray-400 font-mono">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(lead.createdAt)}
              </div>
              <div className="flex space-x-1  md:space-x-2">
                {lead.status === "pending" && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(lead._id, "resolved")}
                    className="bg-green-600 hover:bg-green-700 text-black"
                  >
                    Mark Resolved
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 bg-[#0a0a0a] text-white hover:bg-gray-700 hover:text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4">
        <Button
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
          variant="outline"
          className="flex items-center p-1 bg-[#c7361c] border-[#333] text-white hover:bg-[#ca6b58] hover:border-[#ff4d00] hover:text-white md:px-2"
        >
          <ArrowLeft />
        </Button>

        <div className="flex items-center space-x-1 md:space-x-2">
          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => {
              let pageNum: number;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={pagination.page === pageNum ? "outline" : "default"}
                  onClick={() => handlePageChange(pageNum)}
                  className="flex items-center p-2 md:p-4 text-black "
                >
                  {pageNum}
                </Button>
              );
            }
          )}

          {pagination.totalPages > 5 &&
            pagination.page < pagination.totalPages - 2 && (
              <span className="px-2 text-white">...</span>
            )}

          {pagination.totalPages > 5 &&
            pagination.page < pagination.totalPages - 2 && (
              <Button
                variant={
                  pagination.page === pagination.totalPages
                    ? "default"
                    : "outline"
                }
                className="flex items-center p-2 md:p-4 text-black "
                onClick={() => handlePageChange(pagination.totalPages)}
              >
                {pagination.totalPages}
              </Button>
            )}
        </div>

        <Button
          disabled={pagination.page === pagination.totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
          variant="outline"
          className="flex items-center p-1 bg-[#c7361c] border-[#333] text-white hover:bg-[#ca6b58] hover:border-[#ff4d00] hover:text-white md:px-2"
        >
          <ArrowRight />
        </Button>
      </div>

      {/* Pagination info */}
      <div className="text-center text-sm text-gray-500">
        Showing {(pagination.page - 1) * pagination.limit + 1} -{" "}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
        {pagination.total} leads
      </div>
    </div>
  );
}
