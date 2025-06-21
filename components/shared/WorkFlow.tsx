"use client";
import React, { useEffect } from "react";

export function WorkFlow() {
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
    <section className="py-20 relative">
      <div
        id="stars-container"
        className="fixed inset-0  pointer-events-none"
      ></div>
      <div className="fixed  inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0A0A0A] to-[#0A0A0A]/95  pointer-events-none"></div>
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#B026FF]">
            How It Works
          </h2>
          <p className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto font-mono">
            Simple, seamless, and smart - here is how your AI assistant works
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-20">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-[#0A0A0A]/60 backdrop-blur-sm border border-[#00F0FF]/20 rounded-lg p-6 hover:border-[#00F0FF] transition-all duration-300">
              <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-[#00F0FF]/20 to-[#00F0FF]/5 flex items-center justify-center">
                <i className="fas fa-phone-alt text-2xl text-[#00F0FF]"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">
                1. Customer Calls
              </h3>
              <p className="text-gray-300 font-mono text-lg">
                A potential customer calls your dedicated AI assistant number.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#B026FF]/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-[#0A0A0A]/60 backdrop-blur-sm border border-[#B026FF]/20 rounded-lg p-6 hover:border-[#B026FF] transition-all duration-300">
              <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-[#B026FF]/20 to-[#B026FF]/5 flex items-center justify-center">
                <i className="fas fa-random text-2xl text-[#B026FF]"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">
                2. Smart Routing
              </h3>
              <p className="text-gray-300 font-mono text-lg">
                System tries to reach you first. If unavailable, AI takes over.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF2E9F]/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-[#0A0A0A]/60 backdrop-blur-sm border border-[#FF2E9F]/20 rounded-lg p-6 hover:border-[#FF2E9F] transition-all duration-300">
              <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-[#FF2E9F]/20 to-[#FF2E9F]/5 flex items-center justify-center">
                <i className="fas fa-clipboard-list text-2xl text-[#FF2E9F]"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">
                3. AI Collects Info
              </h3>
              <p className="text-gray-300 font-mono text-lg">
                AI Assitant gathers required info, then notifies you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
