import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Bot,
  Users,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Star,
  Crown,
  Building,
  Equal,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Phone,
      title: "Smart Call Routing",
      description:
        "Automatically tries to connect callers to you first, then seamlessly transfers to AI if unavailable.",
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description:
        "Intelligent conversation flows that collect customer information professionally and naturally.",
    },
    {
      icon: Users,
      title: "Lead Management",
      description:
        "Centralized dashboard to view, manage, and track all leads captured by your AI assistant.",
    },
    {
      icon: MessageSquare,
      title: "Instant Notifications",
      description:
        "Get immediate SMS alerts when new leads are captured, so you never miss an opportunity.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description:
        "Track conversion rates, call volumes, and lead quality with comprehensive reporting.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-level encryption and security measures to protect your customer data.",
    },
  ];

  const benefits = [
    "Never miss a potential customer again",
    "24/7 availability for your business",
    "Professional first impression every time",
    "Reduce workload while increasing leads",
    "Seamless integration with existing workflow",
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "₹2,999",
      period: "/month",
      description: "Perfect for small businesses",
      features: [
        "500 calls/month",
        "Basic AI responses",
        "Email notifications",
        "Dashboard access",
      ],
      icon: Zap,
      color: "blue",
    },
    {
      name: "Professional",
      price: "₹5,999",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "2,000 calls/month",
        "Custom AI responses",
        "SMS + Email alerts",
        "Advanced analytics",
      ],
      icon: Crown,
      color: "purple",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "₹12,999",
      period: "/month",
      description: "For high-volume businesses",
      features: [
        "Unlimited calls",
        "Multi-language support",
        "API access",
        "24/7 support",
      ],
      icon: Building,
      color: "gray",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                AI Call Assistant
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                System Active
              </Badge>
              <Link href="/pricing">
                <Button variant="outline">Pricing</Button>
              </Link>
              <Link href="/dashboard">
                <Button>
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Button variant="outline">
              <Equal className="flex md:hidden items-center gap-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              <Zap className="h-3 w-3 mr-1" />
              Never Miss a Lead Again
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your AI Assistant
              <span className="text-blue-600 block">Always Answers</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform missed calls into qualified leads with our intelligent
              AI assistant. When you can not answer, our AI steps in to
              professionally handle inquiries and collect customer information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button size="lg" className="text-lg px-8 py-3">
                  View Pricing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                <Phone className="mr-2 h-5 w-5" />
                Call Demo: +1 (555) 123-4567
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, seamless, and smart - here is how your AI assistant works
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Customer Calls</h3>
              <p className="text-gray-600">
                A potential customer calls your dedicated AI assistant number.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Smart Routing</h3>
              <p className="text-gray-600">
                System tries to reach you first. If unavailable, AI takes over
                seamlessly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                3. AI Collects Info
              </h3>
              <p className="text-gray-600">
                AI professionally gathers contact details and requirements, then
                notifies you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to capture and manage leads effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Choose the perfect plan for your business needs
            </p>
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                View All Plans & Features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {pricingPlans.map((plan, index) => {
              const Icon = plan.icon;
              const colorClasses = {
                blue: "from-blue-50 to-indigo-50 border-blue-200 text-blue-600 bg-blue-100",
                purple:
                  "from-purple-50 to-pink-50 border-purple-200 text-purple-600 bg-purple-100",
                gray: "from-gray-50 to-slate-50 border-gray-200 text-gray-600 bg-gray-100",
              };

              return (
                <Card
                  key={index}
                  className={`relative hover:shadow-xl transition-all duration-300 ${
                    plan.popular ? "ring-2 ring-blue-500 scale-105" : ""
                  } bg-gradient-to-br ${colorClasses[
                    plan.color as keyof typeof colorClasses
                  ]
                    .split(" ")
                    .slice(0, 2)
                    .join(" ")} ${
                    colorClasses[plan.color as keyof typeof colorClasses].split(
                      " "
                    )[2]
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${colorClasses[
                        plan.color as keyof typeof colorClasses
                      ]
                        .split(" ")
                        .slice(-2)
                        .join(" ")}`}
                    >
                      <Icon className="h-8 w-8" />
                    </div>

                    <CardTitle className="text-2xl font-bold">
                      {plan.name}
                    </CardTitle>
                    <p className="text-gray-600 mt-2">{plan.description}</p>

                    <div className="mt-6">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-gray-500 ml-1">
                          {plan.period}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/pricing" className="block">
                      <Button
                        className="w-full mt-6"
                        size="lg"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Transform Your Business Communication
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Stop losing potential customers to missed calls. Our AI
                assistant ensures every caller gets professional attention, even
                when you are busy.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Your AI Number
                  </h3>
                  <div className="text-3xl font-mono font-bold text-blue-600 mb-4">
                    +1 (987) 654-3210
                  </div>
                  <p className="text-gray-600 text-sm">
                    This is your dedicated AI assistant number. Share it with
                    customers or use it in your marketing materials.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands of Businesses
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say about their results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rajesh Kumar",
                company: "Kumar Electronics",
                content:
                  "Our lead conversion increased by 40% after implementing the AI assistant. Never miss a customer call again!",
                rating: 5,
              },
              {
                name: "Priya Sharma",
                company: "Sharma Consultancy",
                content:
                  "The professional plan is perfect for our growing business. The AI sounds so natural, customers love it.",
                rating: 5,
              },
              {
                name: "Amit Patel",
                company: "Patel Services",
                content:
                  "ROI was positive within the first month. The system pays for itself with just a few converted leads.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">{testimonial.content}</p>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {testimonial.company}
                    </p>
                  </div>
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
            Ready to Never Miss Another Lead?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start capturing more leads today with your intelligent AI assistant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-3"
              >
                View Pricing Plans
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Phone className="mr-2 h-5 w-5" />
              Test Call Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">AI Call Assistant</span>
            </div>
            <p className="text-gray-400">
              © 2024 AI Call Assistant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
