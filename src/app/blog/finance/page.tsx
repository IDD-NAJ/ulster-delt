import Link from "next/link";
import { ArrowRight, TrendingUp, PiggyBank, CreditCard, ChartBar } from "lucide-react";

const financeArticles = [
  {
    title: "Smart Budgeting Strategies for 2024",
    excerpt: "Learn how to create and maintain an effective budget in the current economic climate.",
    category: "Personal Finance",
    date: "April 15, 2024",
    readTime: "5 min read",
    icon: TrendingUp,
  },
  {
    title: "Investment Tips for Beginners",
    excerpt: "A comprehensive guide to starting your investment journey with confidence.",
    category: "Investing",
    date: "April 10, 2024",
    readTime: "7 min read",
    icon: ChartBar,
  },
  {
    title: "Saving for Your Future",
    excerpt: "Practical tips and strategies to build your savings effectively.",
    category: "Savings",
    date: "April 5, 2024",
    readTime: "4 min read",
    icon: PiggyBank,
  },
  {
    title: "Credit Card Management 101",
    excerpt: "How to use credit cards wisely and avoid common pitfalls.",
    category: "Credit",
    date: "March 28, 2024",
    readTime: "6 min read",
    icon: CreditCard,
  },
];

export default function FinancePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Finance Blog</h1>
        <p className="text-xl text-gray-600 mb-12">
          Stay informed with the latest insights and tips about personal finance, investing, and money management.
        </p>

        <div className="space-y-8">
          {financeArticles.map((article) => (
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
                    href={`/blog/finance/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
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