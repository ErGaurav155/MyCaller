"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "lucide-react";

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

  // Mock data - replace with real API calls
  useEffect(() => {
    // Simulate loading data
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
  }, []);

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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0A0A0A] to-[#0A0A0A]/95 pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">CallAI Pro Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#0a0a0a]/60 border border-gray-800">
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

          <Card className="bg-[#0a0a0a]/60 border border-gray-800">
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

          <Card className="bg-[#0a0a0a]/60 border border-gray-800">
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

          <Card className="bg-[#0a0a0a]/60 border border-gray-800">
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
        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="bg-[#0a0a0a]/60 border border-gray-800">
            <TabsTrigger
              value="leads"
              className="data-[state=active]:bg-gray-800"
            >
              Leads
            </TabsTrigger>
            <TabsTrigger
              value="numbers"
              className="data-[state=active]:bg-gray-800"
            >
              Twilio Numbers
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="data-[state=active]:bg-gray-800"
            >
              Question Templates
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gray-800"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-6">
            <Card className="bg-[#0a0a0a]/60 border border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
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
              <CardContent>
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

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-400 font-mono">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(lead.createdAt)}
                        </div>
                        <div className="flex space-x-2">
                          {lead.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStatusChange(lead.id, "resolved")
                              }
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Mark Resolved
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-white hover:bg-gray-800"
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
            <Card className="bg-[#0a0a0a]/60 border border-gray-800">
              <CardHeader>
                <CardTitle>Your Twilio Numbers</CardTitle>
                <CardDescription className="text-gray-400 font-mono">
                  Manage your AI-powered phone numbers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {twilioNumbers.map((number) => (
                    <div
                      key={number.id}
                      className="border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
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
                          <div className="mt-2 flex items-center space-x-2">
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
                                  className="w-48 bg-gray-800 border-gray-700"
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
                                  className="border-gray-600 text-white hover:bg-gray-800"
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
            <Card className="bg-[#0a0a0a]/60 border border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  AI Question Templates
                  <Dialog
                    open={isTemplateDialogOpen}
                    onOpenChange={setIsTemplateDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-[#0a0a0a] border-gray-800">
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
                                className="bg-green-600 hover:bg-green-700"
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
                              className="border-gray-600 text-white hover:bg-gray-800"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={saveTemplate}
                              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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
              <CardContent>
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
                            className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#0a0a0a]/60 border border-gray-800">
                <CardHeader>
                  <CardTitle>Monthly Call Stats</CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Track your call volume and lead generation
                  </CardDescription>
                </CardHeader>
                <CardContent>
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

              <Card className="bg-[#0a0a0a]/60 border border-gray-800">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Key performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
    </div>
  );
}
