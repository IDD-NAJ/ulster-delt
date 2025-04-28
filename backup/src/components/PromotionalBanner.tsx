"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function PromotionalBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        // Scrolling down - hide the banner
        setIsVisible(false);
      } else {
        // Scrolling up - show the banner
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    // Set the banner height CSS variable
    document.documentElement.style.setProperty('--banner-height', isVisible ? '40px' : '0px');
    return () => {
      document.documentElement.style.removeProperty('--banner-height');
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-background border-b px-4 py-2 text-center text-sm transition-all duration-300">
      Open your salary account with Ulster Delt and get £75!{" "}
      <Link href="/learn-more" className="text-primary hover:underline">
        Learn more
      </Link>
    </div>
  );
} 