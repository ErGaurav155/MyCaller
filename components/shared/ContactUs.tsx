"use client";

import React, { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/lib/validator";
import { toast } from "@/hooks/use-toast";
import { sendSubscriptionEmailToOwner } from "@/lib/action/sendEmail.action";
import Link from "next/link";
import Image from "next/image";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      aineed: "",
      email: "",
      source: "",
      phone: "",
      message: "",
    },
  });

  // Submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      const response = await sendSubscriptionEmailToOwner({
        name: values.name,
        phone: values.phone,
        email: values.email,
        source: values.source,
        aineed: values.aineed,
        message: values.message,
      });

      if (response.status === 200) {
        toast({
          title: "Appointment Booked Successfully",
          description: `We will contact you soon`,
          duration: 2000,
          className: "success-toast",
        });
        form.reset();
      } else {
        toast({
          title: "Appointment booking Failed",
          description: `Please try again`,
          duration: 2000,
          className: "error-toast",
        });
      }
    } catch (error) {
      toast({
        title: "Appointment booking Failed",
        description: `Please try again`,
        duration: 2000,
        className: "error-toast",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 w-full relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A] z-10"></div>
        <Image
          priority
          src="https://readdy.ai/api/search-image?query=cosmic%20space%20scene%20with%20vibrant%20nebula%2C%20distant%20stars%20and%20planets%2C%20deep%20space%20with%20purple%20and%20blue%20cosmic%20clouds%2C%20high%20detail%20digital%20art%20with%20neon%20accents%2C%20perfect%20for%20sci-fi%20website%20background&width=1440&height=500&seq=contact&orientation=landscape"
          alt="Cosmic Space Background"
          height={500}
          width={500}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div className="container mx-auto max-w-4xl p-2 md:px-4  ">
        <div className="text-center mb-12 backdrop-blur-md">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#FF2E9F]">
            Contact Our AiCaller Team
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto font-mono ">
            Have questions about our services? Our team is available anytime.
          </p>
        </div>
        <div className="backdrop-blur-md  border border-[#B026FF]/30 rounded-2xl p-2 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name and Phone Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-300 mb-2">
                        Your Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-gray-800/50 border border-gray-700 text-white rounded-lg py-6 px-4 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]"
                          placeholder="Full Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-300 mb-2">
                        Your Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="bg-gray-800/50 border border-gray-700 text-white rounded-lg py-6 px-4 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]"
                          placeholder="Phone Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Subject and Email Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-300 mb-2">
                        Your Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className="bg-gray-800/50 border border-gray-700 text-white rounded-lg py-6 px-4 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]"
                          placeholder="Enter email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Budget and Address Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-300 mb-2">
                        How You Find Us
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-gray-800/50 border border-gray-700 text-white rounded-lg py-6 px-4 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]">
                          <SelectValue placeholder="Choose Budget" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border border-[#B026FF]/30 backdrop-blur-md">
                          {[
                            "Google",
                            "Youtube",
                            "Ads",
                            "Instagram",
                            "Other",
                          ].map((option) => (
                            <SelectItem
                              key={option}
                              value={option}
                              className="text-white hover:bg-gray-800/50 py-3"
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="aineed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-300 mb-2">
                        AI Call Assistant
                      </FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-gray-800/50 border border-gray-700 text-white rounded-lg py-6 px-4 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]">
                          <SelectValue placeholder="Choose one AI Budget" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border border-[#B026FF]/30 backdrop-blur-md">
                          {["Starter", "Professional", "Enterprise"].map(
                            (option) => (
                              <SelectItem
                                key={option}
                                value={option}
                                className="text-white hover:bg-gray-800/50 py-3"
                              >
                                {option}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Message Field */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-gray-300 mb-2">
                      Your Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        className="bg-gray-800/50 border border-gray-700 text-white rounded-lg py-4 px-4 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]"
                        placeholder="Your Message"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex items-center mb-8">
                <input type="checkbox" id="consent" className="mr-2" />
                <label htmlFor="consent" className="text-gray-300 text-sm">
                  I consent to having my data processed according to the
                  Intergalactic Privacy Policy
                </label>
              </div>
              <div className="pt-4">
                {isSubmitting ? (
                  <Button
                    type="submit"
                    disabled
                    className="w-full py-3 !rounded-button bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
                  >
                    Submitting...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full py-3 !rounded-button bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
                  >
                    Send Message
                  </Button>
                )}
              </div>
              <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00F0FF]/20 to-[#00F0FF]/5 flex items-center justify-center mr-3">
                    <i className="fas fa-envelope text-[#00F0FF]"></i>
                  </div>
                  <a
                    href="mailto:gauravgkhaire@gmail.com"
                    className="text-gray-300 hover:text-[#00F0FF] transition-colors duration-300 text-md md:text-base"
                  >
                    gauravgkhaire@gmail.com
                  </a>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#B026FF]/20 to-[#B026FF]/5 flex items-center justify-center mr-3">
                    <i className="fas fa-satellite-dish text-[#B026FF]"></i>
                  </div>
                  <span className="text-gray-300">
                    <Link href={"/"}>Socail Acco.</Link>
                  </span>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
