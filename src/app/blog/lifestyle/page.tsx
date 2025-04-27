import Link from "next/link";
import { ArrowRight, Home, Heart, ShoppingBag, Coffee, Utensils } from "lucide-react";

const lifestyleArticles = [
  {
    title: "Smart Home Budgeting",
    excerpt: "Tips for managing household expenses and creating a sustainable budget.",
    category: "Home Finance",
    date: "April 22, 2024",
    readTime: "5 min read",
    icon: Home,
  },
  {
    title: "Sustainable Living on a Budget",
    excerpt: "How to adopt eco-friendly habits without breaking the bank.",
    category: "Sustainability",
    date: "April 17, 2024",
    readTime: "6 min read",
    icon: Heart,
  },
  {
    title: "Smart Shopping Strategies",
    excerpt: "Learn how to make the most of your shopping budget and find the best deals.",
    category: "Shopping",
    date: "April 12, 2024",
    readTime: "4 min read",
    icon: ShoppingBag,
  },
  {
    title: "Budget-Friendly Entertainment",
    excerpt: "Discover ways to enjoy your free time without overspending.",
    category: "Entertainment",
    date: "April 7, 2024",
    readTime: "5 min read",
    icon: Coffee,
  },
  {
    title: "Eating Well on a Budget",
    excerpt: "Tips for maintaining a healthy diet while keeping costs under control.",
    category: "Food & Dining",
    date: "April 3, 2024",
    readTime: "7 min read",
    icon: Utensils,
  },
];

export default function LifestylePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Lifestyle Blog</h1>
        <p className="text-xl text-gray-600 mb-12">
          Explore tips and insights for living well while managing your finances effectively.
        </p>

        <div className="space-y-8">
          {lifestyleArticles.map((article) => (
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
                    href={`/blog/lifestyle/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
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