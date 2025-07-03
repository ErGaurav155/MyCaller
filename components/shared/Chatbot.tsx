"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowPathIcon,
  ChatBubbleLeftIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema1 } from "@/lib/validator";
import { generateGptResponse } from "@/lib/action/ai.action";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "AI Bot",
      text: "Hello, cosmic traveler! I am your AI assistant. How can I help you navigate our services today?",
    },
    { sender: "You", text: "What services did you provide?" },
  ]);
  const [submit, setSubmit] = useState(false);

  const toggleOpen = () => setOpen((cur) => !cur);

  const form = useForm<z.infer<typeof formSchema1>>({
    resolver: zodResolver(formSchema1),
    defaultValues: {
      message: "",
    },
  });

  // Submit handler
  const onSubmit = async (values: z.infer<typeof formSchema1>) => {
    const { message } = values;
    setSubmit(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "You", text: message },
    ]);

    form.reset({ message: "" });

    try {
      const response = await generateGptResponse({
        userInput: message,
      });

      if (response) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "AI Bot", text: response },
        ]);
      } else {
        toast({
          title: "Content Warning",
          duration: 2000,
          className: "error-toast",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "AI Bot", text: "Sorry, something went wrong!" },
      ]);
    } finally {
      setSubmit(false);
    }
  };

  const restartChat = () => {
    setMessages([
      {
        sender: "AI Bot",
        text: "Hello, cosmic traveler! I am your AI assistant. How can I help you navigate our services today?",
      },
      { sender: "You", text: "What services did you provide?" },
    ]);
  };

  return (
    <div className="h-auto w-auto flex flex-col">
      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-1 md:right-6 z-50 w-[19rem] sm:w-80 md:w-96 min-h-max h-96 md:h-[28rem] rounded-lg overflow-hidden backdrop-blur-lg bg-[#0A0A0A]/80 border border-[#00F0FF]/30 shadow-lg shadow-[#00F0FF]/20">
          {/* Header */}
          <div className="h-12 bg-gradient-to-r from-[#00F0FF] to-[#B026FF] flex items-center justify-between px-4">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center mr-2">
                <SparklesIcon className="text-white w-4 h-4" />
              </div>
              <span className="text-black font-medium">Comet Guide</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="text-black hover:text-white transition-colors cursor-pointer !rounded-button whitespace-nowrap"
                onClick={restartChat}
              >
                <ArrowPathIcon className="w-5 h-5" />
              </button>
              <button
                className="text-black hover:text-white transition-colors cursor-pointer !rounded-button whitespace-nowrap"
                onClick={toggleOpen}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages container */}
          <div
            className="h-80 p-4 overflow-y-auto no-scrollbar"
            style={{
              backgroundImage:
                'url("https://readdy.ai/api/search-image?query=deep%20space%20starfield%20with%20distant%20stars%20and%20subtle%20nebula%2C%20dark%20cosmic%20background%20with%20tiny%20stars%2C%20perfect%20for%20chat%20background&width=320&height=300&seq=chatbg&orientation=squarish")',
              backgroundSize: "cover",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex mb-3 ${
                  msg.sender === "You" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg p-3 max-w-[80%] backdrop-blur-sm ${
                    msg.sender === "You" ? "bg-[#B026FF]/10" : "bg-[#00F0FF]/10"
                  }`}
                >
                  <p
                    className={`text-sm font-mono ${
                      msg.sender === "You" ? "text-[#B026FF]" : "text-[#00F0FF]"
                    }`}
                  >
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input area */}
          <div className="h-auto border-t border-[#00F0FF]/20 flex flex-col items-center justify-center  px-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex items-center justify-center mt-4"
              >
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="flex-1 bg-[#1A1A1A] rounded-lg flex items-center px-3 py-1">
                          <input
                            type="text"
                            placeholder="Type your message..."
                            className="bg-transparent border-none p-2 text-sm text-gray-300 flex-1 focus:outline-none"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <button
                  type="submit"
                  disabled={submit}
                  className="ml-2 w-8 h-8 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#B026FF] flex items-center justify-center text-black cursor-pointer !rounded-button whitespace-nowrap"
                >
                  {submit ? (
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                  )}
                </button>
              </form>
            </Form>
            <Link
              target="_blank"
              href="https://ainspiretech.com/"
              className="text-xs text-gray-400 hover:text-[#00F0FF] transition-colors"
            >
              Powered by AinspireTech
            </Link>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        className="fixed bottom-6 right-6 z-50 w-12 md:w-16 h-12 md:h-16 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#B026FF] flex items-center justify-center shadow-lg shadow-[#00F0FF]/20"
        onClick={toggleOpen}
        style={{ display: open ? "none" : "flex" }}
      >
        <div className="absolute w-full h-full rounded-full bg-gradient-to-r from-[#00F0FF] to-[#B026FF] animate-ping opacity-50"></div>
        <ChatBubbleLeftIcon className="text-white h-6 md:h-8 w-6 md:w-8" />
      </button>
    </div>
  );
}
