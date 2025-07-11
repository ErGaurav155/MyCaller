"use client";

import { useEffect, useState } from "react";

import { Switch } from "@/components/ui/switch";
import { Check, Zap } from "lucide-react";
import PaymentModal from "@/components/pricing/PaymentModal";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { getUserById } from "@/lib/action/user.actions";
import { useRouter } from "next/navigation";
import { pricingPlans } from "@/constant";
import { PricingPlan } from "@/types";
import { getSubscriptionInfo } from "@/lib/action/subscription.action";

export const Pricing = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [buyerId, setBuyerId] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [islogged, setIslogged] = useState(false);

  const handleSubscribe = async (
    plan: PricingPlan,
    cycle: "monthly" | "yearly"
  ) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
    if (!userId) {
      setIsSubscribed(false);
    } else {
      const isSubscribed = await getSubscriptionInfo(buyerId);
      if (isSubscribed.length === 0) {
        setIsSubscribed(false);
      } else {
        setIsSubscribed(true);
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      //fetch user data
      if (!userId) {
        setIslogged(false);
      } else {
        try {
          const buyer = await getUserById(userId);
          if (!buyer) {
            router.push("/sign-in");
            return;
          }
          setBuyerId(buyer._id);
          setIslogged(true);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };
    fetchUserData();
  }, [userId, router]);

  return (
    <div className="min-h-screen     text-white">
      <section className=" py-5 md:py-16  px-4 sm:px-6 lg:px-8 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-start md:text-center">
          <div className="inline-flex items-center bg-green-900/10 text-blue-400 border border-blue-400/30 rounded-full px-4 py-1 mb-4">
            <Zap className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">
              Simple, Transparent Pricing
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FF2E9F]">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-mono">
            Start capturing more leads today. No setup fees, no hidden costs.
            Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-12">
            <span
              className={`text-sm font-medium ${
                billingCycle === "monthly" ? "text-white" : "text-gray-500"
              }`}
            >
              Monthly
            </span>
            <Switch
              checked={billingCycle === "yearly"}
              onCheckedChange={(checked) =>
                setBillingCycle(checked ? "yearly" : "monthly")
              }
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#00F0FF] data-[state=checked]:to-[#FF2E9F]"
            />
            <span
              className={`text-sm font-medium ${
                billingCycle === "yearly" ? "text-white" : "text-gray-500"
              }`}
            >
              Yearly
            </span>
            <div className="bg-green-900/20 text-green-400 border border-green-400/30 rounded-full px-1 md:px-3 py-1 ml-2 ">
              Save 17%
            </div>
          </div>
        </div>
      </section>
      {/* Pricing Cards */}
      <section className="px-4 sm:px-6 lg:px-8 pb-5 md:pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative group rounded-lg  backdrop-blur-sm border transition-all duration-300 ${
                  plan.popular
                    ? "scale-105 z-10 border-[#B026FF]/30 hover:border-[#B026FF]"
                    : plan.id === "Starter-AI-Customer-Support-Agent"
                    ? "border-[#00F0FF]/20 hover:border-[#00F0FF]"
                    : "border-[#FF2E9F]/20 hover:border-[#FF2E9F]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-0 right-0 text-center">
                    <span className="bg-gradient-to-r from-[#B026FF] to-[#FF2E9F] text-black text-sm font-bold py-1 px-4 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div
                  className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity ${
                    plan.popular
                      ? "from-[#B026FF]/10"
                      : plan.id === "starter"
                      ? "from-[#00F0FF]/10"
                      : "from-[#FF2E9F]/10"
                  } to-transparent`}
                ></div>
                <div className="relative z-10 p-6">
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400  mb-6 font-mono text-lg">
                    {plan.description}
                  </p>
                  <div className="flex items-end mb-6">
                    <span
                      className={`text-3xl font-bold ${
                        plan.popular
                          ? "text-[#B026FF]"
                          : plan.id === "starter"
                          ? "text-[#00F0FF]"
                          : "text-[#FF2E9F]"
                      }`}
                    >
                      ${" "}
                      {billingCycle === "monthly"
                        ? plan.monthlyPrice.toFixed(0)
                        : plan.yearlyPrice.toFixed(0)}
                    </span>
                    <span className="text-gray-400 ml-1">
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.slice(0, 6).map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check
                          className={`h-5 w-5 mt-1 mr-3 ${
                            plan.popular
                              ? "text-[#B026FF]"
                              : plan.id === "starter"
                              ? "text-[#00F0FF]"
                              : "text-[#FF2E9F]"
                          }`}
                        />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <SignedOut>
                    <button
                      onClick={() => router.push("/sign-in")}
                      className={`w-full py-3 rounded-full font-medium hover:opacity-90 transition-opacity whitespace-nowrap ${
                        plan.popular
                          ? "bg-gradient-to-r from-[#B026FF] to-[#FF2E9F]"
                          : plan.id === "starter"
                          ? "bg-gradient-to-r from-[#00F0FF]/80 to-[#00F0FF]"
                          : "bg-gradient-to-r from-[#FF2E9F]/80 to-[#FF2E9F]"
                      } text-black`}
                    >
                      Login
                    </button>
                  </SignedOut>
                  <SignedIn>
                    <button
                      onClick={() => handleSubscribe(plan, billingCycle)}
                      className={`w-full py-3 rounded-full font-medium hover:opacity-90 transition-opacity whitespace-nowrap ${
                        plan.popular
                          ? "bg-gradient-to-r from-[#B026FF] to-[#FF2E9F]"
                          : plan.id === "starter"
                          ? "bg-gradient-to-r from-[#00F0FF]/80 to-[#00F0FF]"
                          : "bg-gradient-to-r from-[#FF2E9F]/80 to-[#FF2E9F]"
                      } text-black`}
                    >
                      Purchase Now
                    </button>
                  </SignedIn>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features Comparison */}
      <section className=" pb-5  md:pb-16 px-4 sm:px-6 lg:px-8  backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-start md:text-center mb-12">
            <h2 className="text-3xl font-bold text-[#FF2E9F] mb-4">
              Compare All Features
            </h2>
            <p className="text-xl text-gray-300">
              See what is included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[#333]">
                  <th className="text-left py-4 px-6 font-semibold text-white">
                    Features
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-[#00F0FF]">
                    Starter
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-[#B026FF]">
                    Professional
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-[#FF2E9F]">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {[
                  {
                    feature: "AI-handled calls per month",
                    starter: "225",
                    professional: "500",
                    enterprise: "Unlimited",
                  },
                  {
                    feature: "Lead storage",
                    starter: "100",
                    professional: "225",
                    enterprise: "Unlimited",
                  },
                  {
                    feature: "Email notifications",
                    starter: "✓",
                    professional: "✓",
                    enterprise: "✓",
                  },
                  {
                    feature: "SMS notifications",
                    starter: "✗",
                    professional: "✓",
                    enterprise: "✓",
                  },
                  {
                    feature: "Custom AI responses",
                    starter: "✗",
                    professional: "✓",
                    enterprise: "✓",
                  },
                  {
                    feature: "Call recordings",
                    starter: "✗",
                    professional: "✓",
                    enterprise: "✓",
                  },
                  {
                    feature: "Advanced analytics",
                    starter: "✗",
                    professional: "✓",
                    enterprise: "✓",
                  },
                  {
                    feature: "CRM integrations",
                    starter: "✗",
                    professional: "✓",
                    enterprise: "✓",
                  },
                  {
                    feature: "Multi-language support",
                    starter: "✗",
                    professional: "✗",
                    enterprise: "✓",
                  },
                  {
                    feature: "White-label solution",
                    starter: "✗",
                    professional: "✗",
                    enterprise: "✓",
                  },
                  {
                    feature: "Support",
                    starter: "Email",
                    professional: "Priority",
                    enterprise: "24/7 Dedicated",
                  },
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-[#1a1a1a]/50">
                    <td className="py-4 px-6 font-medium text-gray-300">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {row.starter === "✓" ? (
                        <Check className="h-5 w-5 text-[#00F0FF] mx-auto" />
                      ) : row.starter === "✗" ? (
                        <span className="text-gray-500">—</span>
                      ) : (
                        <span className="text-gray-300">{row.starter}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {row.professional === "✓" ? (
                        <Check className="h-5 w-5 text-[#B026FF] mx-auto" />
                      ) : row.professional === "✗" ? (
                        <span className="text-gray-500">—</span>
                      ) : (
                        <span className="text-gray-300">
                          {row.professional}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {row.enterprise === "✓" ? (
                        <Check className="h-5 w-5 text-[#FF2E9F] mx-auto" />
                      ) : row.enterprise === "✗" ? (
                        <span className="text-gray-500">—</span>
                      ) : (
                        <span className="text-gray-300">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {islogged && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          plan={selectedPlan}
          billingCycle={billingCycle}
          buyerId={buyerId}
          isSubscribed={isSubscribed}
        />
      )}
    </div>
  );
};
