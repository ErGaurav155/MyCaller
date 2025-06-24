"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Copy, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  cancelRazorPaySubscription,
  getSubscription,
  getSubscriptionInfo,
} from "@/lib/action/subscription.action";
import { useAuth } from "@clerk/nextjs";
import { getUserById } from "@/lib/action/user.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { countryCodes } from "@/constant";
import OTPVerification from "@/components/shared/OTPVerification";
import { toast } from "@/hooks/use-toast";

interface PhoneNumberCardProps {
  twilioNumber: string;
  isActive: boolean;
  phoneNumber: string | undefined;
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

export default function PhoneNumberCard({
  twilioNumber,
  isActive,
  phoneNumber,
}: PhoneNumberCardProps) {
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<"phone" | "otp" | "payment">("payment");
  const [open, setOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    string | null
  >("");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      productId: "",
      userId: "",
      subscriptionId: "",
      subscriptionStatus: "",
    },
  ]);
  const [countryCode, setCountryCode] = useState("+1");
  const [mode, setMode] = useState<"Immediate" | "End-of-term">("End-of-term");
  const [phone, setPhone] = useState("");
  const [buyer, setBuyer] = useState("");
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImmediateSubmitting, setIsImmediateSubmitting] = useState(false);

  const { userId } = useAuth();
  const router = useRouter();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(twilioNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
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
        setUserPhone(user.phone);
        const response = await getSubscriptionInfo(user._id);

        setSubscriptions(
          response.map((sub: any) => ({
            productId: sub.productId,
            userId: sub.userId,
            subscriptionId: sub.subscriptionId,
            subscriptionStatus: sub.subscriptionStatus,
          })) || []
        );
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

  return (
    <>
      <Card className="bg-[#0a0a0a]/60 backdrop-blur-sm border border-[#00F0FF]/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Phone className="h-5 w-5 text-[#00F0FF]" />
            Your AI Assistant Number
            <Badge
              className={
                isActive
                  ? "bg-green-900/20 text-green-400 border-green-400/20"
                  : "bg-gray-900/20 text-gray-400 border-gray-400/20"
              }
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-[#0a0a0a]/80 backdrop-blur-sm rounded-lg border border-[#333]">
            <span className="text-2xl font-mono font-bold text-white">
              {twilioNumber ? (
                twilioNumber
              ) : (
                <Link
                  className="flex items-center justify-between lg:gap-5 w-full"
                  href={"/pricing"}
                >
                  <span className="text-base inline-flex">
                    _____ no number{" "}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center p-2 bg-transparent border-[#333] text-white hover:bg-[#4b265c]/20 hover:border-[#691f80] hover:text-white"
                  >
                    Buy number
                  </Button>
                </Link>
              )}
            </span>
            {twilioNumber && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-transparent border-[#333] text-white hover:bg-[#00F0FF]/10 hover:border-[#00F0FF] hover:text-white"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-[#00F0FF]" />
                    <span className="text-[#00F0FF]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="text-sm text-gray-400 space-y-2">
            <p>
              <strong className="text-white">How it works:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm font-mono ">
              <li>Customer calls this number</li>
              <li>System tries to connect to you first</li>
              <li>If you do not answer, AI handles call</li>
              <li>AI collects customer information</li>
              <li>You receive instant notifications</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-[#0a0a0a]/60 backdrop-blur-sm border border-[#00F0FF]/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Phone className="h-5 w-5 text-[#00F0FF]" />
            Your Number
            <Badge
              className={
                isActive
                  ? "bg-green-900/20 text-green-400 border-green-400/20"
                  : "bg-gray-900/20 text-gray-400 border-gray-400/20"
              }
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-[#0a0a0a]/80 backdrop-blur-sm rounded-lg border border-[#333]">
            <span className="text-2xl font-mono font-bold text-white">
              {phoneNumber ? (
                phoneNumber
              ) : (
                <Link
                  className="flex items-center justify-between lg:gap-5 w-full"
                  href={"/pricing"}
                >
                  <span className="text-base inline-flex">
                    _____ no number{" "}
                  </span>
                </Link>
              )}
            </span>
            {phoneNumber && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-transparent border-[#333] text-white hover:bg-[#00F0FF]/10 hover:border-[#00F0FF] hover:text-white"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-[#00F0FF]" />
                    <span className="text-[#00F0FF]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            )}
            {phoneNumber && (
              <div className="flex flex-wrap items-center justify-between gap-2 w-full ">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep("phone")}
                  className="flex items-center p-1 bg-transparent border-[#333] text-white hover:bg-[#963f3f]/10 hover:border-[#781414] hover:text-white"
                >
                  Change Number
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedSubscriptionId(subscriptions[0].subscriptionId);
                    setOpen(true);
                  }}
                  className="flex items-center p-1 bg-transparent border-[#333] text-white hover:bg-[#00F0FF]/10 hover:border-[#00F0FF] hover:text-white"
                >
                  Cancel Subscription
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
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
                    router.push(`/UserDashboard`);
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
