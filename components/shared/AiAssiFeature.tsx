import React from "react";

import Image from "next/image";

export function AiAssiFeature() {
  return (
    <section id="assistant" className="py-20 relative ">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#B026FF]">
            Our Interstellar AI Call Assistant
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Revolutionize your communication with our advanced AI technology
            designed for seamless interstellar conversations.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#00F0FF]/20 to-[#B026FF]/20 rounded-lg blur-lg opacity-70"></div>
            <div className="relative bg-[#0A0A0A]/80 backdrop-blur-sm border border-[#00F0FF]/30 rounded-lg overflow-hidden">
              <Image
                src="https://readdy.ai/api/search-image?query=futuristic%20AI%20call%20center%20interface%20with%20holographic%20displays%2C%20neon%20blue%20and%20purple%20elements%2C%20digital%20communication%20visualization%2C%20high%20tech%20control%20panel%20with%20floating%20screens%20and%20data%20streams&width=600&height=400&seq=callassistant&orientation=landscape"
                alt="AI Call Assistant Interface"
                height={500}
                width={500}
                className="w-full h-auto rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-white">
                  Quantum Neural Processing
                </h3>
                <p className="text-gray-300 mb-4">
                  Our AI utilizes quantum computing to process and respond to
                  calls across vast interstellar distances with zero latency.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] text-sm">
                    Real-time Translation
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#B026FF]/10 text-[#B026FF] text-sm">
                    Voice Recognition
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#FF2E9F]/10 text-[#FF2E9F] text-sm">
                    Sentiment Analysis
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-[#00F0FF]/20 rounded-lg p-6 hover:border-[#00F0FF]/50 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00F0FF]/20 to-[#00F0FF]/5 flex items-center justify-center mr-4">
                  <i className="fas fa-language text-2xl text-[#00F0FF]"></i>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Universal Translator
                </h3>
              </div>
              <p className="text-gray-400">
                Instantly translates over 12,000 known languages and dialects
                from across the galaxy with cultural context preservation.
              </p>
            </div>
            <div className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-[#B026FF]/20 rounded-lg p-6 hover:border-[#B026FF]/50 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#B026FF]/20 to-[#B026FF]/5 flex items-center justify-center mr-4">
                  <i className="fas fa-robot text-2xl text-[#B026FF]"></i>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Emotional Intelligence
                </h3>
              </div>
              <p className="text-gray-400">
                Advanced algorithms detect and respond to emotional cues across
                species, ensuring empathetic communication.
              </p>
            </div>
            <div className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-[#FF2E9F]/20 rounded-lg p-6 hover:border-[#FF2E9F]/50 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF2E9F]/20 to-[#FF2E9F]/5 flex items-center justify-center mr-4">
                  <i className="fas fa-shield-alt text-2xl text-[#FF2E9F]"></i>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Quantum Encryption
                </h3>
              </div>
              <p className="text-gray-400">
                Military-grade security protocols ensure your communications
                remain private across the vastness of space.
              </p>
            </div>
            <button className="w-full py-3 !rounded-button bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer">
              Explore AI Call Assistant
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
