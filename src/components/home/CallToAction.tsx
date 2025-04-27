"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CallToAction() {
  return (
    <section className="py-16 md:py-24 bg-primary/10">
      <div className="n26-container">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold mb-4">Start banking with Ulster Delt today</h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Open your 100% mobile bank account in just 8 minutes and experience banking designed for the digital age.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button size="lg" className="text-base">
              Open free bank account
            </Button>
            <Button variant="outline" size="lg" className="text-base">
              Compare plans
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-primary">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
