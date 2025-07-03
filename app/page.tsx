import { Phone } from "lucide-react";
import { NavBar } from "@/components/shared/Navbar";
import { HeroSection } from "@/components/shared/HeroSection";
import { WorkFlow } from "@/components/shared/WorkFlow";
import { AiAssiFeature } from "@/components/shared/AiAssiFeature";
import { Pricing } from "@/components/shared/Pricing";
import { Testimonial } from "@/components/shared/Testimonial";
import { Chatbot } from "@/components/shared/Chatbot";
import { Footer } from "@/components/shared/Footer";
import { AboutUs } from "@/components/shared/AboutUs";
import Link from "next/link";
import Feature from "@/components/shared/Feature";
import ContactForm from "@/components/shared/ContactUs";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full m-auto  bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <NavBar />
      <HeroSection />
      <WorkFlow />
      <Feature />
      <AiAssiFeature />

      <Pricing />
      <section className="pb-8 md:pb-16 px-4 sm:px-6 lg:px-8 relative z-30 ">
        <div className="max-w-7xl  mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl text-start md:text-center md:text-4xl font-bold text-[#FF2E9F] mb-6">
                Transform Your Business Communication
              </h2>
              <p className="text-xl text-start md:text-center text-gray-100 mb-8 font-mono">
                Stop losing potential customers to missed calls. Our AI
                assistant ensures every caller gets professional attention, even
                when you are busy.
              </p>

              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] text-sm md:text-base">
                  Never miss a potential customer again{" "}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#B026FF]/10 text-[#B026FF] text-sm md:text-base">
                  24/7 availability for your business{" "}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#FF2E9F]/10 text-[#FF2E9F] text-sm md:text-base">
                  Professional first impression every time{" "}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] text-sm md:text-base">
                  Reduce workload while increasing leads{" "}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#B026FF]/10 text-[#B026FF] text-sm md:text-base">
                  Seamless integration with existing workflow{" "}
                </span>
              </div>
            </div>
            <Link
              href={"/pricing"}
              className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-[#00F0FF]/20 rounded-lg p-6 hover:border-[#00F0FF]/50 transition-all duration-300"
            >
              <div className="flex flex-col gap-2 items-center mb-4">
                <Phone className="h-10 w-10 text-blue-600" />
                <div>
                  <h4 className="text-lg font-bold text-white">
                    Get Your AI Number{" "}
                  </h4>
                  <p className="text-lg text-[#00F0FF] mt-3">
                    +1 (987) 654-3210
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mb-4 font-mono text-lg">
                This is Demo AI assistant number.Get Yours Share it with
                customers or use it in your marketing materials like
                Websites,Social media.
              </p>
            </Link>
          </div>
        </div>
      </section>
      <Testimonial />
      <AboutUs />
      <ContactForm />
      <Chatbot />
      <Footer />
    </div>
  );
}
