'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function MortgagesPage() {
  const mortgages = [
    {
      name: "First Time Buyer",
      description: "Take your first step onto the property ladder with our tailored mortgages",
      keyFeatures: {
        rate: "4.49%",
        rateType: "Fixed for 2 years",
        apr: "4.9% APRC",
        ltv: "Up to 95% LTV",
      },
      features: [
        "Low deposit options from 5%",
        "Free property valuation",
        "No arrangement fee",
        "Flexible overpayments",
        "Online application",
        "Decision in principle in minutes",
      ],
      benefits: [
        "Dedicated mortgage advisor",
        "First-time buyer guidance",
        "Help to Buy scheme eligible",
        "Moving costs contribution",
      ],
      requirements: "First-time buyers only. Subject to status and lending criteria.",
      ideal: "Perfect for those buying their first home",
    },
    {
      name: "Fixed Rate Mortgage",
      description: "Lock in your rate and protect against interest rate changes",
      keyFeatures: {
        rate: "4.29%",
        rateType: "Fixed for 5 years",
        apr: "4.7% APRC",
        ltv: "Up to 85% LTV",
      },
      features: [
        "Fixed monthly payments",
        "2, 3, 5 or 10 year terms",
        "Free remortgage service",
        "Overpay up to 10% annually",
        "Switch to new deal early",
        "Online account management",
      ],
      benefits: [
        "Rate certainty",
        "Budget planning",
        "No valuation fees",
        "Flexible terms",
      ],
      requirements: "Available for purchase or remortgage. Subject to status.",
      ideal: "Great for those wanting payment security",
    },
    {
      name: "Buy to Let",
      description: "Specialist mortgages for property investors and landlords",
      keyFeatures: {
        rate: "4.89%",
        rateType: "Fixed for 2 years",
        apr: "5.2% APRC",
        ltv: "Up to 75% LTV",
      },
      features: [
        "Interest-only options",
        "Portfolio landlord options",
        "Limited company lending",
        "HMO mortgages available",
        "Flexible terms",
        "Professional landlord rates",
      ],
      benefits: [
        "Specialist BTL advice",
        "Rental income assessment",
        "Property portfolio review",
        "Tax efficiency guidance",
      ],
      requirements: "Rental income must cover 125% of mortgage payments. Subject to terms.",
      ideal: "Ideal for property investors and landlords",
    },
  ];

  const mortgageTools = [
    {
      title: "Mortgage Calculator",
      description: "Calculate your monthly payments and see how much you could borrow",
      icon: "🧮",
      link: "/tools/mortgage-calculator",
    },
    {
      title: "Property Valuation",
      description: "Get an estimated value for your property",
      icon: "🏠",
      link: "/tools/property-valuation",
    },
    {
      title: "Affordability Check",
      description: "Find out how much you could borrow based on your income",
      icon: "💷",
      link: "/tools/affordability",
    },
    {
      title: "Rate Finder",
      description: "Find the best mortgage rate for your circumstances",
      icon: "📊",
      link: "/tools/rate-finder",
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Mortgages</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find the right mortgage to help you buy your dream home or expand your property portfolio.
        </p>
      </div>

      {/* Current Rates Alert */}
      <Card className="mb-12 p-6 bg-primary/5 border-primary">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Bank of England Base Rate: 5.25%</h2>
            <p className="text-gray-600">
              Our mortgage rates are regularly reviewed. Speak to an advisor for the latest rates and deals.
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="/contact">Speak to an Advisor</Link>
          </Button>
        </div>
      </Card>

      {/* Mortgage Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {mortgages.map((mortgage, index) => (
          <Card key={index} className="p-6 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">{mortgage.name}</h2>
              <p className="text-gray-600">{mortgage.description}</p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Interest Rate</p>
                <p className="text-xl font-semibold">{mortgage.keyFeatures.rate}</p>
                <p className="text-sm text-gray-600">{mortgage.keyFeatures.rateType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">APRC</p>
                <p className="text-xl font-semibold">{mortgage.keyFeatures.apr}</p>
                <p className="text-sm text-gray-600">{mortgage.keyFeatures.ltv}</p>
              </div>
            </div>

            <div className="mb-6 flex-grow">
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="space-y-2">
                {mortgage.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-500 mt-1 flex-shrink-0"
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
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Benefits</h3>
              <ul className="space-y-2">
                {mortgage.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium">Important Information</p>
              <p className="text-gray-600">{mortgage.requirements}</p>
            </div>

            <div className="mt-auto">
              <Button className="w-full mb-4" asChild>
                <Link href="/apply/mortgage">Apply Now</Link>
              </Button>
              <p className="text-sm text-gray-600 text-center">{mortgage.ideal}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Mortgage Tools */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Mortgage Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mortgageTools.map((tool, index) => (
            <Card key={index} className="p-6" asChild>
              <Link href={tool.link}>
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="font-semibold mb-2">{tool.title}</h3>
                <p className="text-gray-600">{tool.description}</p>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Need Mortgage Advice?</h2>
        <p className="text-gray-600 mb-8">
          Our mortgage specialists can help you find the right mortgage for your needs.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/help/mortgage-guide">Mortgage Guide</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Book Appointment</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 