'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function InsurancePage() {
  const insuranceProducts = [
    {
      name: "Home Insurance",
      description: "Protect your home and belongings with our comprehensive coverage",
      keyFeatures: {
        coverTypes: "Buildings & Contents",
        coverAmount: "Up to £1,000,000",
        excess: "From £100",
        payment: "From £12 per month",
      },
      features: [
        "Buildings and contents cover",
        "Accidental damage cover",
        "Alternative accommodation",
        "24/7 emergency helpline",
        "New for old replacement",
        "Optional legal protection",
      ],
      benefits: [
        "Fast claims process",
        "Flexible payment options",
        "Multi-policy discount",
        "No claims discount",
      ],
      additionalOptions: [
        "Home emergency cover",
        "Personal possessions cover",
        "Garden cover",
        "Bicycle cover",
      ],
      ideal: "Perfect for homeowners and renters wanting complete protection",
    },
    {
      name: "Life Insurance",
      description: "Secure your family's financial future with our life insurance plans",
      keyFeatures: {
        coverTypes: "Term & Whole Life",
        coverAmount: "Up to £2,000,000",
        term: "5-40 years",
        payment: "From £10 per month",
      },
      features: [
        "Death benefit payout",
        "Terminal illness cover",
        "Guaranteed premiums",
        "Joint life options",
        "Critical illness option",
        "Funeral cost benefit",
      ],
      benefits: [
        "Immediate coverage",
        "Tax-free payout",
        "Free policy changes",
        "Trust options available",
      ],
      additionalOptions: [
        "Critical illness cover",
        "Income protection",
        "Family income benefit",
        "Waiver of premium",
      ],
      ideal: "Essential for those wanting to protect their loved ones financially",
    },
    {
      name: "Travel Insurance",
      description: "Comprehensive travel coverage for peace of mind wherever you go",
      keyFeatures: {
        coverTypes: "Single & Annual",
        coverAmount: "Up to £10,000,000",
        excess: "From £50",
        payment: "From £15 per trip",
      },
      features: [
        "Medical expenses cover",
        "Cancellation protection",
        "Lost baggage cover",
        "24/7 emergency assistance",
        "Personal liability",
        "Travel delay compensation",
      ],
      benefits: [
        "Worldwide coverage",
        "Winter sports option",
        "Family discounts",
        "Digital policy documents",
      ],
      additionalOptions: [
        "Gadget cover",
        "Business travel",
        "Golf equipment cover",
        "Cruise extension",
      ],
      ideal: "Great for frequent travelers and family holidays",
    },
  ];

  const insuranceTools = [
    {
      title: "Quote Calculator",
      description: "Get an instant quote for your insurance needs",
      icon: "🧮",
      link: "/tools/insurance-quote",
    },
    {
      title: "Coverage Checker",
      description: "Find out what level of coverage you need",
      icon: "✓",
      link: "/tools/coverage-checker",
    },
    {
      title: "Claims Support",
      description: "Start a claim or track an existing one",
      icon: "📋",
      link: "/tools/claims",
    },
    {
      title: "Policy Manager",
      description: "View and manage your insurance policies",
      icon: "⚙️",
      link: "/tools/policy-manager",
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Insurance</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Protect what matters most with our range of comprehensive insurance products.
        </p>
      </div>

      {/* Special Offer Alert */}
      <Card className="mb-12 p-6 bg-primary/5 border-primary">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Multi-Policy Discount</h2>
            <p className="text-gray-600">
              Save up to 20% when you take out multiple insurance policies with us.
              Bundle your home, life, and travel insurance for maximum savings.
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="/contact">Get a Quote</Link>
          </Button>
        </div>
      </Card>

      {/* Insurance Products */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {insuranceProducts.map((insurance, index) => (
          <Card key={index} className="p-6 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">{insurance.name}</h2>
              <p className="text-gray-600">{insurance.description}</p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Cover Types</p>
                <p className="text-xl font-semibold">{insurance.keyFeatures.coverTypes}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cover Amount</p>
                <p className="text-xl font-semibold">{insurance.keyFeatures.coverAmount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{insurance.keyFeatures.term ? 'Term' : 'Excess'}</p>
                <p className="text-xl font-semibold">{insurance.keyFeatures.term || insurance.keyFeatures.excess}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment</p>
                <p className="text-xl font-semibold">{insurance.keyFeatures.payment}</p>
              </div>
            </div>

            <div className="mb-6 flex-grow">
              <h3 className="font-semibold mb-2">Key Features</h3>
              <ul className="space-y-2">
                {insurance.features.map((feature, idx) => (
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
                {insurance.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Optional Extras</h3>
              <ul className="space-y-2">
                {insurance.additionalOptions.map((option, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary">+</span>
                    <span>{option}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto">
              <Button className="w-full mb-4" asChild>
                <Link href={`/apply/insurance/${insurance.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  Get a Quote
                </Link>
              </Button>
              <p className="text-sm text-gray-600 text-center">{insurance.ideal}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Insurance Tools */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Insurance Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {insuranceTools.map((tool, index) => (
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
        <h2 className="text-2xl font-semibold mb-4">Need Insurance Advice?</h2>
        <p className="text-gray-600 mb-8">
          Our insurance specialists can help you find the right coverage for your needs.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/help/insurance-guide">Insurance Guide</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Speak to an Advisor</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 