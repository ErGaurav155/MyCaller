import Faq from "@/components/shared/Faq";
import { Testimonial } from "@/components/shared/Testimonial";
import React from "react";

const ReviewSec = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="wrapper2 w-full  backdrop-blur-md">
        <Testimonial />
        <Faq />
      </div>
    </div>
  );
};

export default ReviewSec;
