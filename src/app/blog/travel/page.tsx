import Link from "next/link";
import { ArrowRight, Plane, Globe, CreditCard, MapPin, Luggage } from "lucide-react";

const travelArticles = [
  {
    title: "Travel Hacks for Smart Budgeting",
    excerpt: "Learn how to save money while traveling without compromising on experiences.",
    category: "Travel Tips",
    date: "April 20, 2024",
    readTime: "6 min read",
    icon: CreditCard,
  },
  {
    title: "Best Travel Destinations for 2024",
    excerpt: "Discover the most exciting and budget-friendly destinations for your next adventure.",
    category: "Destinations",
    date: "April 15, 2024",
    readTime: "8 min read",
    icon: MapPin,
  },
  {
    title: "Managing Money While Traveling",
    excerpt: "Essential tips for handling your finances during international travel.",
    category: "Travel Finance",
    date: "April 10, 2024",
    readTime: "5 min read",
    icon: Globe,
  },
  {
    title: "Packing Smart for Your Next Trip",
    excerpt: "A comprehensive guide to packing efficiently and traveling light.",
    category: "Travel Tips",
    date: "April 5, 2024",
    readTime: "4 min read",
    icon: Luggage,
  },
  {
    title: "Travel Insurance: What You Need to Know",
    excerpt: "Understanding travel insurance and why it's essential for your trips.",
    category: "Travel Finance",
    date: "March 30, 2024",
    readTime: "7 min read",
    icon: Plane,
  },
];

export default function TravelPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Travel Blog</h1>
        <p className="text-xl text-gray-600 mb-12">
          Explore travel tips, destination guides, and smart ways to manage your money while traveling.
        </p>

        <div className="space-y-8">
          {travelArticles.map((article) => (
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
                    href={`/blog/travel/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
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