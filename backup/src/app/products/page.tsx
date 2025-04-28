'use client';

import { Hero } from '@/components/ui/hero';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import {
  Wallet,
  Home,
  Car,
  Briefcase,
  PiggyBank,
  Shield,
  CreditCard,
  LineChart,
  Building2,
  Users,
  ArrowRight,
  Scale
} from 'lucide-react';

const products = [
  {
    title: "Personal Loans",
    description: "Flexible personal loans with competitive rates for any purpose",
    icon: Wallet,
    features: [
      "Borrow up to £50,000",
      "Competitive interest rates",
      "Quick approval process",
      "No early repayment fees"
    ],
    link: "/products/personal-loans"
  },
  {
    title: "Mortgages",
    description: "Find your dream home with our range of mortgage options",
    icon: Home,
    features: [
      "Fixed and variable rates",
      "First-time buyer options",
      "Buy-to-let mortgages",
      "Free property valuations"
    ],
    link: "/products/mortgages"
  },
  {
    title: "Car Finance",
    description: "Drive your dream car with our flexible financing solutions",
    icon: Car,
    features: [
      "New and used car finance",
      "Hire purchase options",
      "Personal contract plans",
      "Quick approval"
    ],
    link: "/products/car-finance"
  },
  {
    title: "Business Banking",
    description: "Comprehensive banking solutions for businesses of all sizes",
    icon: Briefcase,
    features: [
      "Business current accounts",
      "Business loans",
      "Merchant services",
      "International trade support"
    ],
    link: "/products/business"
  },
  {
    title: "Savings & Investments",
    description: "Grow your wealth with our range of savings and investment products",
    icon: PiggyBank,
    features: [
      "ISAs and savings accounts",
      "Investment portfolios",
      "Pension planning",
      "Wealth management"
    ],
    link: "/products/savings"
  },
  {
    title: "Insurance",
    description: "Protect what matters most with our insurance products",
    icon: Shield,
    features: [
      "Life insurance",
      "Home insurance",
      "Travel insurance",
      "Business insurance"
    ],
    link: "/products/insurance"
  },
  {
    title: "Credit Cards",
    description: "Find the right credit card for your lifestyle",
    icon: CreditCard,
    features: [
      "Rewards credit cards",
      "Balance transfer cards",
      "Business credit cards",
      "Travel credit cards"
    ],
    link: "/products/credit-cards"
  },
  {
    title: "Investment Services",
    description: "Expert investment services for every goal",
    icon: LineChart,
    features: [
      "Stocks and shares",
      "Investment advice",
      "Portfolio management",
      "Retirement planning"
    ],
    link: "/products/investments"
  }
];

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Our Products</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <CreditCard className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Ulster Delt Standard</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Our basic account with essential banking features and no monthly fees.
            </p>
            <a href="/products/standard" className="flex items-center text-primary hover:underline">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Ulster Delt Smart</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Smart banking with budgeting tools and cashback rewards.
            </p>
            <a href="/products/smart" className="flex items-center text-primary hover:underline">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Ulster Delt Metal</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Premium metal card with exclusive benefits and concierge service.
            </p>
            <a href="/products/metal" className="flex items-center text-primary hover:underline">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <Briefcase className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Ulster Delt Business</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Complete banking solutions for businesses of all sizes.
            </p>
            <a href="/products/business" className="flex items-center text-primary hover:underline">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <Scale className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Compare Plans</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Compare all our products and find the perfect one for you.
            </p>
            <a href="/products/compare" className="flex items-center text-primary hover:underline">
              Compare Now <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <Building2 className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Ulster Delt You</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Customizable banking experience tailored to your needs.
            </p>
            <a href="/products/you" className="flex items-center text-primary hover:underline">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 