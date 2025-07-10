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
export interface QuestionnaireItem {
  question: string;
  answer: string;
  type: "name" | "email" | "phone" | "address" | "budget" | "problem";
  required: boolean;
}
interface Lead {
  _id: string;
  name: string;
  phone: string;
  email: string;
  budget: string;
  problem: string;
  address: string;
  status: "pending" | "resolved";
  source: string;
  callDuration?: number;
  createdAt: string;
  recordingUrl?: string;
  twilioNumber: string;
  resolvedAt?: string;
  notes?: string;
  questionnaire: QuestionnaireItem[]; // New field
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
      if (response) {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
          fetchLeads(newPage);
        }
      }
    },
    [fetchLeads, pagination.totalPages, response]
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
          twilioNumber: "+15551234567",
          phone: "+15559876543",
          name: "John Smith",
          email: "john.smith@example.com",
          address: "123 Main St, New York, NY 10001",
          budget: "$10,000 - $15,000",
          problem: "Need help with kitchen remodeling",
          status: "pending",
          createdAt: "2025-03-15T10:30:00Z",
          source: "ai-call",
          callDuration: 245,
          recordingUrl: "https://api.twilio.com/recordings/rec123",
          questionnaire: [
            {
              question: "May I please have your name?",
              answer: "John Smith",
              type: "name",
              required: true,
            },
            {
              question: "Could you please provide your email address?",
              answer: "john.smith@example.com",
              type: "email",
              required: true,
            },
            {
              question: "What is your budget range for this project?",
              answer: "$10,000 - $15,000",
              type: "budget",
              required: false,
            },
            {
              question: "Could you please describe the problem?",
              answer: "Need help with kitchen remodeling",
              type: "problem",
              required: true,
            },
          ],
        },
        {
          _id: "2",
          twilioNumber: "+15551234567",
          phone: "+15557654321",
          name: "Sarah Johnson",
          email: "sarah.j@example.com",
          address: "456 Oak Ave, Los Angeles, CA 90001",
          budget: "$5,000 - $7,000",
          problem: "Bathroom leak repair needed",
          status: "resolved",
          createdAt: "2025-02-28T14:15:00Z",
          resolvedAt: "2025-03-05T09:45:00Z",
          notes: "Customer approved estimate, scheduled for March 15",
          source: "manual",
          questionnaire: [
            {
              question: "May I please have your name?",
              answer: "Sarah Johnson",
              type: "name",
              required: true,
            },
            {
              question: "Could you please provide your email address?",
              answer: "sarah.j@example.com",
              type: "email",
              required: true,
            },
            {
              question: "And, where do you live?",
              answer: "456 Oak Ave, Los Angeles, CA 90001",
              type: "address",
              required: true,
            },
            {
              question: "What is your budget range for this project?",
              answer: "$5,000 - $7,000",
              type: "budget",
              required: false,
            },
          ],
        },
        {
          _id: "3",
          twilioNumber: "+15559876543",
          phone: "+15554321678",
          name: "Michael Brown",
          email: "michael.b@example.com",
          address: "789 Pine Rd, Chicago, IL 60601",
          budget: "Not sure",
          problem: "Whole house rewiring needed",
          status: "pending",
          createdAt: "2025-03-20T16:45:00Z",
          source: "ai-call",
          callDuration: 382,
          recordingUrl: "https://api.twilio.com/recordings/rec456",
          questionnaire: [
            {
              question: "May I please have your name?",
              answer: "Michael Brown",
              type: "name",
              required: true,
            },
            {
              question: "Could you please provide your email address?",
              answer: "michael.b@example.com",
              type: "email",
              required: true,
            },
            {
              question: "What is your budget range for this project?",
              answer: "Not sure",
              type: "budget",
              required: false,
            },
            {
              question: "Could you please describe the problem?",
              answer: "Whole house rewiring needed",
              type: "problem",
              required: true,
            },
          ],
        },
        {
          _id: "4",
          twilioNumber: "+15559876543",
          phone: "+15558765432",
          name: "Emily Wilson",
          email: "emily.w@example.com",
          address: "321 Elm St, Houston, TX 77001",
          budget: "$20,000+",
          problem: "New home construction consultation",
          status: "resolved",
          createdAt: "2025-01-10T11:20:00Z",
          resolvedAt: "2025-01-12T15:10:00Z",
          source: "manual",
          questionnaire: [
            {
              question: "May I please have your name?",
              answer: "Emily Wilson",
              type: "name",
              required: true,
            },
            {
              question: "And, where do you live?",
              answer: "321 Elm St, Houston, TX 77001",
              type: "address",
              required: true,
            },
            {
              question: "What is your budget range for this project?",
              answer: "$20,000+",
              type: "budget",
              required: false,
            },
          ],
        },
        {
          _id: "5",
          twilioNumber: "+15550123456",
          phone: "+15551234567",
          name: "David Lee",
          email: "david.lee@example.com",
          address: "654 Maple Dr, Phoenix, AZ 85001",
          budget: "$8,000 - $10,000",
          problem: "Roof repair after storm damage",
          status: "resolved",
          createdAt: "2025-03-01T09:00:00Z",
          resolvedAt: "2025-03-10T13:30:00Z",
          notes: "Insurance claim processed, work completed March 8",
          source: "ai-call",
          callDuration: 510,
          recordingUrl: "https://api.twilio.com/recordings/rec789",
          questionnaire: [
            {
              question: "May I please have your name?",
              answer: "David Lee",
              type: "name",
              required: true,
            },
            {
              question: "Could you please provide your email address?",
              answer: "david.lee@example.com",
              type: "email",
              required: true,
            },
            {
              question: "And, where do you live?",
              answer: "654 Maple Dr, Phoenix, AZ 85001",
              type: "address",
              required: true,
            },
            {
              question: "Could you please describe the problem?",
              answer: "Roof repair after storm damage",
              type: "problem",
              required: true,
            },
          ],
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
            className="border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors bg-[#0a0a0a]"
          >
            {/* Header with name and status */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{lead.name}</h3>
                <p className="text-sm text-gray-400 font-mono">
                  {lead.phone} • {lead.email}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 space-x-1 md:space-x-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    lead.status === "pending"
                      ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                      : lead.status === "resolved"
                      ? "bg-green-500/20 text-green-300 border border-green-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}
                >
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </span>
                <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {lead.source === "ai-call" ? "AI Call" : "Manual"}
                </span>
              </div>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm text-gray-400 font-mono">Budget</p>
                <p className="text-white">{lead.budget}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 font-mono">Location</p>
                <p className="text-white">{lead.address}</p>
              </div>
              {lead.callDuration && (
                <div>
                  <p className="text-sm text-gray-400 font-mono">
                    Call Duration
                  </p>
                  <p className="text-white">
                    {Math.floor(lead.callDuration / 60)}m{" "}
                    {lead.callDuration % 60}s
                  </p>
                </div>
              )}
              {lead.recordingUrl && (
                <div>
                  <p className="text-sm text-gray-400 font-mono">Recording</p>
                  <a
                    href={lead.recordingUrl}
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300 text-sm font-mono"
                  >
                    Listen
                  </a>
                </div>
              )}
            </div>

            {/* Problem description */}
            <div className="mb-3">
              <p className="text-sm text-gray-400 font-mono">
                Problem Description
              </p>
              <p className="text-white">{lead.problem}</p>
            </div>

            {/* Questionnaire */}
            {lead.questionnaire.length > 0 && (
              <div className="mb-1 md:mb-3">
                <p className="text-sm text-gray-400 font-mono mb-2">
                  Questionnaire
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-3">
                  {lead.questionnaire.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-800 rounded p-1 md:p-3"
                    >
                      <p className="text-gray-400 text-sm mb-1">
                        {item.question}
                      </p>
                      <p className="text-white">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {lead.notes && (
              <div className="mb-3">
                <p className="text-sm text-gray-400 font-mono">Notes</p>
                <p className="text-white">{lead.notes}</p>
              </div>
            )}

            {/* Footer with date and actions */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-0 items-center justify-between">
              <div className="flex items-center text-sm text-gray-400 font-mono">
                <span className="mr-1">📅</span>
                {new Date(lead.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {lead.resolvedAt && (
                  <span className="ml-3">
                    Resolved:{" "}
                    {new Date(lead.resolvedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 ">
                {lead.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(lead._id, "resolved")}
                      className="flex-1 p-2 md:px-3 py-1.5 text-sm rounded bg-green-600 hover:bg-green-700 text-black"
                    >
                      Resolved
                    </button>
                    <button
                      onClick={() => handleStatusChange(lead._id, "pending")}
                      className="flex-1 p-2 md:px-3 py-1.5 text-sm rounded bg-red-600 hover:bg-red-700 text-black"
                    >
                      Pending
                    </button>
                  </>
                )}
                <button className="w-auto  p-2 md:px-3 py-1.5 text-sm rounded border border-gray-600 bg-[#0a0a0a] text-white hover:bg-gray-700 hover:text-white">
                  <span className="mr-1 inline-block">💬</span>WhatsApp
                </button>
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
