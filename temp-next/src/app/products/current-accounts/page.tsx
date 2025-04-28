'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function CurrentAccountsPage() {
  const accounts = [
    {
      name: "Everyday Account",
      description: "Perfect for your daily banking needs with no monthly fees",
      monthlyFee: "£0",
      features: [
        "No monthly account fee",
        "Mobile and online banking",
        "Contactless debit card",
        "Access to 2,500+ ATMs",
        "24/7 banking support",
        "Apple Pay & Google Pay",
      ],
      benefits: [
        "Cashback on everyday purchases",
        "Exclusive retail offers",
        "Emergency cash service",
      ],
      requirements: "No minimum deposit required",
      ideal: "Ideal for everyday banking",
    },
    {
      name: "Premium Account",
      description: "Enhanced banking with exclusive benefits and preferential rates",
      monthlyFee: "£12",
      features: [
        "All Everyday Account features",
        "Worldwide travel insurance",
        "Mobile phone insurance",
        "Breakdown cover",
        "Higher interest rates",
        "Dedicated premium support",
      ],
      benefits: [
        "Airport lounge access",
        "Premium retail offers",
        "Concierge service",
      ],
      requirements: "£2,000 monthly deposit or £25,000 in savings",
      ideal: "Perfect for those wanting premium benefits",
    },
    {
      name: "Student Account",
      description: "Supporting your studies with tailored banking features",
      monthlyFee: "£0",
      features: [
        "Interest-free overdraft up to £2,000",
        "Mobile and online banking",
        "Student discount card",
        "Budgeting tools",
        "Mobile payments",
        "Student support team",
      ],
      benefits: [
        "Student retail discounts",
        "Free railcard for 4 years",
        "Career support services",
      ],
      requirements: "Must be enrolled in a UK university",
      ideal: "Great for university students",
    },
  ];

  const additionalFeatures = [
    {
      title: "Online & Mobile Banking",
      description: "Bank anywhere, anytime with our award-winning digital services",
      icon: "📱",
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock assistance through phone, chat, or email",
      icon: "🛟",
    },
    {
      title: "Secure Banking",
      description: "Advanced security features including biometric login and instant card freezing",
      icon: "🔒",
    },
    {
      title: "International Services",
      description: "Competitive exchange rates and global ATM access",
      icon: "🌍",
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Current Accounts</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the perfect current account that suits your lifestyle and banking needs.
        </p>
      </div>

      {/* Account Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {accounts.map((account, index) => (
          <Card key={index} className="p-6 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">{account.name}</h2>
              <p className="text-gray-600">{account.description}</p>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600">Monthly Fee</p>
              <p className="text-3xl font-bold">{account.monthlyFee}</p>
            </div>

            <div className="mb-6 flex-grow">
              <h3 className="font-semibold mb-2">Key Features</h3>
              <ul className="space-y-2">
                {account.features.map((feature, idx) => (
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
              <h3 className="font-semibold mb-2">Extra Benefits</h3>
              <ul className="space-y-2">
                {account.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium">Requirements</p>
              <p className="text-gray-600">{account.requirements}</p>
            </div>

            <div className="mt-auto">
              <Button className="w-full mb-4" asChild>
                <Link href="/apply/current-account">Open Account</Link>
              </Button>
              <p className="text-sm text-gray-600 text-center">{account.ideal}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Features */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-center mb-8">All Accounts Include</h2>
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
          Our account specialists can help you find the perfect account for your needs.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/help/current-accounts">Compare Accounts</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Speak to an Advisor</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 