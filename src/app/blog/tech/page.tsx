import Link from "next/link";
import { ArrowRight, Smartphone, Shield, Wifi, CreditCard } from "lucide-react";
import { Metadata } from "next";

const techArticles = [
  {
    title: "The Future of Mobile Banking",
    category: "Mobile Banking",
    date: "April 28, 2024",
    readTime: "5 min read",
    excerpt: "Explore the latest trends in mobile banking and how they're shaping the future of financial services.",
    icon: Smartphone
  },
  {
    title: "Enhancing Digital Security",
    category: "Security",
    date: "April 27, 2024",
    readTime: "4 min read",
    excerpt: "Learn about the latest security measures and how we're protecting your digital assets.",
    icon: Shield
  },
  {
    title: "5G and Banking",
    category: "Technology",
    date: "April 26, 2024",
    readTime: "3 min read",
    excerpt: "How 5G technology is revolutionizing the banking experience.",
    icon: Wifi
  },
  {
    title: "Contactless Payments",
    category: "Payments",
    date: "April 25, 2024",
    readTime: "4 min read",
    excerpt: "The rise of contactless payments and their impact on everyday banking.",
    icon: CreditCard
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
            className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <article.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <span>{article.category}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <Link
                  href={`/blog/tech/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-flex items-center text-primary hover:underline"
                >
                  Read more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
} 