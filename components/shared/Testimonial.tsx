"use client";
import React from "react";

export function Testimonial() {
  return (
    <section id="reviews" className="py-20 relative">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#B026FF]">
            Testimonials
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto font-mono">
            Hear from our clients across the world about their experience with
            our AI communication solutions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-[#00F0FF]/20 rounded-lg p-6 hover:border-[#00F0FF]/50 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00F0FF]/20 to-[#00F0FF]/5 flex items-center justify-center mr-4">
                <i className="fas fa-user-astronaut text-xl text-[#00F0FF]"></i>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Rajat Garg</h4>
                <p className="text-sm text-[#00F0FF]">
                  CTO | Lead product & tech
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 font-mono text-lg">
              AiCaller has helped us streamline our support function efficiently
              and effectively. The solution has been instrumental in helping us
              even track agents’ performance and its impact on customer
              satisfaction is quite visible
            </p>
            <div className="flex text-[#00F0FF]">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
          </div>
          {/* Testimonial 2 */}
          <div className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-[#B026FF]/20 rounded-lg p-6 hover:border-[#B026FF]/50 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#B026FF]/20 to-[#B026FF]/5 flex items-center justify-center mr-4">
                <i className="fas fa-user-tie text-xl text-[#B026FF]"></i>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  Vandana Thutupalli
                </h4>
                <p className="text-sm text-[#B026FF]">
                  Vice President, Marketing and Growth
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 font-mono text-lg">
              AiCaller stood out to us for its user-friendly interface, seamless
              integrations, and direct WhatsApp business service. We have also
              utilised their AI future to train the solution with frequently
              asked questions and relevant answers.
            </p>
            <div className="flex text-[#B026FF]">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star-half-alt"></i>
            </div>
          </div>
          {/* Testimonial 3 */}
          <div className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-[#FF2E9F]/20 rounded-lg p-6 hover:border-[#FF2E9F]/50 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF2E9F]/20 to-[#FF2E9F]/5 flex items-center justify-center mr-4">
                <i className="fas fa-user-graduate text-xl text-[#FF2E9F]"></i>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  Suryanarayanan N
                </h4>
                <p className="text-sm text-[#FF2E9F]">Senior Quality Analyst</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 font-mono text-lg">
              The team has been super helpful and approachable. We’ve been able
              to suggest new ideas and customizations easily, and the dashboard
              with live statistics has been extremely helpful.
            </p>
            <div className="flex text-[#FF2E9F]">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
