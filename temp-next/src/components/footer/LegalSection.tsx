import Link from "next/link";

export function LegalSection() {
  const legalLinks = [
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookie Policy", href: "/cookie-policy" },
    { name: "Banking License", href: "/banking-license" },
    { name: "Imprint", href: "/imprint" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
      <ul className="space-y-2">
        {legalLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 