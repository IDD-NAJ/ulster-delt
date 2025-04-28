'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Hero } from '@/components/ui/hero';

export default function FinancialProductsPage() {
  const products = [
    {
      title: "Personal Loans",
      description: "Flexible personal loans with competitive rates for any purpose.",
      features: [
        "Quick approval process",
        "Competitive interest rates",
        "Flexible repayment terms",
        "No early repayment fees",
      ],
      cta: "Apply for a Loan",
    },
    {
      title: "Mortgages",
      description: "Make your dream home a reality with our range of mortgage options.",
      features: [
        "Fixed and variable rates",
        "First-time buyer support",
        "Buy-to-let options",
        "Expert mortgage advisors",
      ],
      cta: "Explore Mortgages",
    },
    {
      title: "Credit Cards",
      description: "Rewards, cashback, and flexible payment options with our credit cards.",
      features: [
        "0% interest periods",
        "Rewards program",
        "Travel insurance",
        "Contactless payments",
      ],
      cta: "Get a Credit Card",
    },
    {
      title: "Investments",
      description: "Grow your wealth with our range of investment products.",
      features: [
        "Stocks and shares ISAs",
        "Investment advice",
        "Portfolio management",
        "Regular investment options",
      ],
      cta: "Start Investing",
    },
    {
      title: "Insurance",
      description: "Protect what matters most with our comprehensive insurance products.",
      features: [
        "Home insurance",
        "Life insurance",
        "Travel insurance",
        "Income protection",
      ],
      cta: "Get Protected",
    },
    {
      title: "Business Finance",
      description: "Financial solutions to help your business grow and succeed.",
      features: [
        "Business loans",
        "Asset finance",
        "Invoice financing",
        "Trade finance",
      ],
      cta: "Business Solutions",
    },
  ];

  return (
    <div>
      <Hero
        title="Financial Products"
        subtitle="Discover our comprehensive range of financial solutions tailored to your needs."
        imagePath="/hero-products.jpg"
      >
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full px-4 sm:px-0">
          <Button className="w-full sm:w-auto" asChild>
            <Link href="#products">Browse Products</Link>
          </Button>
          <Button className="w-full sm:w-auto" variant="outline" asChild>
            <Link href="/contact">Get Advice</Link>
          </Button>
        </div>
      </Hero>

      <div className="container mx-auto py-8 sm:py-12 px-4 sm:px-6">
        <div id="products" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-16">
          {products.map((product, index) => (
            <Card key={index} className="p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">{product.title}</h2>
              <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">{product.description}</p>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {product.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm sm:text-base">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0"
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
                    <span className="leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full text-sm sm:text-base" asChild>
                <Link href={`/products/${product.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {product.cta}
                </Link>
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Need Financial Advice?</h2>
          <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-2xl mx-auto">
            Our financial advisors are here to help you choose the right products for your needs.
          </p>
          <Button className="w-full sm:w-auto" variant="outline" asChild>
            <Link href="/contact">Schedule a Consultation</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 