"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, MapPin, Globe } from "lucide-react";
import { PricingPlan } from "@/types";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { createRazerPaySubscription } from "@/lib/action/subscription.action";

import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import OTPVerification from "../shared/OTPVerification";
import { countryCodes } from "@/constant";
import Script from "next/script";
import { getRazerpayPlanInfo } from "@/lib/action/plan.action";
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan | null;
  billingCycle: "monthly" | "yearly";
  buyerId: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}
const phoneFormSchema = z.object({
  MobileNumber: z
    .string()
    .min(10, "MOBILE number is required")
    .regex(/^\d+$/, "invalid number"),
});
type PhoneFormData = z.infer<typeof phoneFormSchema>;

export default function PaymentModal({
  isOpen,
  onClose,
  plan,
  billingCycle,
  buyerId,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "paypal">(
    "razorpay"
  );
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);
  const [countryCode, setCountryCode] = useState("+1"); // Default to US
  const [phone, setPhone] = useState("");

  const [feedInfo, setFeedInfo] = useState(false);
  const [step, setStep] = useState<"phone" | "otp" | null>(null);
  const razorpayplanId = useRef<string | null>(null);
  const router = useRouter();
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
  if (!plan) return null;

  const price =
    billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
  const inrPrice = Math.round(price * 87); // Approximate INR to USD conversion

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/payments/razorpay/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price,
          productId: razorpayplanId.current,
          billingCycle,
          buyerId,
        }),
      });

      const subscriptionCreate = await response.json();
      if (!subscriptionCreate.isOk) {
        throw new Error("Purchase Order is not created");
      }
      const options = {
        key_id: process.env.RAZORPAY_KEY_ID!,
        amount: price * 100,
        currency: "USD",
        name: "GK Services",
        description: `${plan.name} Plan - ${billingCycle}`,
        subscription_id: subscriptionCreate.subsId,
        notes: {
          productId: plan.id,
          buyerId: buyerId,
          amount: price,
        },
        handler: async (response: any) => {
          const data = {
            subscription_id: subscriptionCreate.subsId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          const verifyResponse = await fetch("/api/payments/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const res = await verifyResponse.json();

          if (res.success) {
            toast({
              title: "Payment Successful!",
              description: "Code added to your Dashboard",
              duration: 3000,
              className: "success-toast",
            });

            await createRazerPaySubscription(
              buyerId,
              plan.id,
              subscriptionCreate.subsId,
              billingCycle
            );

            router.push("/dashboard");
          } else {
            toast({
              title: "Order canceled!",
              description: res.message,
              duration: 3000,
              className: "error-toast",
            });
          }
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        toast({
          title: "Order failed!",
          description: response.error.description,
          duration: 3000,
          className: "error-toast",
        });
      });
      razorpay.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Checkout Error",
        description: error.message,
        duration: 3000,
        className: "error-toast",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const onCheckout = async () => {
    try {
      // Fetch plan data
      const info = await getRazerpayPlanInfo(plan.id);
      if (!info.monthlyPlanId || !info.yearlyPlanId) {
        router.push("/");
        throw new Error("Plan not found");
      }

      if (billingCycle === "monthly") {
        razorpayplanId.current = info.monthlyPlanId;
      } else if (billingCycle === "yearly") {
        razorpayplanId.current = info.yearlyPlanId;
      } else {
        router.push("/");
        return false;
      }
    } catch (error) {
      console.error("Error fetching plan info:", error);
      return false;
    } finally {
      setFeedInfo(true);
      setStep("phone");
    }
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-[#0a0a0a]/90 backdrop-blur-lg border border-[#333] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-white font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#B026FF]">
              Complete Your Subscription
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Plan Summary */}
            <div className="bg-[#1a1a1a]/50 backdrop-blur-sm p-4 rounded-xl border border-[#333]">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-300">
                  {plan.name} Plan
                </span>
                <Badge className="bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-white">
                  {billingCycle}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-xl font-bold mt-4">
                <span className="text-gray-300">Total</span>
                <span className="text-white">${price.toLocaleString()}</span>
              </div>
              {billingCycle === "yearly" && (
                <p className="text-sm text-green-400 mt-3 font-medium">
                  Save ₹
                  {(plan.monthlyPrice * 12 - plan.yearlyPrice).toLocaleString()}{" "}
                  with yearly billing
                </p>
              )}
            </div>

            <Separator className="bg-[#333]" />

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-300 text-center">
                Price in <span className="text-[#00F0FF]">USD</span> and{" "}
                <span className="text-[#B026FF]">INR</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 border ${
                    paymentMethod === "razorpay"
                      ? "border-[#00F0FF] bg-[#00F0FF]/10"
                      : "border-[#333] hover:border-[#00F0FF]/50"
                  }`}
                  onClick={() => setPaymentMethod("razorpay")}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#00F0FF]" />
                    <span className="text-xs font-medium text-gray-300">
                      International
                    </span>
                  </div>
                  <span className="text-md font-medium text-white mt-2">
                    Razorpay
                  </span>
                  <span className="font-bold text-white">
                    ${price.toLocaleString()}
                  </span>
                </div>

                <div
                  className={`rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 border ${
                    paymentMethod === "paypal"
                      ? "border-[#B026FF] bg-[#B026FF]/10"
                      : "border-[#333] hover:border-[#B026FF]/50"
                  }`}
                  onClick={() => setPaymentMethod("paypal")}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[#B026FF]" />
                    <span className="text-xs font-medium text-gray-300">
                      India
                    </span>
                  </div>
                  <span className="text-md font-medium text-white mt-2">
                    Razorpay
                  </span>
                  <span className="font-bold text-white">
                    ₹{inrPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <SignedIn>
              <Button
                className="w-full py-6 rounded-full font-bold text-lg bg-gradient-to-r from-[#00F0FF] to-[#B026FF] hover:from-[#00F0FF]/90 hover:to-[#B026FF]/90"
                onClick={() => onCheckout()}
                disabled={isProcessing}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                {isProcessing ? "Processing..." : `Pay with Razorpay`}
              </Button>
            </SignedIn>
            <SignedOut>
              <Button
                className="w-full min-w- py-6 rounded-full font-bold text-lg bg-gradient-to-r from-[#00F0FF] to-[#B026FF] hover:from-[#00F0FF]/90 hover:to-[#B026FF]/90"
                onClick={() => {
                  router.push("/sign-in?redirect_to=/pricing");
                }}
              >
                Sign-in
              </Button>
            </SignedOut>
            <p className="text-xs text-gray-400 text-center px-4">
              Your subscription will be activated immediately after successful
              payment. You can cancel anytime from your dashboard.
            </p>
          </div>
        </DialogContent>
        {feedInfo && (
          <>
            <div>
              {step === "phone" && (
                <AlertDialog defaultOpen>
                  <AlertDialogContent className="bg-[#0a0a0a]/90 backdrop-blur-lg border border-[#333] rounded-xl max-w-md">
                    <AlertDialogTitle className="text-pink-400">
                      Otp Verification
                    </AlertDialogTitle>
                    <AlertDialogHeader>
                      <div className="flex justify-between items-center">
                        <h3 className="p-16-semibold text-white text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#B026FF]">
                          PLEASE ENTER YOUR MOBILE NUMBER
                        </h3>
                        <AlertDialogCancel
                          onClick={() => router.push(`/`)}
                          className="border-0 p-0 hover:bg-transparent text-gray-400 hover:text-white transition-colors"
                        >
                          <XMarkIcon className="size-6 cursor-pointer" />
                        </AlertDialogCancel>
                      </div>
                    </AlertDialogHeader>

                    <form
                      onSubmit={handlePhoneSubmit(handlePhoneSubmission)}
                      className="space-y-6 p-4"
                    >
                      <div className="w-full">
                        <label
                          htmlFor="MobileNumber"
                          className="block text-md font-medium text-gray-300 mb-2"
                        >
                          Enter Your Phone Number
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
                          <p className="text-red-400 text-sm mt-2">
                            {phoneErrors.MobileNumber.message}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-center">
                        <button
                          type="submit"
                          className={`w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-[#00F0FF] to-[#B026FF] hover:from-[#00F0FF]/90 hover:to-[#B026FF]/90 transition-all ${
                            isOtpSubmitting
                              ? "opacity-70 cursor-not-allowed"
                              : ""
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
                  onVerified={() => {
                    setStep(null);
                    onClose();
                    handleRazorpayPayment();
                  }}
                  buyerId={buyerId}
                />
              )}
            </div>
          </>
        )}
      </Dialog>
      <div>
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
        />
      </div>
    </>
  );
}
