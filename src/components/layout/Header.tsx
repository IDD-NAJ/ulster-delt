"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Globe, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { TransactionHistory } from "@/components/transactions/TransactionHistory";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const mainNavItems = [
  { name: "Bank", href: "/bank" },
  { name: "Financial Products", href: "/financial-products" },
  { name: "Manage", href: "/manage" },
  { name: "Pay", href: "/pay" },
  { name: "More", href: "#", hasDropdown: true },
  { name: "Blog", href: "/blog" },
];

const languages = [
  { name: "English", code: "EN" },
  { name: "Deutsch", code: "DE" },
  { name: "Français", code: "FR" },
  { name: "Español", code: "ES" },
  { name: "Italiano", code: "IT" },
];

export function Header() {
  const { data: session } = useSession();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if we're scrolled from the top
      setIsScrolled(currentScrollY > 0);
      
      // Determine scroll direction and visibility
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 w-full bg-white transition-all duration-300 transform",
      isScrolled ? "shadow-sm" : "",
      isVisible ? "translate-y-0" : "-translate-y-full"
    )}>
      <PromotionalBanner />
      <div className="relative bg-white border-b border-gray-100">
        <div className="n26-container flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold">Ulster Delt</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {mainNavItems.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <DropdownMenu onOpenChange={(open) => {
                    if (open) setActiveDropdown(item.name);
                    else if (activeDropdown === item.name) setActiveDropdown(null);
                  }}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="link" className="text-foreground">
                        {item.name} <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <Link href="/features" className="w-full">Features</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/about" className="w-full">About</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/careers" className="w-full">Careers</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/support" className="w-full">Support</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-foreground hover:text-primary"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Language selector & CTA buttons or Profile */}
          <div className="hidden lg:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center">
                  <Globe className="mr-1 h-4 w-4" />
                  <span>EN</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem key={lang.code}>
                    {lang.name} ({lang.code})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <UserCircle className="h-6 w-6" />
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {session.user?.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/dashboard" className="w-full">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings" className="w-full">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600"
                    onSelect={() => signOut()}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/online-banking">
                  <Button variant="ghost" className="text-foreground">
                    Online Banking
                  </Button>
                </Link>
                <Link href="/open-account">
                  <Button className="bg-primary text-white hover:bg-primary/90">
                    Open Bank Account
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80">
                <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                <div className="mt-6 flex flex-col space-y-4">
                  {mainNavItems.map((item) => (
                    <SheetClose key={item.name} asChild>
                      <Link
                        href={item.href}
                        className="text-lg font-medium text-foreground hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="h-px w-full bg-gray-200 my-4" />
                  {session ? (
                    <>
                      <SheetClose asChild>
                        <Link href="/dashboard">
                          <Button variant="outline" className="w-full">
                            Dashboard
                          </Button>
                        </Link>
                      </SheetClose>
                      <Button 
                        variant="outline" 
                        className="w-full text-red-600 hover:text-red-600"
                        onClick={() => signOut()}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link href="/online-banking">
                          <Button variant="outline" className="w-full">
                            Online Banking
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/open-account">
                          <Button className="w-full">Open Bank Account</Button>
                        </Link>
                      </SheetClose>
                    </>
                  )}
                  <div className="h-px w-full bg-gray-200 my-4" />
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <Button
                        key={lang.code}
                        variant="ghost"
                        size="sm"
                        className="text-foreground"
                      >
                        {lang.code}
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
