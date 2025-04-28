'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function PersonalLoansPage() {
  const loans = [
    {
      name: "Personal Loan",
      description: "Flexible borrowing for your personal needs with competitive rates",
      keyFeatures: {
        amount: "£1,000 - £25,000",
        term: "1-7 years",
        apr: "6.9% APR",
        monthlyPayment: "From £80 per £1,000",
      },
      features: [
        "Fixed monthly payments",
        "No setup fees",
        "Quick online application",
        "Instant decision in principle",
        "Same day funding possible",
        "No early repayment fees",
      ],
      benefits: [
        "Competitive fixed rates",
        "Flexible loan terms",
        "Online account management",
        "Payment holiday options",
      ],
      requirements: "Must be 18+ and UK resident. Subject to status.",
      ideal: "Perfect for home improvements, large purchases or debt consolidation",
    },
    {
      name: "Car Loan",
      description: "Dedicated car financing with tailored terms and competitive rates",
      keyFeatures: {
        amount: "£3,000 - £50,000",
        term: "2-7 years",
        apr: "5.9% APR",
        monthlyPayment: "From £75 per £1,000",
      },
      features: [
        "Competitive car loan rates",
        "Fixed monthly payments",
        "New and used cars",
        "Quick approval process",
        "Flexible terms",
        "Optional payment protection",
      ],
      benefits: [
        "Dedicated car specialists",
        "Vehicle history check",
        "Dealer negotiations support",
        "Gap insurance available",
      ],
      requirements: "Must be 18+ and UK resident. Vehicle age restrictions apply.",
      ideal: "Great for financing your next vehicle purchase",
    },
    {
      name: "Debt Consolidation",
      description: "Simplify your finances by combining multiple debts into one loan",
      keyFeatures: {
        amount: "£5,000 - £35,000",
        term: "1-10 years",
        apr: "7.9% APR",
        monthlyPayment: "From £85 per £1,000",
      },
      features: [
        "Single monthly payment",
        "Fixed interest rate",
        "Debt management support",
        "Flexible terms",
        "Online application",
        "Quick decisions",
      ],
      benefits: [
        "Simplify your finances",
        "Potential interest savings",
        "Free debt advice",
        "Budget planning tools",
      ],
      requirements: "Must be 18+ and UK resident. Existing debt details required.",
      ideal: "Ideal for combining multiple debts into one manageable payment",
    },
  ];

  const loanTools = [
    {
      title: "Loan Calculator",
      description: "Calculate your monthly payments and total cost of borrowing",
      icon: "🧮",
      link: "/tools/loan-calculator",
    },
    {
      title: "Eligibility Checker",
      description: "Check your loan eligibility without affecting your credit score",
      icon: "✓",
      link: "/tools/eligibility",
    },
    {
      title: "Budget Planner",
      description: "Plan your budget and see how much you can afford to borrow",
      icon: "📊",
      link: "/tools/budget-planner",
    },
    {
      title: "Loan Comparison",
      description: "Compare different loan options to find the best deal for you",
      icon: "⚖️",
      link: "/tools/loan-comparison",
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Personal Loans</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find the right loan to help you achieve your goals with competitive rates and flexible terms.
        </p>
      </div>

      {/* Representative Example */}
      <Card className="mb-12 p-6 bg-primary/5 border-primary">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Representative Example</h2>
            <p className="text-gray-600">
              Borrow £10,000 over 5 years at 6.9% APR representative. Monthly payment £197.
              Total amount repayable £11,820. Rates from 6.9% APR to 19.9% APR.
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="/apply/loan">Check Your Rate</Link>
          </Button>
        </div>
      </Card>

      {/* Loan Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {loans.map((loan, index) => (
          <Card key={index} className="p-6 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">{loan.name}</h2>
              <p className="text-gray-600">{loan.description}</p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Loan Amount</p>
                <p className="text-xl font-semibold">{loan.keyFeatures.amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Loan Term</p>
                <p className="text-xl font-semibold">{loan.keyFeatures.term}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Representative APR</p>
                <p className="text-xl font-semibold">{loan.keyFeatures.apr}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Payment</p>
                <p className="text-xl font-semibold">{loan.keyFeatures.monthlyPayment}</p>
              </div>
            </div>

            <div className="mb-6 flex-grow">
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="space-y-2">
                {loan.features.map((feature, idx) => (
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
                {loan.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium">Important Information</p>
              <p className="text-gray-600">{loan.requirements}</p>
            </div>

            <div className="mt-auto">
              <Button className="w-full mb-4" asChild>
                <Link href="/apply/loan">Apply Now</Link>
              </Button>
              <p className="text-sm text-gray-600 text-center">{loan.ideal}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Loan Tools */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Loan Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loanTools.map((tool, index) => (
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
          Our loan specialists can help you find the right loan for your needs.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/help/loan-guide">Loan Guide</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Speak to an Advisor</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 