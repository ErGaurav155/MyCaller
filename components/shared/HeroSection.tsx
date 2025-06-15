"use client";
import React from "react";

import Image from "next/image";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[90vh]  flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent z-10"></div>
        <Image
          src="https://readdy.ai/api/search-image?query=futuristic%20space%20scene%20with%20cosmic%20nebula%2C%20distant%20planets%20and%20stars%2C%20deep%20space%20with%20vibrant%20purple%20and%20blue%20cosmic%20clouds%2C%20high%20detail%20digital%20art%20with%20neon%20accents%2C%20perfect%20for%20sci-fi%20website%20background&width=1440&height=800&seq=hero1&orientation=landscape"
          alt="Cosmic Space Background"
          width={500}
          height={500}
          className="w-screen h-screen object-cover  object-top"
        />
      </div>
      <div className="container mx-auto px-4 py-16 relative z-30 flex flex-col md:flex-row items-center max-w-7xl">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="block text-[#00F0FF]">Intergalactic</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#B026FF] to-[#FF2E9F]">
              AI Call Assistant
            </span>
            <span className="block text-white">For The Future</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl font-mono">
            Experience quantum communication across galaxies with our AI
            assistants. Connecting civilizations since 3047, now available for
            your interstellar business needs.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-3 !rounded-button bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer">
              Get Started
            </button>
            <button className="px-8 py-3 !rounded-button bg-transparent border border-[#00F0FF] text-[#00F0FF] font-medium hover:bg-[#00F0FF]/10 transition-colors whitespace-nowrap cursor-pointer">
              <i className="fas fa-play-circle mr-2"></i>
              Watch Demo
            </button>
          </div>
          <div className="mt-10 flex items-center space-x-6">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#B026FF] flex items-center justify-center">
                <i className="fas fa-user-astronaut text-black"></i>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#B026FF] to-[#FF2E9F] flex items-center justify-center">
                <i className="fas fa-robot text-black"></i>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF2E9F] to-[#00F0FF] flex items-center justify-center">
                <i className="fas fa-satellite text-black"></i>
              </div>
            </div>
            <div>
              <div className="text-[#00F0FF] font-medium">10,000+ Clients</div>
              <div className="text-sm text-gray-400">
                Across 500+ Star Systems
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div
            className="relative w-80 h-80"
            style={{ animation: "float 6s ease-in-out infinite" }}
          >
            {/* Holographic AI visualization */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00F0FF]/20 to-[#B026FF]/20 animate-pulse"></div>
            <div
              className="absolute inset-8 rounded-full bg-gradient-to-r from-[#00F0FF]/30 to-[#B026FF]/30 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute inset-16 rounded-full bg-gradient-to-r from-[#00F0FF]/40 to-[#B026FF]/40 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="https://readdy.ai/api/search-image?query=futuristic%20holographic%20AI%20assistant%2C%20glowing%20blue%20and%20purple%20energy%20sphere%20with%20digital%20interface%20elements%2C%20floating%20in%20space%20with%20particle%20effects%2C%20high%20tech%20visualization%2C%20transparent%20with%20neon%20accents&width=400&height=400&seq=aiassistant&orientation=squarish"
                alt="AI Assistant Hologram"
                width={500}
                height={500}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
