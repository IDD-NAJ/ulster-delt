import Link from "next/link";
import { Building, Briefcase, Newspaper, BarChart2, Shield, Users } from "lucide-react";

export function CompanySection() {
  const companyLinks = [
    { name: "About us", href: "/about", icon: Building },
    { name: "Careers", href: "/careers", icon: Briefcase },
    { name: "Press", href: "/press", icon: Newspaper },
    { name: "Investor Relations", href: "/investor-relations", icon: BarChart2 },
    { name: "Corporate Governance", href: "/corporate-governance", icon: Users },
    { name: "Security", href: "/security", icon: Shield },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Company</h3>
      <ul className="space-y-2">
        {companyLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="flex items-center text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 