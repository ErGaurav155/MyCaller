"use client";
import React, { useEffect, useState } from "react";
import { Navbar, Collapse, IconButton } from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import Logo from "/public/assets/img/file.png";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignedIn, SignedOut, useAuth, UserButton } from "@clerk/nextjs";
import { ArrowRight, Phone } from "lucide-react";

export function NavBar() {
  const [openNav, setOpenNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const router = useRouter();
  const { userId } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      // Add or remove the rounded style based on scroll position
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 540) {
        setOpenNav(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-1 sm:mb-2 sm:mt-2 lg:mb-0  lg:mt-0 md:flex-row items-center justify-evenly sm:gap-1 md:gap-2   text-black w-full ">
      <li className="flex-auto  p-[1px]">
        <Link href="/">
          <Button variant="outline">Home</Button>
        </Link>
      </li>
      <li className="flex-auto  p-[1px]">
        <Link href="/Feature">
          <Button variant="outline">Feature</Button>
        </Link>
      </li>
      <li className="flex-auto  p-[1px]">
        <Link href="/pricing">
          <Button variant="outline">Pricing</Button>
        </Link>
      </li>
      <li className="flex-auto  p-[1px]">
        <Link href="/reivew">
          <Button variant="outline">Review</Button>
        </Link>
      </li>
      <li className="flex-auto  p-[1px]">
        <Link href="/aboutus">
          <Button variant="outline">AboutUs</Button>
        </Link>
      </li>
    </ul>
  );

  return (
    <Navbar
      className={` w-full m-auto sticky top-0 z-10  transition-all duration-300     ${
        isScrolled ? "rounded-lg shadow-md" : "rounded-none"
      }`}
    >
      <div className=" w-full max-w-7xl m-auto">
        <div className="flex items-center w-full justify-center text-black">
          <Link
            href="/"
            className="w-1/2   md:w-1/6  cursor-pointer py-1.5 font-bold text-xl"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                AI Call Assistant
              </span>
            </div>{" "}
            {/* <Image
            alt="image"
            className="flex-1 object-contain "
            src={Logo}
            width={250}
            height={250}
            priority
          /> */}
          </Link>
          <div className="hidden md:flex   w-1/2  md:w-5/6  items-center gap-3 justify-end ">
            <div className="  w-9/12  lg:w-8/12">{navList}</div>

            <SignedIn>
              <Button
                size="lg"
                color="white"
                onClick={() => router.push("/UserDashboard")}
                className="text-white 
            w-2/12 py-2 px-1 border text-center  border-white shadow-sm shadow-blue-gray-800"
              >
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <SignedOut>
              <Button
                size="lg"
                color="white"
                onClick={() => router.push("/contactUs")}
                className="text-white 
              w-2/12 py-2 px-1 border text-center  border-white shadow-sm shadow-blue-gray-800"
              >
                ContactUs
              </Button>
              <Button
                size="lg"
                color="white"
                onClick={() => router.push("/sign-up")}
                className="text-white 
           
               w-2/12  py-2 px-1 border  bg-blue-700 hover:bg-blue-900  text-center  border-white shadow-sm shadow-blue-gray-800 "
              >
                Login
              </Button>
            </SignedOut>
          </div>

          <IconButton
            variant="text"
            className="w-6/12 text-black md:hidden "
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-6 w-6" strokeWidth={2} />
            )}
          </IconButton>
        </div>
        <Collapse open={openNav}>
          {navList}

          <SignedIn>
            <div className="flex items-center justify-center gap-2">
              <Button
                size="lg"
                color="white"
                onClick={() => router.push("/UserDashboard")}
                className="text-white 
            w-full py-2 px-1 border text-center  border-white shadow-sm shadow-blue-gray-800"
              >
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="flex items-center justify-center bg-white rounded p-[3px]">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </SignedIn>
          <SignedOut>
            <Button
              size="lg"
              color="white"
              onClick={() => router.push("/contactUs")}
              className="text-white 
               py-2 px-1 border text-center w-full border-white shadow-sm shadow-blue-gray-800"
            >
              ContactUs
            </Button>
            <Button
              size="lg"
              color="white"
              onClick={() => router.push("/sign-up")}
              className="text-white 
              white
                py-2 mt-1 px-1 border bg-blue-700 hover:bg-blue-900 text-center w-full border-white shadow-sm shadow-blue-gray-800 "
            >
              Login
            </Button>
          </SignedOut>
        </Collapse>
      </div>
    </Navbar>
  );
}
