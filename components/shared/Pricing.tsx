"use client";
import Link from "next/link";
import React from "react";

export function Pricing() {
  return (
    <section id="pricing" className="py-20 relative">
      <div className="container px-0 max-w-7xl mx-auto w-full ">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#FF2E9F]">
            Transparent Pricing
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Choose the perfect plan for your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 w-[90vw] md:w-full gap-8 max-w-6xl mx-auto mb-12">
          {/* Starter Plan */}
          <div className="relative group rounded-lg overflow-hidden backdrop-blur-sm border border-[#00F0FF]/20 hover:border-[#00F0FF] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 p-6">
              <h3 className="text-xl font-bold mb-2 text-white">Starter</h3>
              <p className="text-gray-400 text-sm mb-6">
                Perfect for small businesses
              </p>
              <div className="flex items-end mb-6">
                <span className="text-3xl font-bold text-[#00F0FF]">
                  ₹2,999
                </span>
                <span className="text-gray-400 ml-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <i className="fas fa-check text-[#00F0FF] mt-1 mr-3"></i>
                  <span className="text-gray-300">500 calls/month</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-[#00F0FF] mt-1 mr-3"></i>
                  <span className="text-gray-300">Basic AI responses</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-[#00F0FF] mt-1 mr-3"></i>
                  <span className="text-gray-300">Email notifications</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-[#00F0FF] mt-1 mr-3"></i>
                  <span className="text-gray-300">Dashboard access</span>
                </li>
              </ul>
              <button className="w-full py-3 !rounded-button bg-gradient-to-r from-[#00F0FF]/80 to-[#00F0FF] text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer">
                Get Started
              </button>
            </div>
          </div>

          {/* Professional Plan */}
          <div className="relative group rounded-lg overflow backdrop-blur-sm border border-[#B026FF]/30 hover:border-[#B026FF] transition-all duration-300 transform scale-105 z-10">
            <div className="absolute -top-3 left-0 right-0 text-center">
              <span className="bg-gradient-to-r from-[#B026FF] to-[#FF2E9F] text-black text-sm font-bold py-1 px-4 rounded-full">
                Most Popular
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#B026FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 p-6 lg:p-8">
              <h3 className="text-xl font-bold mb-2 text-white">
                Professional
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Ideal for growing businesses
              </p>
              <div className="flex items-end mb-6">
                <span className="text-3xl font-bold text-[#B026FF]">
                  ₹5,999
                </span>
                <span className="text-gray-400 ml-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <i className="fas fa-check text-[#B026FF] mt-1 mr-3"></i>
                  <span className="text-gray-300">2,000 calls/month</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-[#B026FF] mt-1 mr-3"></i>
                  <span className="text-gray-300">Custom AI responses</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-[#B026FF] mt-1 mr-3"></i>
                  <span className="text-gray-300">SMS + Email alerts</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-[#B026FF] mt-1 mr-3"></i>
                  <span className="text-gray-300">Advanced analytics</span>
                </li>
              </ul>
              <button className="w-full py-3 !rounded-button bg-gradient-to-r from-[#B026FF] to-[#FF2E9F] text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer">
                Get Started
              </button>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="relative group rounded-lg overflow-hidden backdrop-blur-sm border border-[#FF2E9F]/20 hover:border-[#FF2E9F] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF2E9F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 p-6">
              <h3 className="text-xl font-bold mb-2 text-white">Enterprise</h3>
              <p className="text-gray-400 text-sm mb-6">
                For high-volume businesses
              </p>
              <div className="flex items-end mb-6">
                <span className="text-3xl font-bold text-[#FF2E9F]">
                  ₹12,999
                </span>
                <span className="text-gray-400 ml-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <i className="fas fa-check text-[#FF2E9F] mt-1 mr-3"></i>
                  <span className="text-gray-300">Unlimited calls</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-[#FF2E9F] mt-1 mr-3"></i>
                  <span className="text-gray-300">Multi-language support</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-[#FF2E9F] mt-1 mr-3"></i>
                  <span className="text-gray-300">Priority support</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-[#FF2E9F] mt-1 mr-3"></i>
                  <span className="text-gray-300">API access</span>
                </li>
              </ul>
              <button className="w-full py-3 !rounded-button bg-gradient-to-r from-[#FF2E9F]/80 to-[#FF2E9F] text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer">
                Get Started
              </button>
            </div>
          </div>
        </div>

        <div className="text-center ">
          <Link
            href={"/pricing"}
            className="px-8 py-3 !rounded-button bg-transparent border border-[#00F0FF] text-[#00F0FF] font-medium hover:bg-[#00F0FF]/10 transition-colors whitespace-nowrap cursor-pointer"
          >
            View All Plans & Features
          </Link>
        </div>

        <div className="mt-16 max-w-4xl w-[90vw] mx-auto">
          <div className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-[#00F0FF]/20 rounded-lg p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Need a custom solution?
                </h3>
                <p className="text-gray-300 mb-6">
                  Our team can create a tailored AI communication package for
                  your specific interstellar business requirements.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <i className="fas fa-headset text-[#00F0FF] mr-2"></i>
                    <span className="text-sm text-gray-400">24/7 Support</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-shield-alt text-[#B026FF] mr-2"></i>
                    <span className="text-sm text-gray-400">Secure</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-rocket text-[#FF2E9F] mr-2"></i>
                    <span className="text-sm text-gray-400">Scalable</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 md:border-l md:border-[#333] md:pl-8">
                <button className="w-full py-3 !rounded-button bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer mb-4">
                  Contact Sales Team
                </button>
                <p className="text-center text-gray-400 text-sm">
                  Get a response within 24 Earth hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
