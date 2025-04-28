'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function SavingsAccountsPage() {
  const accounts = [
    {
      name: "Easy Access Saver",
      description: "Flexible savings with instant access to your money",
      interestRate: "3.5%",
      interestType: "Variable",
      minDeposit: "£1",
      features: [
        "Instant access to funds",
        "No notice period required",
        "Unlimited withdrawals",
        "Online and mobile banking",
        "Joint accounts available",
        "Interest paid monthly",
      ],
      benefits: [
        "Competitive variable rate",
        "Start saving from just £1",
        "Manage your account 24/7",
      ],
      restrictions: "Rate may vary. Maximum balance £1,000,000",
      ideal: "Perfect for emergency funds and flexible saving",
    },
    {
      name: "Fixed Rate Bond",
      description: "Lock your money away for higher returns",
      interestRate: "4.75%",
      interestType: "Fixed for 2 years",
      minDeposit: "£1,000",
      features: [
        "Guaranteed fixed rate",
        "Terms from 1-5 years",
        "Protected interest rate",
        "Online account management",
        "Interest paid annually",
        "FSCS protected",
      ],
      benefits: [
        "Higher interest rates",
        "Predictable returns",
        "Capital guaranteed",
      ],
      restrictions: "No withdrawals during fixed term",
      ideal: "Ideal for long-term saving goals",
    },
    {
      name: "Regular Saver",
      description: "Build your savings habit with great rates",
      interestRate: "5.25%",
      interestType: "Fixed for 12 months",
      minDeposit: "£25 monthly",
      features: [
        "Save £25-£300 monthly",
        "12-month term",
        "Direct debit option",
        "Mobile app access",
        "Goal tracking tools",
        "Automatic payments",
      ],
      benefits: [
        "Our highest interest rate",
        "Regular saving rewards",
        "Goal achievement support",
      ],
      restrictions: "Must make monthly deposits. Early closure results in lower rate",
      ideal: "Great for building a regular saving habit",
    },
  ];

  const savingTools = [
    {
      title: "Savings Calculator",
      description: "Plan your savings journey and see how your money could grow",
      icon: "🧮",
      link: "/tools/savings-calculator",
    },
    {
      title: "Goal Setting",
      description: "Set and track your savings goals with our digital tools",
      icon: "🎯",
      link: "/tools/savings-goals",
    },
    {
      title: "Auto-Save",
      description: "Automatically save money with our round-up feature",
      icon: "💰",
      link: "/tools/auto-save",
    },
    {
      title: "Rate Alerts",
      description: "Get notified when better rates become available",
      icon: "📈",
      link: "/tools/rate-alerts",
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Savings Accounts</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Watch your money grow with our range of competitive savings accounts.
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
              <div className="mb-4">
                <p className="text-sm text-gray-600">Interest Rate (AER)</p>
                <p className="text-3xl font-bold">{account.interestRate}</p>
                <p className="text-sm text-gray-600">{account.interestType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Minimum Deposit</p>
                <p className="text-xl font-semibold">{account.minDeposit}</p>
              </div>
            </div>

            <div className="mb-6 flex-grow">
              <h3 className="font-semibold mb-2">Account Features</h3>
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
              <h3 className="font-semibold mb-2">Key Benefits</h3>
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
              <p className="text-sm font-medium">Important Information</p>
              <p className="text-gray-600">{account.restrictions}</p>
            </div>

            <div className="mt-auto">
              <Button className="w-full mb-4" asChild>
                <Link href="/apply/savings-account">Open Account</Link>
              </Button>
              <p className="text-sm text-gray-600 text-center">{account.ideal}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Savings Tools */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Savings Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {savingTools.map((tool, index) => (
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
        <h2 className="text-2xl font-semibold mb-4">Need Help Choosing?</h2>
        <p className="text-gray-600 mb-8">
          Our savings specialists can help you find the right account for your goals.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/help/savings-calculator">Calculate Returns</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Speak to an Advisor</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 