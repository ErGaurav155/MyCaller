"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, MapPin, Globe } from 'lucide-react';
import { PricingPlan } from '@/types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan | null;
  billingCycle: 'monthly' | 'yearly';
}

declare global {
  interface Window {
    Razorpay: any;
    paypal: any;
  }
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  plan, 
  billingCycle 
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'paypal'>('razorpay');

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Load PayPal script
    const paypalScript = document.createElement('script');
    paypalScript.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
    paypalScript.async = true;
    document.body.appendChild(paypalScript);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(paypalScript);
    };
  }, []);

  if (!plan) return null;

  const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const usdPrice = Math.round(price * 0.012); // Approximate INR to USD conversion

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: price,
          plan: plan.id,
          billingCycle,
        }),
      });

      const { orderId, amount, currency, key } = await response.json();

      const options = {
        key,
        amount,
        currency,
        name: 'AI Call Assistant',
        description: `${plan.name} Plan - ${billingCycle}`,
        order_id: orderId,
        handler: async (response: any) => {
          const verifyResponse = await fetch('/api/payments/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              userId: 'demo-user-123', // Replace with actual user ID
              plan: plan.id,
              billingCycle,
            }),
          });

          if (verifyResponse.ok) {
            alert('Payment successful! Your subscription is now active.');
            onClose();
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'Demo User',
          email: 'demo@example.com',
          contact: '+919999999999',
        },
        theme: {
          color: '#2563eb',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: usdPrice,
          plan: plan.id,
          billingCycle,
        }),
      });

      const { orderId, approvalUrl } = await response.json();
      
      // Redirect to PayPal for approval
      window.location.href = approvalUrl;
    } catch (error) {
      console.error('PayPal payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Complete Your Subscription</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Plan Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{plan.name} Plan</span>
              <Badge>{billingCycle}</Badge>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span>₹{price}</span>
            </div>
            {billingCycle === 'yearly' && (
              <p className="text-sm text-green-600 mt-1">
                Save ₹{(plan.monthlyPrice * 12) - plan.yearlyPrice} with yearly billing
              </p>
            )}
          </div>

          <Separator />

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <h3 className="font-medium">Choose Payment Method</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={paymentMethod === 'razorpay' ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => setPaymentMethod('razorpay')}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">India</span>
                </div>
                <span className="text-xs text-gray-600">Razorpay</span>
                <span className="font-bold">₹{price}</span>
              </Button>
              
              <Button
                variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => setPaymentMethod('paypal')}
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">International</span>
                </div>
                <span className="text-xs text-gray-600">PayPal</span>
                <span className="font-bold">${usdPrice}</span>
              </Button>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={paymentMethod === 'razorpay' ? handleRazorpayPayment : handlePayPalPayment}
            disabled={isProcessing}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {isProcessing ? 'Processing...' : `Pay with ${paymentMethod === 'razorpay' ? 'Razorpay' : 'PayPal'}`}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Your subscription will be activated immediately after successful payment.
            You can cancel anytime from your dashboard.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}