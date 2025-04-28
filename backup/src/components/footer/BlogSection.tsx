import Link from "next/link";

export function BlogSection() {
  const blogCategories = [
    { name: "Finance", href: "/blog/finance" },
    { name: "Banking", href: "/blog/banking" },
    { name: "Travel", href: "/blog/travel" },
    { name: "Lifestyle", href: "/blog/lifestyle" },
    { name: "Tech", href: "/blog/tech" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Blog</h3>
      <ul className="space-y-2">
        {blogCategories.map((category) => (
          <li key={category.name}>
            <Link
              href={category.href}
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 