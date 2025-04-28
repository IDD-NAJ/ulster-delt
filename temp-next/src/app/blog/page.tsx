'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function BlogPage() {
  const featuredPosts = [
    {
      title: "The Future of Digital Banking",
      excerpt: "Explore how AI and machine learning are transforming the banking industry and what it means for customers.",
      category: "Technology",
      date: "March 15, 2024",
      readTime: "5 min read",
      image: "/blog/digital-banking.jpg",
    },
    {
      title: "Smart Saving Strategies for 2024",
      excerpt: "Practical tips and strategies to help you save more money and achieve your financial goals this year.",
      category: "Personal Finance",
      date: "March 12, 2024",
      readTime: "4 min read",
      image: "/blog/saving-strategies.jpg",
    },
  ];

  const recentPosts = [
    {
      title: "Understanding Cryptocurrency Investment",
      excerpt: "A beginner's guide to cryptocurrency investment and what you need to know before getting started.",
      category: "Investing",
      date: "March 10, 2024",
      readTime: "6 min read",
    },
    {
      title: "Sustainable Banking Practices",
      excerpt: "How banks are incorporating environmental sustainability into their operations and services.",
      category: "Sustainability",
      date: "March 8, 2024",
      readTime: "4 min read",
    },
    {
      title: "Tips for First-Time Home Buyers",
      excerpt: "Essential advice and guidance for those looking to purchase their first home.",
      category: "Mortgages",
      date: "March 5, 2024",
      readTime: "7 min read",
    },
    {
      title: "Managing Your Credit Score",
      excerpt: "Learn how to maintain and improve your credit score for better financial opportunities.",
      category: "Credit",
      date: "March 3, 2024",
      readTime: "5 min read",
    },
  ];

  const categories = [
    "Personal Finance",
    "Investing",
    "Technology",
    "Business",
    "Sustainability",
    "Credit",
    "Mortgages",
    "Security",
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Ulster Delt Blog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Insights, tips, and news from the world of banking and finance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {featuredPosts.map((post, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-video bg-gray-100"></div>
            <div className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span>{post.category}</span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-2xl font-semibold mb-3">{post.title}</h2>
              <p className="text-gray-600 mb-6">{post.excerpt}</p>
              <Button asChild>
                <Link href={`/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  Read More
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-semibold mb-8">Recent Articles</h2>
          <div className="grid gap-8">
            {recentPosts.map((post, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                <p className="text-gray-600 mb-6">{post.excerpt}</p>
                <Button variant="outline" asChild>
                  <Link href={`/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    Read Article
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-2xl font-semibold mb-8">Categories</h2>
          <div className="grid gap-2">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start"
                asChild
              >
                <Link href={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}>
                  {category}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Subscribe to Our Newsletter</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Get the latest financial insights and tips delivered straight to your inbox.
        </p>
        <Button asChild>
          <Link href="/newsletter">Subscribe Now</Link>
        </Button>
      </div>
    </div>
  );
} 