"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Building } from 'lucide-react';
import { PricingPlan } from '@/types';

interface PricingCardProps {
  plan: PricingPlan;
  billingCycle: 'monthly' | 'yearly';
  onSubscribe: (plan: PricingPlan, billingCycle: 'monthly' | 'yearly') => void;
  isLoading?: boolean;
}

export default function PricingCard({ 
  plan, 
  billingCycle, 
  onSubscribe, 
  isLoading = false 
}: PricingCardProps) {
  const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const monthlyEquivalent = billingCycle === 'yearly' ? plan.yearlyPrice / 12 : plan.monthlyPrice;
  const savings = billingCycle === 'yearly' ? ((plan.monthlyPrice * 12 - plan.yearlyPrice) / (plan.monthlyPrice * 12)) * 100 : 0;

  const getIcon = () => {
    switch (plan.id) {
      case 'starter': return <Zap className="h-6 w-6" />;
      case 'professional': return <Crown className="h-6 w-6" />;
      case 'enterprise': return <Building className="h-6 w-6" />;
      default: return <Zap className="h-6 w-6" />;
    }
  };

  const getGradient = () => {
    switch (plan.id) {
      case 'starter': return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'professional': return 'from-purple-50 to-pink-50 border-purple-200';
      case 'enterprise': return 'from-gray-50 to-slate-50 border-gray-200';
      default: return 'from-blue-50 to-indigo-50 border-blue-200';
    }
  };

  return (
    <Card className={`relative hover:shadow-xl transition-all duration-300 ${
      plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
    } bg-gradient-to-br ${getGradient()}`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-600 text-white px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
          plan.id === 'starter' ? 'bg-blue-100 text-blue-600' :
          plan.id === 'professional' ? 'bg-purple-100 text-purple-600' :
          'bg-gray-100 text-gray-600'
        }`}>
          {getIcon()}
        </div>
        
        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
        <p className="text-gray-600 mt-2">{plan.description}</p>
        
        <div className="mt-6">
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold">
              ₹{Math.round(monthlyEquivalent)}
            </span>
            <span className="text-gray-500 ml-1">/month</span>
          </div>
          
          {billingCycle === 'yearly' && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Billed ₹{price} yearly
              </p>
              {savings > 0 && (
                <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                  Save {Math.round(savings)}%
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-900">Calls/Month</p>
              <p className="text-gray-600">{plan.callLimit === -1 ? 'Unlimited' : plan.callLimit}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Leads/Month</p>
              <p className="text-gray-600">{plan.leadLimit === -1 ? 'Unlimited' : plan.leadLimit}</p>
            </div>
          </div>
        </div>
        
        <Button
          className="w-full"
          size="lg"
          onClick={() => onSubscribe(plan, billingCycle)}
          disabled={isLoading}
          variant={plan.popular ? "default" : "outline"}
        >
          {isLoading ? 'Processing...' : `Get Started with ${plan.name}`}
        </Button>
      </CardContent>
    </Card>
  );
}