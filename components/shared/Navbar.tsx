"use client";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleNavClick = (navItem: string) => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky px-5  lg:px-10  top-0 z-50 backdrop-blur-lg bg-black border-b border-[#00F0FF]/20">
      <div className=" mx-auto px-4 max-w-7xl py-4 flex justify-between gap-1 lg:gap-2 items-center">
        {/* Logo */}
        <Link href={"/"} className="flex items-center">
          <div className="relative w-7 h-7 lg:w-10 lg:h-10 mr-1 lg:mr-2">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#B026FF] animate-pulse"></div>
            <div className="absolute inset-1 rounded-full bg-[#0A0A0A] flex items-center justify-center">
              <i className="fas fa-satellite text-[#00F0FF] h-4 w-4"></i>
            </div>
          </div>
          <h1 className="text-base lg:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#FF2E9F]">
            Catch<span className="text-[#B026FF]">Customer</span>
            <span>Call</span>
          </h1>
        </Link>
        {/* Desktop Orbital Navigation */}
        <nav className="hidden md:flex justify-evenly items-center space-x-5 lg:space-x-8 font-medium text-sm">
          {[
            { id: "/Features", label: "Features" },
            { id: "/pricing", label: "Pricing" },
            { id: "/Review", label: "Reviews" },
            { id: "/contactUs", label: "Contact Us" },
          ].map((item) => (
            <Link
              key={item.id}
              href={`${item.id}`}
              className={` relative group cursor-pointer text-white hover:text-[#00F0FF] transition-colors`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="hover:text-[#00F0FF] transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        {/* Auth & Language Buttons */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="hidden  lg:block  relative">
            <button className="flex items-center space-x-1 text-sm text-[#B026FF] hover:text-[#FF2E9F] transition-colors cursor-pointer whitespace-nowrap !rounded-button">
              <i className="fas fa-globe text-[#00F0FF]"></i>
              <span>EN</span>
              <i className="fas fa-chevron-down text-xs"></i>
            </button>
          </div>
          {/* Login Button */}
          <SignedOut>
            <Link
              href={"/sign-in"}
              className="hidden md:flex px-4 py-2 !rounded-button bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
            >
              <i className="fas fa-user-astronaut mr-2 self-center"></i>
              Login
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href={"/dashboard1"}
              className="hidden md:flex px-2 lg:px-4 py-2 !rounded-button bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
            >
              <i className="fas fa-user-astronaut mr-2 self-center"></i>
              Dashboard
            </Link>
            <div className="block text-white  ">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
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
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4 backdrop-blur-lg">
          {[
            { id: "Features", label: "Features" },
            { id: "pricing", label: "Pricing" },
            { id: "Review", label: "Reviews" },
            { id: "contactUs", label: "Contact Us" },
          ].map((item) => (
            <Link
              key={item.id}
              href={`/${item.id}`}
              className={`text-white hover:text-[#00F0FF] transition-colors cursor-pointer `}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </Link>
          ))}
          <SignedOut>
            <Button
              onClick={() => {
                router.push("/sign-in");
              }}
              className="px-4 py-2  bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-white font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
            >
              <i className="fas fa-user-astronaut mr-2 self-center"></i>
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            <Button
              onClick={() => {
                router.push("/dashboard1");
              }}
              className="flex px-4 py-2  bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-white font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
            >
              <i className="fas fa-user-astronaut mr-2 self-center"></i>
              Dashboard
            </Button>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
