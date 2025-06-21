import ContactForm from "@/components/shared/ContactUs";
import Faq from "@/components/shared/Faq";
import React from "react";

const ContactSec = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="wrapper2 w-full  backdrop-blur-md">
        <ContactForm />
        <Faq />
      </div>
    </div>
  );
};

export default ContactSec;
