"use client";
import React from "react";

export function Service() {
  return (
    <section id="features" className="py-20 relative">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#B026FF]">
            Our Interstellar Services
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Choose from our range of AI communication solutions designed for the
            modern space traveler and business entity.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Service Card 1 */}
          <div className="group relative rounded-lg overflow-hidden backdrop-blur-sm border border-[#00F0FF]/20 hover:border-[#00F0FF] transition-all duration-300 p-6 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/10 to-[#B026FF]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-[#00F0FF]/20 to-[#00F0FF]/5 flex items-center justify-center">
                <i className="fas fa-headset text-2xl text-[#00F0FF]"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#00F0FF] transition-colors">
                Quantum Call Assistant
              </h3>
              <p className="text-gray-400 mb-4">
                AI-powered call handling with real-time translation across
                12,000+ galactic languages and dialects.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-[#00F0FF] font-bold">
                  50 <span className="text-sm">credits/cycle</span>
                </span>
                <button className="px-4 py-2 !rounded-button bg-transparent border border-[#00F0FF] text-[#00F0FF] text-sm font-medium hover:bg-[#00F0FF]/10 transition-colors whitespace-nowrap cursor-pointer">
                  Select Plan
                </button>
              </div>
            </div>
          </div>
          {/* Service Card 2 */}
          <div className="group relative rounded-lg overflow-hidden backdrop-blur-sm border border-[#B026FF]/20 hover:border-[#B026FF] transition-all duration-300 p-6 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-[#B026FF]/10 to-[#FF2E9F]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-[#B026FF]/20 to-[#B026FF]/5 flex items-center justify-center">
                <i className="fas fa-shuttle-space text-2xl text-[#B026FF]"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#B026FF] transition-colors">
                Quantum Shuttle Rentals
              </h3>
              <p className="text-gray-400 mb-4">
                Voice-activated shuttle booking and management with predictive
                maintenance alerts and route optimization.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-[#B026FF] font-bold">
                  120 <span className="text-sm">credits/cycle</span>
                </span>
                <button className="px-4 py-2 !rounded-button bg-transparent border border-[#B026FF] text-[#B026FF] text-sm font-medium hover:bg-[#B026FF]/10 transition-colors whitespace-nowrap cursor-pointer">
                  Select Plan
                </button>
              </div>
            </div>
          </div>
          {/* Service Card 3 */}
          <div className="group relative rounded-lg overflow-hidden backdrop-blur-sm border border-[#FF2E9F]/20 hover:border-[#FF2E9F] transition-all duration-300 p-6 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF2E9F]/10 to-[#00F0FF]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-[#FF2E9F]/20 to-[#FF2E9F]/5 flex items-center justify-center">
                <i className="fas fa-globe text-2xl text-[#FF2E9F]"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#FF2E9F] transition-colors">
                Exoplanet Safari Packages
              </h3>
              <p className="text-gray-400 mb-4">
                Personalized tour guides with environmental adaptation
                recommendations and local customs briefing.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-[#FF2E9F] font-bold">
                  200 <span className="text-sm">credits/cycle</span>
                </span>
                <button className="px-4 py-2 !rounded-button bg-transparent border border-[#FF2E9F] text-[#FF2E9F] text-sm font-medium hover:bg-[#FF2E9F]/10 transition-colors whitespace-nowrap cursor-pointer">
                  Select Plan
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center">
          <button className="px-8 py-3 !rounded-button bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer">
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
}
