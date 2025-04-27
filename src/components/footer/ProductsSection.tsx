import Link from "next/link";
import { CreditCard, Smartphone, User, Shield, Building2, Scale, AlertTriangle } from "lucide-react";

export function ProductsSection() {
  const products = [
    { name: "Ulster Delt Standard", href: "/products/standard", icon: CreditCard },
    { name: "Ulster Delt Smart", href: "/products/smart", icon: Smartphone },
    { name: "Ulster Delt You", href: "/products/you", icon: User },
    { name: "Ulster Delt Metal", href: "/products/metal", icon: Shield },
    { name: "Ulster Delt Business", href: "/products/business", icon: Building2 },
    { name: "Compare plans", href: "/products/compare", icon: Scale },
    { name: "File a complaint", href: "/complaints", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Products</h3>
      <ul className="space-y-2">
        {products.map((product) => (
          <li key={product.name}>
            <Link
              href={product.href}
              className="flex items-center text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <product.icon className="mr-2 h-4 w-4" />
              {product.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 