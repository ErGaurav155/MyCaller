"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Phone,
  Users,
  TrendingUp,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  BarChart3,
  PhoneCall,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { countryCodes } from "@/constant";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import OTPVerification from "@/components/shared/OTPVerification";
import { getUserById } from "@/lib/action/user.actions";
import {
  cancelRazorPaySubscription,
  getSubscription,
  getSubscriptionInfo,
} from "@/lib/action/subscription.action";
import { toast } from "@/hooks/use-toast";

interface Lead {
  id: string;
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

interface CallStats {
  totalCalls: number;
  monthlyStats: {
    month: string;
    calls: number;
    leads: number;
  }[];
}

interface TwilioNumber {
  id: string;
  number: string;
  isActive: boolean;
  totalCalls: number;
  totalLeads: number;
  forwardToNumber: string;
}

interface Question {
  id: string;
  question: string;
  order: number;
  required: boolean;
  type: "text" | "email" | "phone" | "number";
}

interface QuestionTemplate {
  greeting: string;
  questions: Question[];
  closingMessage: string;
}
interface Subscription {
  productId: string;
  userId: string;
  subscriptionId: string;
  subscriptionStatus: string;
}
const phoneFormSchema = z.object({
  MobileNumber: z
    .string()
    .min(10, "MOBILE number is required")
    .regex(/^\d+$/, "invalid number"),
});
type PhoneFormData = z.infer<typeof phoneFormSchema>;
export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [callStats, setCallStats] = useState<CallStats>({
    totalCalls: 0,
    monthlyStats: [],
  });
  const [twilioNumbers, setTwilioNumbers] = useState<TwilioNumber[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<QuestionTemplate | null>(null);
  const [editingNumber, setEditingNumber] = useState<string | null>(null);
  const [newForwardNumber, setNewForwardNumber] = useState<string>("");
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [step, setStep] = useState<"phone" | "otp" | "payment">("payment");
  const [open, setOpen] = useState(false);
  const [takenSub, setTakenSub] = useState(false);
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);
  const [phone, setPhone] = useState("");
  const [buyer, setBuyer] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImmediateSubmitting, setIsImmediateSubmitting] = useState(false);
  const [mode, setMode] = useState<"Immediate" | "End-of-term">("End-of-term");
  const [callerSubscription, setCallerSubscription] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      productId: "",
      userId: "",
      subscriptionId: "",
      subscriptionStatus: "",
    },
  ]);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    string | null
  >("");
  const {
    handleSubmit: handlePhoneSubmit,
    register: registerPhone,
    formState: { errors: phoneErrors },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneFormSchema),
  });
  const handlePhoneSubmission = async (data: PhoneFormData) => {
    setIsOtpSubmitting(true);
    try {
      const fullPhoneNumber = `${countryCode}${data.MobileNumber}`;

      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullPhoneNumber }),
      });
      if (res.ok) {
        setPhone(fullPhoneNumber);
        setStep("otp");
      } else {
        console.error("Failed to send OTP:", res.statusText);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsOtpSubmitting(false);
    }
  };
  const { userId } = useAuth();
  const router = useRouter();
  const handleOTPVerified = () => {
    setStep("payment");
    router.refresh();
  };
  useEffect(() => {
    async function fetchSubscriptions() {
      if (!userId) {
        router.push("/sign-in");
        return;
      }

      try {
        const user = await getUserById(userId);
        setBuyer(user._id);
        const response = await getSubscriptionInfo(user._id);
        if (!response) {
          setCallerSubscription(false);
        } else {
          setCallerSubscription(true);
          setSubscriptions(
            response.map((sub: any) => ({
              productId: sub.productId,
              userId: sub.userId,
              subscriptionId: sub.subscriptionId,
              subscriptionStatus: sub.subscriptionStatus,
            })) || []
          );
        }
      } catch (error: any) {
        console.error("Error fetching subscriptions:", error.message);
      }
    }

    fetchSubscriptions();
  }, [userId, router]);
  const handleCancelSubscription = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedSubscriptionId) return;

    const formData = new FormData(event.currentTarget);
    const reason = formData.get("reason") as string;

    try {
      if (mode === "Immediate") {
        setIsSubmitting(true);
      } else {
        setIsImmediateSubmitting(true);
      }
      const getSub = await getSubscription(selectedSubscriptionId);
      if (!getSub) {
        router.push("/");
        return;
      }

      const result = await cancelRazorPaySubscription(
        selectedSubscriptionId,
        reason,
        mode
      );

      if (result.success) {
        toast({
          title: "Subscription cancelled successfully!",
          description: result.message,
          duration: 3000,
          className: "success-toast",
        });
        router.refresh();
        setOpen(false);
      } else {
        toast({
          title: "Subscription cancelled Failed!",
          description: result.message,
          duration: 3000,
          className: "error-toast",
        });
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
    } finally {
      setIsSubmitting(false);
      setIsImmediateSubmitting(false);
    }
  };
  // Mock data - replace with real API calls
  // useEffect(() => {
  //   // Simulate loading data
  //   setLeads([
  //     {
  //       id: "1",
  //       name: "Rahul Sharma",
  //       phone: "+91 98765 43210",
  //       email: "rahul@example.com",
  //       budget: "₹50,000 - ₹1,00,000",
  //       problem: "Need digital marketing services for restaurant",
  //       address: "Mumbai, Maharashtra",
  //       status: "pending",
  //       createdAt: "2025-01-08T10:30:00Z",
  //       twilioNumber: "+1 234 567 8901",
  //     },
  //     {
  //       id: "2",
  //       name: "Priya Patel",
  //       phone: "+91 87654 32109",
  //       email: "priya@example.com",
  //       budget: "₹25,000 - ₹50,000",
  //       problem: "Website development for small business",
  //       address: "Ahmedabad, Gujarat",
  //       status: "resolved",
  //       createdAt: "2025-01-07T14:15:00Z",
  //       twilioNumber: "+1 234 567 8901",
  //     },
  //     {
  //       id: "3",
  //       name: "Amit Kumar",
  //       phone: "+91 76543 21098",
  //       email: "amit@example.com",
  //       budget: "₹1,00,000+",
  //       problem: "Complete IT infrastructure setup",
  //       address: "Delhi, India",
  //       status: "pending",
  //       createdAt: "2025-01-06T09:45:00Z",
  //       twilioNumber: "+1 234 567 8901",
  //     },
  //   ]);

  //   setCallStats({
  //     totalCalls: 156,
  //     monthlyStats: [
  //       { month: "Dec 2024", calls: 45, leads: 32 },
  //       { month: "Jan 2025", calls: 67, leads: 43 },
  //       { month: "Feb 2025", calls: 44, leads: 28 },
  //     ],
  //   });

  //   setTwilioNumbers([
  //     {
  //       id: "1",
  //       number: "+1 234 567 8901",
  //       isActive: true,
  //       totalCalls: 89,
  //       totalLeads: 56,
  //       forwardToNumber: "+91 98765 43210",
  //     },
  //   ]);

  //   // Default template
  //   setSelectedTemplate({
  //     greeting:
  //       "Hello! Thank you for calling. I'm an AI assistant and I'd be happy to help you today.",
  //     questions: [
  //       {
  //         id: "1",
  //         question: "May I please have your name?",
  //         order: 1,
  //         required: true,
  //         type: "text",
  //       },
  //       {
  //         id: "2",
  //         question: "Could you please provide your email address?",
  //         order: 2,
  //         required: true,
  //         type: "email",
  //       },
  //       {
  //         id: "3",
  //         question: "What is your budget range for this project?",
  //         order: 3,
  //         required: false,
  //         type: "text",
  //       },
  //       {
  //         id: "4",
  //         question:
  //           "Could you please describe the problem or service you need help with?",
  //         order: 4,
  //         required: true,
  //         type: "text",
  //       },
  //     ],
  //     closingMessage:
  //       "Thank you for your time. I have recorded all your information. Someone from our team will contact you within 24 hours. Have a great day!",
  //   });
  // }, []);
  useEffect(() => {
    if (!userId) return;
    const isSubscribed = getSubscriptionInfo(userId);
    if (!isSubscribed) {
      setTakenSub(false);
      setLeads([
        {
          id: "1",
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
          id: "2",
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
          id: "3",
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

      setCallStats({
        totalCalls: 156,
        monthlyStats: [
          { month: "Dec 2024", calls: 45, leads: 32 },
          { month: "Jan 2025", calls: 67, leads: 43 },
          { month: "Feb 2025", calls: 44, leads: 28 },
        ],
      });

      setTwilioNumbers([
        {
          id: "1",
          number: "+1 234 567 8901",
          isActive: true,
          totalCalls: 89,
          totalLeads: 56,
          forwardToNumber: "+91 98765 43210",
        },
      ]);

      // Default template
      setSelectedTemplate({
        greeting:
          "Hello! Thank you for calling. I'm an AI assistant and I'd be happy to help you today.",
        questions: [
          {
            id: "1",
            question: "May I please have your name?",
            order: 1,
            required: true,
            type: "text",
          },
          {
            id: "2",
            question: "Could you please provide your email address?",
            order: 2,
            required: true,
            type: "email",
          },
          {
            id: "3",
            question: "What is your budget range for this project?",
            order: 3,
            required: false,
            type: "text",
          },
          {
            id: "4",
            question:
              "Could you please describe the problem or service you need help with?",
            order: 4,
            required: true,
            type: "text",
          },
        ],
        closingMessage:
          "Thank you for your time. I have recorded all your information. Someone from our team will contact you within 24 hours. Have a great day!",
      });
    } else {
      const fetchData = async () => {
        try {
          // Fetch leads
          const leadsRes = await fetch(`/api/leads?userId=${userId}`);
          const leadsData = await leadsRes.json();
          setLeads(
            leadsData.leads.map((lead: any) => ({
              ...lead,
              phone: lead.callerNumber,
              budget: lead.budget || "Not specified",
              address: lead.address || "Not specified",
            }))
          );

          // Fetch call stats
          const statsRes = await fetch(`/api/stats?userId=${userId}`);
          const statsData = await statsRes.json();
          setCallStats(statsData.stats);

          // Fetch Twilio numbers
          const twilioRes = await fetch(`/api/twilio?userId=${userId}`);
          const twilioData = await twilioRes.json();
          setTwilioNumbers(
            twilioData.twilioNumbers.map((num: any) => ({
              ...num,
              number: num.phoneNumber,
            }))
          );

          // Fetch template
          if (twilioData.twilioNumbers.length > 0) {
            const templateRes = await fetch(
              `/api/template?userId=${userId}&twilioNumber=${twilioData.twilioNumbers[0].phoneNumber}`
            );
            const templateData = await templateRes.json();
            setSelectedTemplate(templateData.template);
          }
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      };
      setTakenSub(true);
      fetchData();
    }
  }, [userId, takenSub]);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusChange = (
    leadId: string,
    newStatus: "pending" | "resolved"
  ) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
  };

  const handleUpdateForwardNumber = (numberId: string) => {
    setTwilioNumbers((prev) =>
      prev.map((num) =>
        num.id === numberId
          ? { ...num, forwardToNumber: newForwardNumber }
          : num
      )
    );
    setStep("phone");

    setEditingNumber(null);
    setNewForwardNumber("");
  };

  const handleTemplateChange = (field: keyof QuestionTemplate, value: any) => {
    if (selectedTemplate) {
      setSelectedTemplate((prev) => ({
        ...prev!,
        [field]: value,
      }));
    }
  };

  const addQuestion = () => {
    if (selectedTemplate) {
      const newQuestion: Question = {
        id: Date.now().toString(),
        question: "",
        order: selectedTemplate.questions.length + 1,
        required: false,
        type: "text",
      };
      setSelectedTemplate((prev) => ({
        ...prev!,
        questions: [...prev!.questions, newQuestion],
      }));
    }
  };

  const updateQuestion = (
    questionId: string,
    field: keyof Question,
    value: any
  ) => {
    if (selectedTemplate) {
      setSelectedTemplate((prev) => ({
        ...prev!,
        questions: prev!.questions.map((q) =>
          q.id === questionId ? { ...q, [field]: value } : q
        ),
      }));
    }
  };

  const removeQuestion = (questionId: string) => {
    if (selectedTemplate) {
      setSelectedTemplate((prev) => ({
        ...prev!,
        questions: prev!.questions.filter((q) => q.id !== questionId),
      }));
    }
  };

  const saveTemplate = () => {
    // Here you would save to the API
    console.log("Saving template:", selectedTemplate);
    setIsTemplateDialogOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#0a0a0a]/80 bg-gradient-to-br from-[#0A0A0A] via-[#0A0A0A]/90 to-[#0A0A0A]/70 pointer-events-none"></div>
      <div className="   text-white">
        {/* Animated Background */}

        {/* Header */}
        <header className="relative z-10 border-b border-gray-800">
          <div className="bg-transparent backdrop-blur-sm border-b border-[#333]">
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
        </header>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {!takenSub && (
          <div>
            <h1 className="text-xl font-semibold text-white">
              Demo Data For Unsubscribed Users
            </h1>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 ">
          <Card className="bg-[#0a0a0a]/60 border border-gray-800 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-mono">Total Calls</p>
                  <p className="text-3xl font-bold">{callStats.totalCalls}</p>
                </div>
                <PhoneCall className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0a0a0a]/60 border border-gray-800 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-mono">Total Leads</p>
                  <p className="text-3xl font-bold">{leads.length}</p>
                </div>
                <Users className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0a0a0a]/60 border border-gray-800 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-mono">Pending</p>
                  <p className="text-3xl font-bold">
                    {leads.filter((l) => l.status === "pending").length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0a0a0a]/60 border border-gray-800 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-mono">Resolved</p>
                  <p className="text-3xl font-bold">
                    {leads.filter((l) => l.status === "resolved").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="leads" className="space-y-6 ">
          <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between ">
            <TabsList className="bg-[#0a0a0a]/60 border min-h-max flex flex-wrap max-w-max md:gap-3 text-white border-gray-800">
              <TabsTrigger
                value="leads"
                className="data-[state=active]:bg-[#2d8a55]"
              >
                Leads
              </TabsTrigger>
              <TabsTrigger
                value="numbers"
                className="data-[state=active]:bg-[#2d8a55]"
              >
                Numbers
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="data-[state=active]:bg-[#2d8a55]"
              >
                Templates
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-[#2d8a55]"
              >
                Analytics
              </TabsTrigger>
            </TabsList>
            {callerSubscription ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedSubscriptionId(subscriptions[0].subscriptionId);
                  setOpen(true);
                }}
                className="flex items-center p-1 bg-[#c7361c] border-[#333] text-white hover:bg-[#ca6b58] hover:border-[#ff4d00] hover:text-white px-2"
              >
                Cancel Subscription
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  router.push("/pricing");
                }}
                className="flex items-center p-1 bg-[#c7361c] border-[#333] text-white hover:bg-[#ca6b58] hover:border-[#ff4d00] hover:text-white px-2"
              >
                Take Subscription
              </Button>
            )}
          </div>
          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-6">
            <Card className="bg-[#0a0a0a]/60 border text-white border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center  justify-between">
                  Recent Leads
                  <Badge
                    variant="secondary"
                    className="bg-gray-800 text-gray-300"
                  >
                    {leads.length} Total
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-400 font-mono">
                  Manage and track your AI-generated leads
                </CardDescription>
              </CardHeader>
              <CardContent className="p-1 md:p-2">
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
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
                              lead.status === "pending"
                                ? "destructive"
                                : "default"
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
                            {lead.status.charAt(0).toUpperCase() +
                              lead.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-400 font-mono">
                            Budget
                          </p>
                          <p className="text-white">{lead.budget}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 font-mono">
                            Location
                          </p>
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
                              onClick={() =>
                                handleStatusChange(lead.id, "resolved")
                              }
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Twilio Numbers Tab */}
          <TabsContent value="numbers" className="space-y-6">
            <Card className="bg-[#0a0a0a]/60 border border-gray-800 text-white">
              <CardHeader>
                <CardTitle>Your Twilio Numbers</CardTitle>
                <CardDescription className="text-gray-400 font-mono">
                  Manage your AI-powered phone numbers
                </CardDescription>
              </CardHeader>
              <CardContent className="p-1 md:p-2">
                <div className="space-y-4">
                  {twilioNumbers.map((number) => (
                    <div
                      key={number.id}
                      className="border border-gray-800 rounded-lg p-1 md:p-4 hover:border-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg font-mono">
                            {number.number}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-400">
                              {number.totalCalls} calls • {number.totalLeads}{" "}
                              leads
                            </span>
                            <Badge
                              className={
                                number.isActive
                                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                                  : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                              }
                            >
                              {number.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="mt-2 flex flex-col sm:flex-row items-center md:space-x-2">
                            <span className="text-sm text-gray-400 font-mono">
                              Forward to:
                            </span>
                            {editingNumber === number.id ? (
                              <div className="flex items-center space-x-2">
                                <Input
                                  value={newForwardNumber}
                                  onChange={(e) =>
                                    setNewForwardNumber(e.target.value)
                                  }
                                  placeholder="Enter phone number"
                                  className="w-40 md:w-48 bg-gray-800 border-gray-700"
                                />
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateForwardNumber(number.id)
                                  }
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingNumber(null);
                                    setNewForwardNumber("");
                                  }}
                                  className="border-gray-600 text-white bg-[#0a0a0a] hover:bg-gray-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span className="text-white font-mono">
                                  {number.forwardToNumber}
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingNumber(number.id);
                                    setNewForwardNumber(number.forwardToNumber);
                                  }}
                                  className="text-blue-400 hover:bg-gray-800"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Question Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card className="bg-[#0a0a0a]/60 border border-gray-800 text-white">
              <CardHeader className="p-2 md:p-4">
                <CardTitle className="flex flex-col gap-3  items-center justify-between">
                  <h1 className=""> AI Question Templates</h1>
                  <Dialog
                    open={isTemplateDialogOpen}
                    onOpenChange={setIsTemplateDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-black">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-[#0a0a0a] border-pink-800 no-scrollbar p-3 md:p-4">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Configure AI Questions
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Customize how your AI assistant greets callers and
                          what questions it asks
                        </DialogDescription>
                      </DialogHeader>

                      {selectedTemplate && (
                        <div className="space-y-6">
                          {/* Greeting */}
                          <div>
                            <Label htmlFor="greeting" className="text-white">
                              Greeting Message
                            </Label>
                            <Textarea
                              id="greeting"
                              value={selectedTemplate.greeting}
                              onChange={(e) =>
                                handleTemplateChange("greeting", e.target.value)
                              }
                              className="mt-2 bg-gray-800 border-gray-700 text-white"
                              rows={3}
                            />
                          </div>

                          {/* Questions */}
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <Label className="text-white">Questions</Label>
                              <Button
                                onClick={addQuestion}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-black"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Question
                              </Button>
                            </div>

                            <div className="space-y-4">
                              {selectedTemplate.questions.map(
                                (question, index) => (
                                  <div
                                    key={question.id}
                                    className="border border-gray-700 rounded-lg p-4"
                                  >
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-sm text-gray-400 font-mono">
                                        Question {index + 1}
                                      </span>
                                      <Button
                                        onClick={() =>
                                          removeQuestion(question.id)
                                        }
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-400 hover:bg-red-500/20"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="md:col-span-2">
                                        <Label className="text-white">
                                          Question Text
                                        </Label>
                                        <Input
                                          value={question.question}
                                          onChange={(e) =>
                                            updateQuestion(
                                              question.id,
                                              "question",
                                              e.target.value
                                            )
                                          }
                                          className="mt-1 bg-gray-800 border-gray-700 text-white"
                                          placeholder="Enter your question"
                                        />
                                      </div>

                                      <div>
                                        <Label className="text-white">
                                          Type
                                        </Label>
                                        <select
                                          value={question.type}
                                          onChange={(e) =>
                                            updateQuestion(
                                              question.id,
                                              "type",
                                              e.target.value
                                            )
                                          }
                                          className="mt-1 w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                                        >
                                          <option value="text">Text</option>
                                          <option value="email">Email</option>
                                          <option value="phone">Phone</option>
                                          <option value="number">Number</option>
                                        </select>
                                      </div>

                                      <div className="flex items-center space-x-2 mt-6">
                                        <input
                                          type="checkbox"
                                          id={`required-${question.id}`}
                                          checked={question.required}
                                          onChange={(e) =>
                                            updateQuestion(
                                              question.id,
                                              "required",
                                              e.target.checked
                                            )
                                          }
                                          className="rounded border-gray-700 bg-gray-800"
                                        />
                                        <Label
                                          htmlFor={`required-${question.id}`}
                                          className="text-white"
                                        >
                                          Required
                                        </Label>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {/* Closing Message */}
                          <div>
                            <Label htmlFor="closing" className="text-white">
                              Closing Message
                            </Label>
                            <Textarea
                              id="closing"
                              value={selectedTemplate.closingMessage}
                              onChange={(e) =>
                                handleTemplateChange(
                                  "closingMessage",
                                  e.target.value
                                )
                              }
                              className="mt-2 bg-gray-800 border-gray-700 text-white"
                              rows={3}
                            />
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsTemplateDialogOpen(false)}
                              className="border-gray-600 text-white hover:text-white hover:bg-gray-800 bg-[#0a0a0a]"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={saveTemplate}
                              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-black"
                            >
                              Save Template
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardTitle>
                <CardDescription className="text-gray-400 font-mono">
                  Configure how your AI assistant interacts with callers
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                {selectedTemplate && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-white mb-2">
                        Current Greeting
                      </h3>
                      <p className="text-gray-300 bg-gray-800/50 p-3 rounded-lg font-mono text-sm">
                        {selectedTemplate.greeting}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-white mb-2">
                        Questions ({selectedTemplate.questions.length})
                      </h3>
                      <div className="space-y-2">
                        {selectedTemplate.questions.map((question, index) => (
                          <div
                            key={question.id}
                            className="flex items-center justify-between flex-col md:flex-row gap-3 md:gap-0 bg-gray-800/50 p-3 rounded-lg"
                          >
                            <div>
                              <span className="text-sm text-gray-400 font-mono">
                                Q{index + 1}:
                              </span>
                              <span className="text-white ml-2">
                                {question.question}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className="border-gray-600 text-gray-300"
                              >
                                {question.type}
                              </Badge>
                              {question.required && (
                                <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                                  Required
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-white mb-2">
                        Closing Message
                      </h3>
                      <p className="text-gray-300 bg-gray-800/50 p-3 rounded-lg font-mono text-sm">
                        {selectedTemplate.closingMessage}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
              <Card className="bg-[#0a0a0a]/60 border border-gray-800 text-white">
                <CardHeader className="p-2">
                  <CardTitle>Monthly Call Stats</CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Track your call volume and lead generation
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="space-y-4">
                    {callStats.monthlyStats.map((stat, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-gray-800 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">{stat.month}</p>
                          <p className="text-sm text-gray-400 font-mono">
                            {stat.calls} calls • {stat.leads} leads
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {Math.round((stat.leads / stat.calls) * 100)}%
                          </p>
                          <p className="text-sm text-gray-400">Conversion</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0a0a0a]/60 border border-gray-800 text-white">
                <CardHeader className="p-2">
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Key performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-mono">
                          Lead Conversion Rate
                        </span>
                        <span className="text-sm font-bold">64%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
                          style={{ width: "64%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-mono">
                          Average Response Time
                        </span>
                        <span className="text-sm font-bold">2.3s</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-mono">
                          Customer Satisfaction
                        </span>
                        <span className="text-sm font-bold">4.8/5</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full"
                          style={{ width: "96%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className=" p-8 rounded-xl max-w-md w-full bg-[#0a0a0a]/90 backdrop-blur-lg border border-[#333] ">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF2E9F] to-[#B026FF]">
                Cancel Subscription
              </h2>
              <XMarkIcon
                onClick={() => setOpen(false)}
                className="text-gray-400 h-10 w-10 cursor-pointer hover:text-white"
              />
            </div>
            <form onSubmit={handleCancelSubscription} className="space-y-6">
              <label className="block text-lg font-semibold text-gray-200">
                Please Provide Reason
              </label>
              <textarea
                name="reason"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#B026FF]"
                placeholder="Cancellation reason"
                required
              />
              <div className="flex justify-center gap-4">
                <button
                  type="submit"
                  onClick={() => setMode("Immediate")}
                  className="px-6 py-2 bg-gradient-to-r from-[#FF2E9F] to-[#B026FF] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  {isSubmitting ? "Cancelling..." : "Immediate"}
                </button>
                <button
                  type="submit"
                  onClick={() => setMode("End-of-term")}
                  className="px-6 py-2 bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  {isImmediateSubmitting ? "Cancelling..." : "End-of-term"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {step === "phone" && (
        <AlertDialog defaultOpen>
          <AlertDialogContent className="bg-[#0a0a0a]/90 backdrop-blur-lg border border-[#333] rounded-xl max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-pink-400">
                Enter Your Phone Number
              </AlertDialogTitle>
              <div className="flex justify-between items-center">
                <h3 className="p-16-semibold text-white text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#B026FF]">
                  ENTER YOUR NEW MOBILE NUMBER
                </h3>
                <AlertDialogCancel
                  onClick={() => {
                    setStep("payment");
                  }}
                  className="border-0 p-0 hover:bg-transparent text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="size-6 cursor-pointer" />
                </AlertDialogCancel>
              </div>
            </AlertDialogHeader>
            <form
              onSubmit={handlePhoneSubmit(handlePhoneSubmission)}
              className="space-y-6 mt-4"
            >
              <div className="w-full">
                <label
                  htmlFor="MobileNumber"
                  className="block text-lg font-semibold text-gray-200 mb-2"
                >
                  Enter Your New Phone Number
                </label>
                <div className="flex items-center justify-start w-full bg-[#1a1a1a]/50 backdrop-blur-sm border border-[#333] rounded-xl overflow-hidden">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-transparent text-white p-3 border-r border-[#333] focus:outline-none focus:ring-2 focus:ring-[#00F0FF]"
                  >
                    {countryCodes.map((countryCode, index) => (
                      <option
                        key={index}
                        className="bg-[#1a1a1a] text-gray-300"
                        value={countryCode.code}
                      >
                        {countryCode.code}
                      </option>
                    ))}
                  </select>
                  <input
                    id="MobileNumber"
                    type="text"
                    {...registerPhone("MobileNumber")}
                    className="w-full bg-transparent py-3 px-4 text-white placeholder:text-gray-500 focus:outline-none"
                    placeholder="Phone number"
                  />
                </div>
                {phoneErrors.MobileNumber && (
                  <p className="text-red-400 text-sm mt-1">
                    {phoneErrors.MobileNumber.message}
                  </p>
                )}
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className={`w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-[#00F0FF] to-[#B026FF] hover:from-[#00F0FF]/90 hover:to-[#B026FF]/90 transition-all ${
                    isOtpSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={isOtpSubmitting}
                >
                  {isOtpSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                      Sending OTP...
                    </div>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>
            </form>

            <AlertDialogDescription className="p-4 text-center text-sm text-gray-400 border-t border-[#333] pt-4">
              <span className="text-[#00F0FF]">
                IT WILL HELP US TO PROVIDE BETTER SERVICES
              </span>
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {step === "otp" && (
        <OTPVerification
          phone={phone}
          onVerified={handleOTPVerified}
          buyerId={buyer}
        />
      )}
    </>
  );
}
