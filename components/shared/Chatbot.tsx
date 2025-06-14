"use client";
import React, { useState } from "react";

export function Chatbot() {
  const [showChatbot, setShowChatbot] = useState(false);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };
  return (
    <div>
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          showChatbot ? "scale-100" : "scale-0"
        }`}
      >
        <div className="w-80 h-96 rounded-lg overflow-hidden backdrop-blur-lg bg-[#0A0A0A]/80 border border-[#00F0FF]/30 shadow-lg shadow-[#00F0FF]/20">
          <div className="h-12 bg-gradient-to-r from-[#00F0FF] to-[#B026FF] flex items-center justify-between px-4">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center mr-2">
                <i className="fas fa-meteor text-xs text-white"></i>
              </div>
              <span className="text-black font-medium">Comet Guide</span>
            </div>
            <button
              className="text-black hover:text-white transition-colors cursor-pointer !rounded-button whitespace-nowrap"
              onClick={toggleChatbot}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div
            className="h-72 p-4 overflow-y-auto no-scrollbar"
            style={{
              backgroundImage:
                'url("https://readdy.ai/api/search-image?query=deep%20space%20starfield%20with%20distant%20stars%20and%20subtle%20nebula%2C%20dark%20cosmic%20background%20with%20tiny%20stars%2C%20perfect%20for%20chat%20background&width=320&height=300&seq=chatbg&orientation=squarish")',
              backgroundSize: "cover",
            }}
          >
            <div className="bg-[#00F0FF]/10 backdrop-blur-sm rounded-lg p-3 mb-3 max-w-[80%]">
              <p className="text-[#00F0FF] text-sm">
                Hello, cosmic traveler! I am your AI assistant. How can I help
                you navigate our services today?
              </p>
            </div>
            <div className="flex justify-end mb-3">
              <div className="bg-[#B026FF]/10 backdrop-blur-sm rounded-lg p-3 max-w-[80%]">
                <p className="text-[#B026FF] text-sm">
                  I need help with call assistant packages.
                </p>
              </div>
            </div>
            <div className="bg-[#00F0FF]/10 backdrop-blur-sm rounded-lg p-3 mb-3 max-w-[80%]">
              <p className="text-[#00F0FF] text-sm">
                Great! We offer several AI call assistant packages. Would you
                like to explore our Quantum Call Assistant or something more
                specialized?
              </p>
            </div>
          </div>
          <div className="h-12 border-t border-[#00F0FF]/20 flex items-center px-3">
            <div className="flex-1 bg-[#1A1A1A] rounded-full flex items-center px-3 py-1">
              <input
                type="text"
                placeholder="Type your message..."
                className="bg-transparent border-none text-sm text-gray-300 flex-1 focus:outline-none"
              />
              <button className="text-[#00F0FF] ml-2 cursor-pointer !rounded-button whitespace-nowrap">
                <i className="fas fa-microphone"></i>
              </button>
            </div>
            <button className="ml-2 w-8 h-8 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#B026FF] flex items-center justify-center text-black cursor-pointer !rounded-button whitespace-nowrap">
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      </div>
      <button
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#B026FF] flex items-center justify-center shadow-lg shadow-[#00F0FF]/20 cursor-pointer !rounded-button whitespace-nowrap"
        onClick={toggleChatbot}
        style={{ display: showChatbot ? "none" : "flex" }}
      >
        <div className="absolute w-full h-full rounded-full bg-gradient-to-r from-[#00F0FF] to-[#B026FF] animate-ping opacity-50"></div>
        <i className="fas fa-comment-dots text-2xl text-black"></i>
      </button>
    </div>
  );
}
