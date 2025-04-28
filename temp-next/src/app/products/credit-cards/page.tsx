'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function CreditCardsPage() {
  const cards = [
    {
      name: "Rewards Card",
      description: "Earn points on every purchase with our most popular card",
      keyFeatures: {
        apr: "22.9%",
        introApr: "0% for 3 months",
        annualFee: "£0",
        rewardsRate: "1 point per £1",
      },
      features: [
        "Earn rewards on all purchases",
        "Points never expire",
        "No annual fee",
        "0% on purchases for 3 months",
        "Contactless payments",
        "Virtual card instantly",
      ],
      benefits: [
        "2x points at supermarkets",
        "Travel accident insurance",
        "Purchase protection",
        "24/7 customer support",
      ],
      requirements: "Minimum income £20,000. Subject to status.",
      ideal: "Perfect for everyday spending and rewards",
    },
    {
      name: "Premium Card",
      description: "Premium benefits and enhanced rewards for discerning customers",
      keyFeatures: {
        apr: "24.9%",
        introApr: "0% for 6 months",
        annualFee: "£150",
        rewardsRate: "2 points per £1",
      },
      features: [
        "Enhanced rewards rate",
        "Airport lounge access",
        "Travel insurance",
        "0% on purchases for 6 months",
        "Concierge service",
        "Higher credit limits",
      ],
      benefits: [
        "Priority airport security",
        "Hotel room upgrades",
        "Extended warranty",
        "Exclusive event access",
      ],
      requirements: "Minimum income £50,000. Subject to status.",
      ideal: "Ideal for frequent travelers and luxury benefits",
    },
    {
      name: "Balance Transfer Card",
      description: "Save money by consolidating your existing credit card debt",
      keyFeatures: {
        apr: "21.9%",
        introApr: "0% for 24 months",
        annualFee: "£0",
        transferFee: "2.9%",
      },
      features: [
        "0% on balance transfers for 24 months",
        "No annual fee",
        "Online balance transfers",
        "Mobile app management",
        "Contactless enabled",
        "Quick approval process",
      ],
      benefits: [
        "Debt consolidation tool",
        "Payment reminders",
        "Free credit score",
        "Flexible payment dates",
      ],
      requirements: "Balance transfers must be made within 60 days. Subject to status.",
      ideal: "Great for consolidating existing credit card debt",
    },
  ];

  const additionalFeatures = [
    {
      title: "Secure Spending",
      description: "Advanced fraud protection and real-time transaction monitoring",
      icon: "🔒",
    },
    {
      title: "Mobile Control",
      description: "Manage your card, view transactions, and freeze/unfreeze instantly",
      icon: "📱",
    },
    {
      title: "Global Acceptance",
      description: "Accepted at millions of locations worldwide",
      icon: "🌍",
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock assistance for lost cards and emergencies",
      icon: "🛟",
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Credit Cards</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the right credit card for your lifestyle and spending habits.
        </p>
      </div>

      {/* Card Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {cards.map((card, index) => (
          <Card key={index} className="p-6 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">{card.name}</h2>
              <p className="text-gray-600">{card.description}</p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              {'apr' in card.keyFeatures && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Standard APR</p>
                    <p className="text-xl font-semibold">{card.keyFeatures.apr}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Intro APR</p>
                    <p className="text-xl font-semibold">{card.keyFeatures.introApr}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm text-gray-600">Annual Fee</p>
                <p className="text-xl font-semibold">{card.keyFeatures.annualFee}</p>
              </div>
              {card.keyFeatures.rewardsRate ? (
                <div>
                  <p className="text-sm text-gray-600">Rewards Rate</p>
                  <p className="text-xl font-semibold">{card.keyFeatures.rewardsRate}</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">Transfer Fee</p>
                  <p className="text-xl font-semibold">{card.keyFeatures.transferFee}</p>
                </div>
              )}
            </div>

            <div className="mb-6 flex-grow">
              <h3 className="font-semibold mb-2">Card Features</h3>
              <ul className="space-y-2">
                {card.features.map((feature, idx) => (
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
              <h3 className="font-semibold mb-2">Additional Benefits</h3>
              <ul className="space-y-2">
                {card.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium">Important Information</p>
              <p className="text-gray-600">{card.requirements}</p>
            </div>

            <div className="mt-auto">
              <Button className="w-full mb-4" asChild>
                <Link href="/apply/credit-card">Apply Now</Link>
              </Button>
              <p className="text-sm text-gray-600 text-center">{card.ideal}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Features */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-center mb-8">All Cards Include</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {additionalFeatures.map((feature, index) => (
            <Card key={index} className="p-6">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Need Help Choosing?</h2>
        <p className="text-gray-600 mb-8">
          Our credit card specialists can help you find the right card for your needs.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/help/card-comparison">Compare Cards</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Speak to an Advisor</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 