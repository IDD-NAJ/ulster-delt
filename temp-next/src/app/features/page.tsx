'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FeaturesPage() {
  const features = [
    {
      title: "Smart Banking",
      description: "Experience banking designed for the digital age with real-time notifications and insights.",
      icon: "💳",
    },
    {
      title: "Instant Transfers",
      description: "Send and receive money instantly, 24/7, with zero fees within the Ulster Delt network.",
      icon: "⚡",
    },
    {
      title: "Budgeting Tools",
      description: "Take control of your finances with our advanced budgeting and spending analytics.",
      icon: "📊",
    },
    {
      title: "Savings Goals",
      description: "Set and achieve your financial goals with automated savings features.",
      icon: "🎯",
    },
    {
      title: "Security First",
      description: "Bank with confidence knowing your money is protected by state-of-the-art security.",
      icon: "🔒",
    },
    {
      title: "24/7 Support",
      description: "Get help whenever you need it with our round-the-clock customer support.",
      icon: "🤝",
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Features</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover why Ulster Delt is the future of banking with our innovative features designed for modern life.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-lg border border-gray-200 hover:border-primary transition-colors"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button asChild>
          <Link href="/register">Get Started Today</Link>
        </Button>
      </div>
    </div>
  );
} 