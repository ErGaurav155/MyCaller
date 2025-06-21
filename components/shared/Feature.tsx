import React from "react";

const Feature = () => {
  return (
    <div className="container max-w-7xl mx-auto px-4">
      <div className=" text-center mb-16 relative z-10">
        {/* Features Grid */}
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#B026FF]">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto font-mono">
            Everything you need to capture and manage leads effectively
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-[#00F0FF]/20 rounded-lg p-6 hover:border-[#00F0FF]/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00F0FF]/20 to-[#00F0FF]/5 flex items-center justify-center mb-4">
              <i className="fas fa-route text-xl text-[#00F0FF]"></i>
            </div>
            <h4 className="text-lg font-bold mb-3 text-white">
              Smart Call Routing
            </h4>
            <p className="text-gray-400 font-mono text-lg">
              call distribution based on availability and expertise.
            </p>
          </div>

          <div className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-[#B026FF]/20 rounded-lg p-6 hover:border-[#B026FF]/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#B026FF]/20 to-[#B026FF]/5 flex items-center justify-center mb-4">
              <i className="fas fa-robot text-xl text-[#B026FF]"></i>
            </div>
            <h4 className="text-lg font-bold mb-3 text-white">AI Assistant</h4>
            <p className="text-gray-400 font-mono text-lg">
              AI handling calls with natural language processing.
            </p>
          </div>

          <div className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-[#FF2E9F]/20 rounded-lg p-6 hover:border-[#FF2E9F]/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF2E9F]/20 to-[#FF2E9F]/5 flex items-center justify-center mb-4">
              <i className="fas fa-tasks text-xl text-[#FF2E9F]"></i>
            </div>
            <h4 className="text-lg font-bold mb-3 text-white">
              Lead Management
            </h4>
            <p className="text-gray-400 font-mono text-lg">
              Comprehensive lead tracking and management system.
            </p>
          </div>

          <div className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-[#00F0FF]/20 rounded-lg p-6 hover:border-[#00F0FF]/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00F0FF]/20 to-[#00F0FF]/5 flex items-center justify-center mb-4">
              <i className="fas fa-bell text-xl text-[#00F0FF]"></i>
            </div>
            <h4 className="text-lg font-bold mb-3 text-white">
              Instant Notifications
            </h4>
            <p className="text-gray-400 font-mono text-lg">
              Real-time alerts for new leads and important updates.
            </p>
          </div>

          <div className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-[#B026FF]/20 rounded-lg p-6 hover:border-[#B026FF]/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#B026FF]/20 to-[#B026FF]/5 flex items-center justify-center mb-4">
              <i className="fas fa-chart-line text-xl text-[#B026FF]"></i>
            </div>
            <h4 className="text-lg font-bold mb-3 text-white">
              Analytics & Insights
            </h4>
            <p className="text-gray-400 font-mono text-lg">
              Detailed reporting and performance analytics.
            </p>
          </div>

          <div className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-[#FF2E9F]/20 rounded-lg p-6 hover:border-[#FF2E9F]/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF2E9F]/20 to-[#FF2E9F]/5 flex items-center justify-center mb-4">
              <i className="fas fa-shield-alt text-xl text-[#FF2E9F]"></i>
            </div>
            <h4 className="text-lg font-bold mb-3 text-white">
              Enterprise Security
            </h4>
            <p className="text-gray-400 font-mono text-lg">
              Military-grade encryption and data protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feature;
