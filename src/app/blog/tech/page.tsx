import Link from "next/link";
import { ArrowRight, Smartphone, Shield, Wifi, CreditCard } from "lucide-react";
import { Metadata } from "next";

const techArticles = [
  {
    title: "The Future of Mobile Banking",
    description: "How mobile technology is transforming the banking experience",
    icon: Smartphone,
    link: "/blog/tech/mobile-banking"
  },
  {
    title: "Enhanced Security Measures",
    description: "Latest security features to protect your financial data",
    icon: Shield,
    link: "/blog/tech/security"
  },
  {
    title: "Digital Payment Solutions",
    description: "Innovative ways to make secure digital payments",
    icon: CreditCard,
    link: "/blog/tech/digital-payments"
  }
];

export const metadata: Metadata = {
  title: "Technology Blog | Ulster Delt",
  description: "Latest technology news and updates",
};

export default function TechBlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Technology Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techArticles.map((article) => (
          <article
            key={article.title}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <article.icon className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">{article.title}</h2>
            </div>
            <p className="text-gray-600 mb-4">{article.description}</p>
            <Link
              href={article.link}
              className="inline-flex items-center text-primary hover:text-primary/80"
            >
              Read more
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
} 