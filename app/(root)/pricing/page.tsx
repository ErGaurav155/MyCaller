"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Phone,
  ArrowLeft,
  Check,
  Star,
  Users,
  Headphones,
  Shield,
  Zap,
} from "lucide-react";
import PricingCard from "@/components/pricing/PricingCard";
import PaymentModal from "@/components/pricing/PaymentModal";
import { PricingPlan } from "@/types";

const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small businesses getting started",
    monthlyPrice: 2999,
    yearlyPrice: 29990,
    callLimit: 500,
    leadLimit: 100,
    features: [
      "500 AI-handled calls per month",
      "Basic lead collection",
      "Email notifications",
      "Standard AI responses",
      "Dashboard access",
      "Phone support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Ideal for growing businesses",
    monthlyPrice: 5999,
    yearlyPrice: 59990,
    callLimit: 2000,
    leadLimit: 500,
    popular: true,
    features: [
      "2,000 AI-handled calls per month",
      "Advanced lead collection",
      "SMS + Email notifications",
      "Custom AI responses",
      "Advanced analytics",
      "CRM integrations",
      "Priority support",
      "Call recordings",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large businesses with high volume",
    monthlyPrice: 12999,
    yearlyPrice: 129990,
    callLimit: -1,
    leadLimit: -1,
    features: [
      "Unlimited AI-handled calls",
      "Unlimited lead storage",
      "Multi-language support",
      "Custom AI training",
      "White-label solution",
      "API access",
      "Dedicated account manager",
      "24/7 premium support",
      "Custom integrations",
    ],
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleSubscribe = (plan: PricingPlan, cycle: "monthly" | "yearly") => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "Kumar Electronics",
      content:
        "Our lead conversion increased by 40% after implementing the AI assistant. Never miss a customer call again!",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      company: "Sharma Consultancy",
      content:
        "The professional plan is perfect for our growing business. The AI sounds so natural, customers love it.",
      rating: 5,
    },
    {
      name: "Amit Patel",
      company: "Patel Services",
      content:
        "ROI was positive within the first month. The system pays for itself with just a few converted leads.",
      rating: 5,
    },
  ];
  useEffect(() => {
    // Simulate particles with random stars
    const createStarParticles = () => {
      const starsContainer = document.getElementById("stars-container");
      if (!starsContainer) return;
      starsContainer.innerHTML = "";
      const numberOfStars = 150;
      for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement("div");
        star.className = "absolute rounded-full";
        // Random size
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        // Random color - use theme colors
        const colors = ["#00F0FF", "#B026FF", "#FF2E9F", "#FFFFFF"];
        star.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
        // Random opacity
        star.style.opacity = `${Math.random() * 0.8 + 0.2}`;
        // Animation
        star.style.animation = `twinkle ${Math.random() * 5 + 3}s infinite`;
        starsContainer.appendChild(star);
      }
    };
    createStarParticles();
    // Add keyframes for twinkling animation
    const style = document.createElement("style");
    style.innerHTML = `
          @keyframes twinkle {
            0% { opacity: 0.2; }
            50% { opacity: 1; }
            100% { opacity: 0.2; }
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return (
    <div className="min-h-screen     text-white">
      {/* Hero Section */}{" "}
      <div
        id="stars-container"
        className="fixed inset-0  pointer-events-none"
      ></div>
      <div className="fixed  inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0A0A0A] to-[#0A0A0A]/95  pointer-events-none"></div>
      <section className="py-16 px-4 sm:px-6 lg:px-8 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center bg-blue-100/10 text-blue-400 border border-blue-400/30 rounded-full px-4 py-1 mb-4">
            <Zap className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">
              Simple, Transparent Pricing
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#FF2E9F]">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Start capturing more leads today. No setup fees, no hidden costs.
            Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
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
            <div className="bg-green-900/20 text-green-400 border border-green-400/30 rounded-full px-3 py-1 ml-2">
              Save up to 17%
            </div>
          </div>
        </div>
      </section>
      {/* Pricing Cards */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative group rounded-lg  backdrop-blur-sm border transition-all duration-300 ${
                  plan.popular
                    ? "scale-105 z-10 border-[#B026FF]/30 hover:border-[#B026FF]"
                    : plan.id === "starter"
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
                  <p className="text-gray-400 text-sm mb-6">
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
                      ₹
                      {billingCycle === "monthly"
                        ? (plan.monthlyPrice / 100).toFixed(0)
                        : (plan.yearlyPrice / 100).toFixed(0)}
                    </span>
                    <span className="text-gray-400 ml-1">
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.slice(0, 4).map((feature, idx) => (
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
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
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
                    starter: "500",
                    professional: "2,000",
                    enterprise: "Unlimited",
                  },
                  {
                    feature: "Lead storage",
                    starter: "100",
                    professional: "500",
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
                    feature: "API access",
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
      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]/80 backdrop-blur-sm ">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of businesses already using our AI assistant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-[#0a0a0a]/60 border border-[#333] hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">{testimonial.content}</p>
                  <div>
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] backdrop-blur-sm ">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Can I change my plan anytime?",
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept Razorpay for Indian customers and PayPal for international customers.",
              },
              {
                question: "Is there a setup fee?",
                answer:
                  "No, there are no setup fees or hidden costs. You only pay the monthly or yearly subscription.",
              },
              {
                question: "Can I cancel anytime?",
                answer:
                  "Yes, you can cancel your subscription at any time. No questions asked.",
              },
              {
                question: "Do you offer refunds?",
                answer:
                  "We offer a 30-day money-back guarantee if you're not satisfied with our service.",
              },
              {
                question: "How quickly can I get started?",
                answer:
                  "You can be up and running within 5 minutes of subscribing. No technical setup required.",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="bg-[#0a0a0a]/60 border border-[#333]"
              >
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Custom Solution */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-[#00F0FF]/20 rounded-lg p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Need a custom solution?
                </h3>
                <p className="text-gray-300 mb-6">
                  Our team can create a tailored AI communication package for
                  your specific business requirements.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Headphones className="text-[#00F0FF] mr-2 h-4 w-4" />
                    <span className="text-sm text-gray-400">24/7 Support</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="text-[#B026FF] mr-2 h-4 w-4" />
                    <span className="text-sm text-gray-400">Secure</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="text-[#FF2E9F] mr-2 h-4 w-4" />
                    <span className="text-sm text-gray-400">Scalable</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 md:border-l md:border-[#333] md:pl-8">
                <button className="w-full py-3 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-black font-medium hover:opacity-90 transition-opacity mb-4">
                  Contact Sales Team
                </button>
                <p className="text-center text-gray-400 text-sm">
                  Get a response within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={selectedPlan}
        billingCycle={billingCycle}
      />
    </div>
  );
}
