import Link from "next/link";
import { HelpCircle, Mail, Activity, Users } from "lucide-react";

export function SupportSection() {
  const supportLinks = [
    { name: "Help Center", href: "/support", icon: HelpCircle },
    { name: "Contact", href: "/contact", icon: Mail },
    { name: "Status", href: "/status", icon: Activity },
    { name: "Community", href: "/community", icon: Users },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Support</h3>
      <ul className="space-y-2">
        {supportLinks.map((link) => (
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