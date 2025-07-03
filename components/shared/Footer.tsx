"use client";
import { toast } from "@/hooks/use-toast";
import { sendSubscriptionEmailToUser } from "@/lib/action/sendEmail.action";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        className: "error-toast",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await sendSubscriptionEmailToUser(email);

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Subscription Successful!",
          description: "Check your email for confirmation",
          className: "success-toast",
        });
        setEmail(""); // Reset input
      } else {
        throw new Error(data.error || "Subscription failed");
      }
    } catch (error: any) {
      toast({
        title: "Subscription Failed",
        description: error.message || "An error occurred while subscribing",
        className: "error-toast",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className=" backdrop-blur-sm bg-[#0A0A0A] border-t border-[#00F0FF]/20 pt-16 pb-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href={"/"} className="flex items-center mb-6">
              <div className="relative w-8 h-8 lg:w-10 lg:h-10 mr-1 lg:mr-2">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#B026FF] animate-pulse"></div>
                <div className="absolute inset-1 rounded-full bg-[#0A0A0A] flex items-center justify-center">
                  <i className="fas fa-robot text-[#622a8f]"></i>
                </div>
              </div>
              <h1 className="text-base lg:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#FF2E9F]">
                Catch<span className="text-[#B026FF]">Customer</span>
                <span>Call</span>
              </h1>
            </Link>
            <p className="text-gray-400 mb-6">
              Connecting civilizations across the cosmos with advanced AI
              communication solutions since 3047.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-colors cursor-pointer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#B026FF] hover:bg-[#B026FF]/10 transition-colors cursor-pointer"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#FF2E9F] hover:bg-[#FF2E9F]/10 transition-colors cursor-pointer"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-colors cursor-pointer"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Services</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#00F0FF] transition-colors cursor-pointer"
                >
                  AI Call Assistants
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#00F0FF] transition-colors cursor-pointer"
                >
                  Lead Generation
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-6">
              Company
            </h3>
            <div className="flex flex-col justify-start items-start text-md font-normal gap-2">
              {[
                { id: "features", label: "Features" },
                { id: "pricing", label: "Pricing" },
                { id: "reviews", label: "Reviews" },
                { id: "contact", label: "Contact Us" },
              ].map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  className={`  cursor-pointer text-white `}
                >
                  <span className="text-gray-400 hover:text-[#00F0FF] ">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Subscribe</h3>
            <p className="text-gray-400 mb-4">
              Stay updated with the latest in AI Call Assistance technology.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-wrap gap-1 mb-4"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-[#1A1A1A] border-none rounded-l-button py-2 px-4 text-gray-300 text-sm focus:outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-[#00F0FF] to-[#B026FF] rounded-r-button py-2 px-4 text-black font-medium whitespace-nowrap cursor-pointer disabled:opacity-75"
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            <div className="flex flex-wrap items-center space-x-4">
              <div className="flex items-center">
                <i className="fas fa-shield-alt text-[#00F0FF] mr-2"></i>
                <span className="text-sm text-gray-400">Secure</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-lock text-[#B026FF] mr-2"></i>
                <span className="text-sm text-gray-400">Private</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-[#FF2E9F] mr-2"></i>
                <span className="text-sm text-gray-400">Verified</span>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-[#333333]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; AiCaller. All rights reserved by GK Services.
            </div>
            <div className="flex space-x-6">
              <a
                href="/privacy-policy"
                className="text-gray-500 hover:text-[#00F0FF] text-sm transition-colors cursor-pointer"
              >
                Privacy Policy
              </a>
              <a
                href="/TermsandCondition"
                className="text-gray-500 hover:text-[#00F0FF] text-sm transition-colors cursor-pointer"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
