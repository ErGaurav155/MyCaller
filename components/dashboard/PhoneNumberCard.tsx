"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Copy, CheckCircle } from 'lucide-react';

interface PhoneNumberCardProps {
  phoneNumber: string;
  isActive: boolean;
}

export default function PhoneNumberCard({ phoneNumber, isActive }: PhoneNumberCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-blue-600" />
          Your AI Assistant Number
          <Badge 
            variant={isActive ? "default" : "secondary"}
            className={isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
          >
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
          <span className="text-2xl font-mono font-bold text-gray-900">
            {phoneNumber}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>How it works:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Customer calls this number</li>
            <li>System tries to connect to you first</li>
            <li>If you don't answer, AI assistant takes over</li>
            <li>AI collects customer information</li>
            <li>You receive instant notifications</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}