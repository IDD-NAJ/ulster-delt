import Link from "next/link";
import { ArrowRight, Smartphone, Shield, Wifi, CreditCard, Smartphone } from "lucide-react";

const techArticles = [
  {
    title: "Mobile Banking Security",
    excerpt: "Learn how to keep your mobile banking experience secure and protected.",
    category: "Security",
    date: "April 25, 2024",
    readTime: "6 min read",
    icon: Shield,
  },
  {
    title: "The Future of FinTech",
    excerpt: "Exploring emerging technologies and trends in financial technology.",
    category: "FinTech",
    date: "April 20, 2024",
    readTime: "7 min read",
    icon: Smartphone,
  },
  {
    title: "Digital Payment Solutions",
    excerpt: "A guide to modern payment methods and digital wallets.",
    category: "Payments",
    date: "April 15, 2024",
    readTime: "5 min read",
    icon: CreditCard,
  },
  {
    title: "Online Banking Tips",
    excerpt: "Best practices for safe and efficient online banking.",
    category: "Banking",
    date: "April 10, 2024",
    readTime: "4 min read",
    icon: Wifi,
  },
  {
    title: "Mobile App Security",
    excerpt: "How to protect your financial information when using banking apps.",
    category: "Security",
    date: "April 5, 2024",
    readTime: "6 min read",
    icon: Smartphone,
  },
];

export default function TechPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Tech Blog</h1>
        <p className="text-xl text-gray-600 mb-12">
          Stay updated with the latest in financial technology, security, and digital banking innovations.
        </p>

        <div className="space-y-8">
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
    </div>
  );
} 