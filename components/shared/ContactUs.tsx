"use client";
import React from "react";

import Image from "next/image";

export function ContactUs() {
  return (
    <section id="contact" className="py-20 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A] z-10"></div>
        <Image
          priority
          src="https://readdy.ai/api/search-image?query=cosmic%20space%20scene%20with%20vibrant%20nebula%2C%20distant%20stars%20and%20planets%2C%20deep%20space%20with%20purple%20and%20blue%20cosmic%20clouds%2C%20high%20detail%20digital%20art%20with%20neon%20accents%2C%20perfect%20for%20sci-fi%20website%20background&width=1440&height=500&seq=contact&orientation=landscape"
          alt="Cosmic Space Background"
          height={500}
          width={500}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#FF2E9F]">
              Contact Our Interstellar Team
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Have questions about our services? Our team is available across
              all time zones and dimensions.
            </p>
          </div>
          <div className="bg-[#0A0A0A]/80 backdrop-blur-lg border border-[#00F0FF]/20 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-gray-300 mb-2">Your Name</label>
                <input
                  type="text"
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-button py-3 px-4 text-white focus:outline-none focus:border-[#00F0FF]"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Your Email</label>
                <input
                  type="email"
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-button py-3 px-4 text-white focus:outline-none focus:border-[#00F0FF]"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Star System</label>
                <div className="relative">
                  <select className="w-full bg-[#1A1A1A] border border-[#333] rounded-button py-3 px-4 text-white focus:outline-none focus:border-[#00F0FF] appearance-none">
                    <option>Solar System</option>
                    <option>Alpha Centauri</option>
                    <option>Sirius System</option>
                    <option>Orion Nebula</option>
                    <option>Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <i className="fas fa-chevron-down text-[#00F0FF]"></i>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">
                  Service Interest
                </label>
                <div className="relative">
                  <select className="w-full bg-[#1A1A1A] border border-[#333] rounded-button py-3 px-4 text-white focus:outline-none focus:border-[#00F0FF] appearance-none">
                    <option>AI Call Assistant</option>
                    <option>Quantum Shuttle Rentals</option>
                    <option>Exoplanet Safari Packages</option>
                    <option>Other Services</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <i className="fas fa-chevron-down text-[#00F0FF]"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <label className="block text-gray-300 mb-2">Your Message</label>
              <textarea
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-button py-3 px-4 text-white focus:outline-none focus:border-[#00F0FF] h-32"
                placeholder="Tell us how we can help you..."
              ></textarea>
            </div>
            <div className="flex items-center mb-8">
              <input type="checkbox" id="consent" className="mr-2" />
              <label htmlFor="consent" className="text-gray-300 text-sm">
                I consent to having my data processed according to the
                Intergalactic Privacy Policy
              </label>
            </div>
            <button className="w-full py-3 !rounded-button bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer">
              Send Message
            </button>
            <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00F0FF]/20 to-[#00F0FF]/5 flex items-center justify-center mr-3">
                  <i className="fas fa-envelope text-[#00F0FF]"></i>
                </div>
                <span className="text-gray-300">
                  contact@nebulacom3047.space
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#B026FF]/20 to-[#B026FF]/5 flex items-center justify-center mr-3">
                  <i className="fas fa-satellite-dish text-[#B026FF]"></i>
                </div>
                <span className="text-gray-300">
                  Quantum-Comm: QC-9872-ALPHA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
