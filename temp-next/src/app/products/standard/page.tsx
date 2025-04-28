'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function StandardProductsPage() {
  const products = [
    {
      title: "Current Accounts",
      description: "Everyday banking with smart features and rewards",
      features: [
        "No monthly fees",
        "Mobile and online banking",
        "Contactless debit card",
        "Overdraft available",
      ],
      cta: "Open Account",
      link: "/products/current-accounts",
      icon: "💳",
    },
    {
      title: "Savings Accounts",
      description: "Grow your money with competitive interest rates",
      features: [
        "High interest rates",
        "Flexible access options",
        "Regular saver bonuses",
        "Goal-based savings",
      ],
      cta: "Start Saving",
      link: "/products/savings",
      icon: "💰",
    },
    {
      title: "Credit Cards",
      description: "Flexible spending with great rewards",
      features: [
        "0% interest periods",
        "Cashback rewards",
        "Travel insurance",
        "Purchase protection",
      ],
      cta: "Apply Now",
      link: "/products/credit-cards",
      icon: "💳",
    },
    {
      title: "Personal Loans",
      description: "Affordable loans for your needs",
      features: [
        "Competitive rates",
        "Quick decisions",
        "Flexible terms",
        "No early repayment fees",
      ],
      cta: "Get a Quote",
      link: "/products/personal-loans",
      icon: "📝",
    },
    {
      title: "Mortgages",
      description: "Your journey to home ownership starts here",
      features: [
        "First-time buyer options",
        "Remortgage deals",
        "Fixed & variable rates",
        "Expert advice",
      ],
      cta: "Explore Mortgages",
      link: "/products/mortgages",
      icon: "🏠",
    },
    {
      title: "Insurance",
      description: "Protect what matters most",
      features: [
        "Home insurance",
        "Life insurance",
        "Travel cover",
        "Income protection",
      ],
      cta: "Get Protected",
      link: "/products/insurance",
      icon: "🛡️",
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Products</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our range of financial products designed to help you manage, save, and grow your money.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <Card key={index} className="p-6 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{product.icon}</span>
              <h2 className="text-2xl font-semibold">{product.title}</h2>
            </div>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <ul className="space-y-3 mb-8 flex-grow">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="w-full" asChild>
              <Link href={product.link}>{product.cta}</Link>
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Need Help Choosing?</h2>
        <p className="text-gray-600 mb-8">
          Our financial advisors are here to help you find the right products for your needs.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/help">Get Support</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Book an Appointment</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 