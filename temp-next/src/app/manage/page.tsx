'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Hero } from '@/components/ui/hero';
import { Shield, CreditCard, Bell, Key, RefreshCw } from 'lucide-react';
import { toast } from "sonner";
import { ErrorBoundary } from '@/components/error-boundary';
import { useApi } from '@/hooks/use-api';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Insight {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  period: string;
}

function InsightsSection() {
  const { data: session } = useSession();
  const { data, isLoading, error, refetch } = useApi<{
    spendingAnalysis: Omit<Insight, 'title'>;
    savingsGoal: Omit<Insight, 'title'>;
    billsDue: Omit<Insight, 'title'>;
    rewardsPoints: Omit<Insight, 'title'>;
  }>('/api/insights', {
    retryCount: 3,
    retryDelay: 1000,
    cacheTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!session // Only fetch if session exists
  });

  const insights = data ? [
    {
      title: "Spending Analysis",
      ...data.spendingAnalysis,
    },
    {
      title: "Savings Goal",
      ...data.savingsGoal,
    },
    {
      title: "Bills Due",
      ...data.billsDue,
    },
    {
      title: "Rewards Points",
      ...data.rewardsPoints,
    },
  ] : [];

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Financial Insights</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </Card>
          ))
        ) : error ? (
          <div className="col-span-full text-center py-8">
            <p className="text-red-500 mb-4">{error.message}</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        ) : (
          insights.map((insight, index) => (
            <Card key={index} className="p-6">
              <h3 className="text-sm text-gray-600 mb-2">{insight.title}</h3>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl font-bold">{insight.value}</span>
                <span className={`text-sm ${
                  insight.trend === 'up' ? 'text-green-500' : 
                  insight.trend === 'down' ? 'text-red-500' : 
                  'text-gray-500'
                }`}>
                  {insight.change}
                </span>
              </div>
              <p className="text-xs text-gray-500">{insight.period}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default function ManagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/manage");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const managementTools = [
    {
      title: "Account Overview",
      description: "Get a comprehensive view of all your accounts and transactions.",
      features: [
        "Real-time balance updates",
        "Transaction history",
        "Account statements",
        "Spending analytics",
      ],
      icon: "📊",
      link: "/manage/overview",
      color: "from-blue-500/10 to-blue-500/5",
    },
    {
      title: "Money Transfers",
      description: "Send and receive money securely with just a few clicks.",
      features: [
        "Domestic transfers",
        "International payments",
        "Standing orders",
        "Direct debits",
      ],
      icon: "💸",
      link: "/manage/transfers",
      color: "from-green-500/10 to-green-500/5",
    },
    {
      title: "Card Management",
      description: "Control and manage all your cards in one place.",
      features: [
        "Freeze/unfreeze cards",
        "PIN management",
        "Spending limits",
        "Card replacement",
      ],
      icon: "💳",
      link: "/manage/cards",
      color: "from-purple-500/10 to-purple-500/5",
    },
    {
      title: "Security Center",
      description: "Keep your accounts safe with advanced security features.",
      features: [
        "Two-factor authentication",
        "Login alerts",
        "Device management",
        "Security settings",
      ],
      icon: "🔒",
      link: "/manage/security",
      color: "from-red-500/10 to-red-500/5",
    },
  ];

  const quickActions = [
    {
      title: "Send Money",
      description: "Transfer funds to another account",
      icon: "↗️",
      link: "/manage/transfers/new",
    },
    {
      title: "Pay Bills",
      description: "Manage and pay your bills",
      icon: "📃",
      link: "/manage/bills",
    },
    {
      title: "Mobile Top-up",
      description: "Add credit to your phone",
      icon: "📱",
      link: "/manage/top-up",
    },
    {
      title: "Support",
      description: "Get help when you need it",
      icon: "💬",
      link: "/contact",
    },
  ];

  return (
    <ErrorBoundary>
      <div>
        <Hero
          title="Account Management"
          subtitle="Take control of your banking experience with our comprehensive management tools."
          imagePath="/images/hero-manage.jpg"
        />

        <div className="container mx-auto py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <Link href={action.link} className="flex items-center space-x-4">
                  <span className="text-3xl">{action.icon}</span>
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </Link>
              </Card>
            ))}
          </div>

          <InsightsSection />

          <h2 className="text-2xl font-semibold mb-6">Management Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {managementTools.map((tool, index) => (
              <Card key={index} className="overflow-hidden">
                <div className={`bg-gradient-to-r ${tool.color} p-8`}>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-4xl">{tool.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold">{tool.title}</h3>
                      <p className="text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {tool.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-primary mr-3"
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
                    <Link href={tool.link}>Access {tool.title}</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center bg-gray-50 p-12 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our support team is available 24/7 to assist you with any questions or concerns.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/help">View Help Center</Link>
              </Button>
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
} 