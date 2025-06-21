import Faq from "@/components/shared/Faq";
import Feature from "@/components/shared/Feature";
import React from "react";

const FeaatureSec = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="wrapper2 w-full  backdrop-blur-md">
        <Feature />
        <Faq />
      </div>
    </div>
  );
};

export default FeaatureSec;
