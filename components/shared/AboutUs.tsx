import React from "react";
import aiagent from "@/public/ai-agent.jpg";
import Image from "next/image";
import Link from "next/link";

export function AboutUs() {
  return (
    <section id="about" className="py-20 relative">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="relative w-full h-full">
              <Image
                src={aiagent}
                alt="NebulaCom Headquarters"
                height={500}
                width={500}
                className="w-full h-full object-cover object-top rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 to-transparent"></div>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#B026FF]">
              About AiCaller
            </h2>
            <p className="text-gray-300 mb-6 font-mono text-lg">
              Founded in the year 2024, AiCaller has been at the forefront of Ai
              Call Assistant technology. Our mission is to connect local
              business to customers if some how call get unanswred.
            </p>
            <p className="text-gray-300 mb-6 font-mono text-lg">
              With office in the Nashik IND, we are uniquely positioned to
              understand the diverse AI Call Assistant needs of the modern
              businesses.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <div className="text-[#00F0FF] text-3xl font-bold">20%</div>
                <div className="text-gray-400">Customer Gain</div>
              </div>
              <div>
                <div className="text-[#B026FF] text-3xl font-bold">1,000+</div>
                <div className="text-gray-400">Local Business</div>
              </div>
              <div>
                <div className="text-[#FF2E9F] text-3xl font-bold">10M+</div>
                <div className="text-gray-400">Daily Translations</div>
              </div>
              <div>
                <div className="text-[#00F0FF] text-3xl font-bold">99.99%</div>
                <div className="text-gray-400">Uptime Guarantee</div>
              </div>
            </div>
            <Link
              href={"/contactUs"}
              className="px-6 py-3 !rounded-button bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
