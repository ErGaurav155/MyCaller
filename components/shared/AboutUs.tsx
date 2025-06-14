import React from "react";

import Image from "next/image";

export function AboutUs() {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="relative w-full h-80 md:h-96">
              <Image
                src="https://readdy.ai/api/search-image?query=futuristic%20space%20station%20headquarters%20with%20holographic%20displays%20and%20advanced%20technology%2C%20cosmic%20view%20with%20earth%20visible%20through%20large%20windows%2C%20sci-fi%20corporate%20office%20with%20blue%20and%20purple%20lighting%2C%20high%20tech%20visualization&width=600&height=500&seq=about&orientation=landscape"
                alt="NebulaCom Headquarters"
                height={500}
                width={500}
                className="w-full h-full object-cover object-top rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent"></div>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#B026FF]">
              About NebulaCom3047
            </h2>
            <p className="text-gray-300 mb-6">
              Founded in the year 3047, NebulaCom has been at the forefront of
              interstellar communication technology for over two decades. Our
              mission is to connect civilizations across the cosmos with
              seamless, intelligent communication solutions.
            </p>
            <p className="text-gray-300 mb-6">
              With headquarters in the Orion Nebula and offices across 17 star
              systems, we are uniquely positioned to understand the diverse
              communication needs of the modern galactic community.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <div className="text-[#00F0FF] text-3xl font-bold">500+</div>
                <div className="text-gray-400">Star Systems</div>
              </div>
              <div>
                <div className="text-[#B026FF] text-3xl font-bold">12,000+</div>
                <div className="text-gray-400">Languages Supported</div>
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
            <button className="px-6 py-3 !rounded-button bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer">
              Learn More About Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
