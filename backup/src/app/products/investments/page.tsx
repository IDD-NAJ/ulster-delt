'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function InvestmentsPage() {
  const investmentProducts = [
    {
      title: "Stocks & Shares ISA",
      description: "Tax-efficient investing in stocks, shares, and funds.",
      minInvestment: "£100",
      features: [
        "Tax-free returns",
        "Wide investment choice",
        "Annual ISA allowance up to £20,000",
        "Easy online management",
      ],
      riskLevel: "Medium",
      suitable: "Long-term investors",
    },
    {
      title: "General Investment Account",
      description: "Flexible investing without ISA restrictions.",
      minInvestment: "£500",
      features: [
        "No investment limits",
        "Multiple currency options",
        "Advanced trading tools",
        "Research and analysis",
      ],
      riskLevel: "Varied",
      suitable: "Active investors",
    },
    {
      title: "Managed Portfolio",
      description: "Expert-managed investment portfolios tailored to your goals.",
      minInvestment: "£5,000",
      features: [
        "Professional management",
        "Regular rebalancing",
        "Diversified portfolio",
        "Ongoing monitoring",
      ],
      riskLevel: "Low to High",
      suitable: "Hands-off investors",
    },
    {
      title: "SIPP Pension",
      description: "Self-invested personal pension for retirement planning.",
      minInvestment: "£1,000",
      features: [
        "Tax relief on contributions",
        "Wide investment choice",
        "Flexible retirement options",
        "Inheritance planning",
      ],
      riskLevel: "Medium to High",
      suitable: "Retirement planning",
    },
  ];

  const services = [
    {
      title: "Investment Advisory",
      description: "Personalized investment advice from our experts.",
      icon: "👥",
      features: [
        "One-to-one consultation",
        "Portfolio review",
        "Investment strategy",
        "Regular updates",
      ],
    },
    {
      title: "Wealth Management",
      description: "Comprehensive wealth management services for high-net-worth individuals.",
      icon: "💎",
      features: [
        "Dedicated wealth manager",
        "Estate planning",
        "Tax optimization",
        "Exclusive opportunities",
      ],
    },
    {
      title: "Trading Platform",
      description: "Advanced trading platform for active investors.",
      icon: "📊",
      features: [
        "Real-time quotes",
        "Technical analysis",
        "Mobile trading",
        "Market research",
      ],
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Investments</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Grow your wealth with our range of investment products and expert services.
        </p>
        <div className="mt-8 space-x-4">
          <Button size="lg" asChild>
            <Link href="/products/investments/start">Start Investing</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Talk to an Advisor</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {investmentProducts.map((product, index) => (
          <Card key={index} className="p-8">
            <h2 className="text-2xl font-semibold mb-4">{product.title}</h2>
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Minimum Investment</p>
                <p className="text-xl font-semibold">{product.minInvestment}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Risk Level</p>
                <p className="text-xl font-semibold">{product.riskLevel}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Key Features</h3>
              <ul className="space-y-3">
                {product.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3"
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
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600">Best suited for</p>
              <p className="font-medium">{product.suitable}</p>
            </div>

            <Button className="w-full" asChild>
              <Link href={`/products/investments/${product.title.toLowerCase().replace(/\s+/g, '-')}`}>
                Learn More
              </Link>
            </Button>
          </Card>
        ))}
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Investment Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="p-6">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm">
                    <svg
                      className="w-4 h-4 text-green-500 mr-2"
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
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  Learn More
                </Link>
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Investment Calculator</h2>
          <p className="text-gray-600 mb-4">
            See how your investments could grow over time with our calculator.
          </p>
          <Button asChild>
            <Link href="/products/investments/calculator">Try Calculator</Link>
          </Button>
        </div>
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Market Insights</h2>
          <p className="text-gray-600 mb-4">
            Stay informed with our latest market analysis and investment insights.
          </p>
          <Button variant="outline" asChild>
            <Link href="/insights">View Insights</Link>
          </Button>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Start Investing?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Open an account online or speak with our investment specialists to get started.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/contact">Book Consultation</Link>
          </Button>
          <Button asChild>
            <Link href="/products/investments/start">Open Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 