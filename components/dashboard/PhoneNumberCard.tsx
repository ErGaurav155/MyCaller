"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Copy, CheckCircle } from "lucide-react";
import Link from "next/link";

interface PhoneNumberCardProps {
  phoneNumber: string;
  isActive: boolean;
}

export default function PhoneNumberCard({
  phoneNumber,
  isActive,
}: PhoneNumberCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Card className="bg-[#0a0a0a]/60 backdrop-blur-sm border border-[#00F0FF]/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Phone className="h-5 w-5 text-[#00F0FF]" />
          Your AI Assistant Number
          <Badge
            className={
              isActive
                ? "bg-green-900/20 text-green-400 border-green-400/20"
                : "bg-gray-900/20 text-gray-400 border-gray-400/20"
            }
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between p-4 bg-[#0a0a0a]/80 backdrop-blur-sm rounded-lg border border-[#333]">
          <span className="text-2xl font-mono font-bold text-white">
            {phoneNumber ? (
              phoneNumber
            ) : (
              <Link href={"/pricing"}>
                <span className="text-base ">no number </span>
                <Button className="text-[#00F0FF]  ">Buy a number</Button>
              </Link>
            )}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center gap-2 bg-transparent border-[#333] text-white hover:bg-[#00F0FF]/10 hover:border-[#00F0FF] hover:text-white"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 text-[#00F0FF]" />
                <span className="text-[#00F0FF]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
        <div className="text-sm text-gray-400 space-y-2">
          <p>
            <strong className="text-white">How it works:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm font-mono ">
            <li>Customer calls this number</li>
            <li>System tries to connect to you first</li>
            <li>If you do not answer, AI handles call</li>
            <li>AI collects customer information</li>
            <li>You receive instant notifications</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
