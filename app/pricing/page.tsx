"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Phone, 
  ArrowLeft, 
  Check, 
  Star,
  Users,
  Headphones,
  Shield,
  Zap
} from 'lucide-react';
import PricingCard from '@/components/pricing/PricingCard';
import PaymentModal from '@/components/pricing/PaymentModal';
import { PricingPlan } from '@/types';

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small businesses getting started',
    monthlyPrice: 2999,
    yearlyPrice: 29990,
    callLimit: 500,
    leadLimit: 100,
    features: [
      '500 AI-handled calls per month',
      'Basic lead collection',
      'Email notifications',
      'Standard AI responses',
      'Dashboard access',
      'Phone support'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for growing businesses',
    monthlyPrice: 5999,
    yearlyPrice: 59990,
    callLimit: 2000,
    leadLimit: 500,
    popular: true,
    features: [
      '2,000 AI-handled calls per month',
      'Advanced lead collection',
      'SMS + Email notifications',
      'Custom AI responses',
      'Advanced analytics',
      'CRM integrations',
      'Priority support',
      'Call recordings'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large businesses with high volume',
    monthlyPrice: 12999,
    yearlyPrice: 129990,
    callLimit: -1,
    leadLimit: -1,
    features: [
      'Unlimited AI-handled calls',
      'Unlimited lead storage',
      'Multi-language support',
      'Custom AI training',
      'White-label solution',
      'API access',
      'Dedicated account manager',
      '24/7 premium support',
      'Custom integrations'
    ]
  }
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleSubscribe = (plan: PricingPlan, cycle: 'monthly' | 'yearly') => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "Kumar Electronics",
      content: "Our lead conversion increased by 40% after implementing the AI assistant. Never miss a customer call again!",
      rating: 5
    },
    {
      name: "Priya Sharma",
      company: "Sharma Consultancy",
      content: "The professional plan is perfect for our growing business. The AI sounds so natural, customers love it.",
      rating: 5
    },
    {
      name: "Amit Patel",
      company: "Patel Services",
      content: "ROI was positive within the first month. The system pays for itself with just a few converted leads.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">AI Call Assistant</span>
              </div>
            </div>
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
            <Zap className="h-3 w-3 mr-1" />
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start capturing more leads today. No setup fees, no hidden costs. 
            Cancel anytime.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={billingCycle === 'yearly'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
            />
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            <Badge className="bg-green-100 text-green-800 border-green-200 ml-2">
              Save up to 17%
            </Badge>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                billingCycle={billingCycle}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compare All Features
            </h2>
            <p className="text-xl text-gray-600">
              See what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Starter</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Professional</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { feature: 'AI-handled calls per month', starter: '500', professional: '2,000', enterprise: 'Unlimited' },
                  { feature: 'Lead storage', starter: '100', professional: '500', enterprise: 'Unlimited' },
                  { feature: 'Email notifications', starter: '✓', professional: '✓', enterprise: '✓' },
                  { feature: 'SMS notifications', starter: '✗', professional: '✓', enterprise: '✓' },
                  { feature: 'Custom AI responses', starter: '✗', professional: '✓', enterprise: '✓' },
                  { feature: 'Call recordings', starter: '✗', professional: '✓', enterprise: '✓' },
                  { feature: 'Advanced analytics', starter: '✗', professional: '✓', enterprise: '✓' },
                  { feature: 'CRM integrations', starter: '✗', professional: '✓', enterprise: '✓' },
                  { feature: 'Multi-language support', starter: '✗', professional: '✗', enterprise: '✓' },
                  { feature: 'API access', starter: '✗', professional: '✗', enterprise: '✓' },
                  { feature: 'White-label solution', starter: '✗', professional: '✗', enterprise: '✓' },
                  { feature: 'Support', starter: 'Email', professional: 'Priority', enterprise: '24/7 Dedicated' },
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
                    <td className="py-4 px-6 text-center">
                      {row.starter === '✓' ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : 
                       row.starter === '✗' ? <span className="text-gray-400">—</span> : row.starter}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {row.professional === '✓' ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : 
                       row.professional === '✗' ? <span className="text-gray-400">—</span> : row.professional}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {row.enterprise === '✓' ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : 
                       row.enterprise === '✗' ? <span className="text-gray-400">—</span> : row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of businesses already using our AI assistant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Can I change my plan anytime?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept Razorpay for Indian customers and PayPal for international customers."
              },
              {
                question: "Is there a setup fee?",
                answer: "No, there are no setup fees or hidden costs. You only pay the monthly or yearly subscription."
              },
              {
                question: "Can I cancel anytime?",
                answer: "Yes, you can cancel your subscription at any time. No questions asked."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee if you're not satisfied with our service."
              },
              {
                question: "How quickly can I get started?",
                answer: "You can be up and running within 5 minutes of subscribing. No technical setup required."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses that never miss a lead
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 py-3"
              onClick={() => handleSubscribe(pricingPlans[1], billingCycle)}
            >
              Start Free Trial
            </Button>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={selectedPlan}
        billingCycle={billingCycle}
      />
    </div>
  );
}