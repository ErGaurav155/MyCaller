import { Footer } from "@/components/shared/Footer";
import { NavBar } from "@/components/shared/Navbar";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Thumbnail Generator & Tools",
  description:
    "Discover the best free AI tools for generating YouTube thumbnails, downloading in 4K, and more.",
  keywords: ["free a i image generator"],
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="root ">
      <NavBar />

      <div className="root-container no-scrollbar">{children}</div>
      <Footer />
    </main>
  );
};

export default Layout;
