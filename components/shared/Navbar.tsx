"use client";
import Link from "next/link";
import React, { useState } from "react";

export function NavBar() {
  const [activeNavItem, setActiveNavItem] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleNavClick = (navItem: string) => {
    setActiveNavItem(navItem);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky px-5  lg:px-10  top-0 z-50 backdrop-blur-lg bg-black border-b border-[#00F0FF]/20">
      <div className=" mx-auto px-4 max-w-7xl py-4 flex justify-between gap-2 items-center">
        {/* Logo */}
        <div className="flex items-center">
          <div className="relative w-10 h-10 mr-3">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#B026FF] animate-pulse"></div>
            <div className="absolute inset-1 rounded-full bg-[#0A0A0A] flex items-center justify-center">
              <i className="fas fa-satellite text-[#00F0FF]"></i>
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#FF2E9F]">
            AiCall<span className="text-[#B026FF]">er</span>
          </h1>
        </div>
        {/* Desktop Orbital Navigation */}
        <nav className="hidden md:flex justify-evenly items-center space-x-8">
          {[
            { id: "features", label: "Features" },
            { id: "pricing", label: "Pricing" },
            { id: "reviews", label: "Reviews" },
            { id: "contact", label: "Contact Us" },
          ].map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className={`nav-link relative group cursor-pointer ${
                activeNavItem === item.id ? "text-[#00F0FF]" : "text-white"
              }`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="hover:text-[#00F0FF] transition-colors">
                {item.label}
              </span>
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-[#00F0FF] transition-all duration-300 ${
                  activeNavItem === item.id
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ))}
        </nav>
        {/* Auth & Language Buttons */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative">
            <button className="flex items-center space-x-1 text-sm text-[#B026FF] hover:text-[#FF2E9F] transition-colors cursor-pointer whitespace-nowrap !rounded-button">
              <i className="fas fa-globe text-[#00F0FF]"></i>
              <span>EN</span>
              <i className="fas fa-chevron-down text-xs"></i>
            </button>
          </div>
          {/* Login Button */}
          <button className="hidden md:flex px-4 py-2 !rounded-button bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer">
            <i className="fas fa-user-astronaut mr-2"></i>
            Login
          </button>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-[#00F0FF] cursor-pointer !rounded-button whitespace-nowrap"
            onClick={toggleMenu}
          >
            <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4 bg-[#0A0A0A]/80 backdrop-blur-lg">
          {[
            { id: "home", label: "Home" },
            { id: "assistant", label: "AI Call Assistant" },
            { id: "features", label: "Features" },
            { id: "pricing", label: "Pricing" },
            { id: "reviews", label: "Reviews" },
            { id: "about", label: "About Us" },
            { id: "contact", label: "Contact Us" },
          ].map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className={`text-white hover:text-[#00F0FF] transition-colors cursor-pointer ${
                activeNavItem === item.id ? "text-[#00F0FF]" : ""
              }`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </Link>
          ))}
          <button className="px-4 py-2 !rounded-button bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer">
            <i className="fas fa-user-astronaut mr-2"></i>
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
