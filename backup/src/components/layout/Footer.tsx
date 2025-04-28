import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { BlogSection } from "@/components/footer/BlogSection";
import { LegalSection } from "@/components/footer/LegalSection";
import { SupportSection } from "@/components/footer/SupportSection";
import { ProductsSection } from "@/components/footer/ProductsSection";
import { CompanySection } from "@/components/footer/CompanySection";

const socialLinks = [
  { Icon: Facebook, href: "https://facebook.com/ulsterdelt", label: "Facebook" },
  { Icon: Twitter, href: "https://twitter.com/ulsterdelt", label: "Twitter" },
  { Icon: Instagram, href: "https://instagram.com/ulsterdelt", label: "Instagram" },
  { Icon: Linkedin, href: "https://linkedin.com/company/ulsterdelt", label: "LinkedIn" },
  { Icon: Youtube, href: "https://youtube.com/ulsterdelt", label: "YouTube" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8">
      <div className="n26-container">
        {/* Logo and social links */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-6 md:mb-0">
              <span className="text-2xl font-bold">Ulster Delt</span>
            </Link>
          </div>
          <div className="flex space-x-4">
            {socialLinks.map(({ Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <Icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>

        {/* Footer links grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-12">
          <BlogSection />
          <LegalSection />
          <SupportSection />
          <ProductsSection />
          <CompanySection />
        </div>

        {/* App store links */}
        <div className="mb-12">
          <h3 className="font-semibold text-sm mb-4">Get the app</h3>
          <div className="flex flex-wrap gap-4">
            <Link href="https://apps.apple.com/app/ulsterdelt" className="flex h-10 w-32 items-center justify-center rounded-md border border-gray-300 bg-white">
              <span className="text-xs">App Store</span>
            </Link>
            <Link href="https://play.google.com/store/apps/details?id=com.ulsterdelt.android" className="flex h-10 w-32 items-center justify-center rounded-md border border-gray-300 bg-white">
              <span className="text-xs">Google Play</span>
            </Link>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom footer with legal information */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <div className="mb-4 md:mb-0">
            <p>© {currentYear} Ulster Delt GmbH. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/cookie-policy" className="hover:text-primary transition-colors">Cookies</Link>
            <Link href="/accessibility" className="hover:text-primary transition-colors">Accessibility</Link>
            <div className="flex items-center">
              <span className="mr-2">Language:</span>
              <select className="bg-transparent border-none text-xs focus:outline-none">
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="it">Italiano</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
