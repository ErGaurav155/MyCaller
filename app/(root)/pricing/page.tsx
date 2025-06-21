"use client";

import { useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

import { Pricing } from "@/components/shared/Pricing";

export default function PricingPage() {
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
      <Pricing />
      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]/80 backdrop-blur-sm ">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-300 font-mono">
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
                  <p className="text-gray-300 mb-4 font-mono">
                    {testimonial.content}
                  </p>
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
    </div>
  );
}
