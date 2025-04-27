import Link from "next/link";
import { ArrowRight, Bank, Shield, Smartphone, Globe, Lock } from "lucide-react";

const bankingArticles = [
  {
    title: "The Future of Digital Banking",
    excerpt: "Exploring the latest trends and innovations in digital banking services.",
    category: "Digital Banking",
    date: "April 18, 2024",
    readTime: "6 min read",
    icon: Smartphone,
  },
  {
    title: "Banking Security Best Practices",
    excerpt: "Essential tips to keep your online banking secure and protected.",
    category: "Security",
    date: "April 12, 2024",
    readTime: "5 min read",
    icon: Shield,
  },
  {
    title: "International Banking Made Easy",
    excerpt: "A guide to managing your finances across borders with Ulster Delt.",
    category: "International",
    date: "April 8, 2024",
    readTime: "7 min read",
    icon: Globe,
  },
  {
    title: "Understanding Banking Fees",
    excerpt: "A comprehensive breakdown of common banking fees and how to avoid them.",
    category: "Banking Basics",
    date: "April 2, 2024",
    readTime: "4 min read",
    icon: Bank,
  },
  {
    title: "Protecting Your Digital Identity",
    excerpt: "Learn how to safeguard your personal information in the digital banking era.",
    category: "Security",
    date: "March 25, 2024",
    readTime: "5 min read",
    icon: Lock,
  },
];

export default function BankingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Banking Blog</h1>
        <p className="text-xl text-gray-600 mb-12">
          Discover insights about modern banking, security, and how to make the most of your banking experience.
        </p>

        <div className="space-y-8">
          {bankingArticles.map((article) => (
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
                    href={`/blog/banking/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
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