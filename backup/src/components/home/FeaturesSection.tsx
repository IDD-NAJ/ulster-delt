"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ScanFace, BellRing, Lock, PiggyBank, BarChart3 } from "lucide-react";

const features = [
  {
    title: "Mastercard debit card",
    description: "Get a Mastercard debit card accepted worldwide, plus up to 5 virtual cards for secure online shopping.",
    icon: CreditCard,
  },
  {
    title: "Instant push notifications",
    description: "Get real-time alerts for all account activity, so you're always in the know about your money.",
    icon: BellRing,
  },
  {
    title: "Biometric identification",
    description: "Log in securely with your face or fingerprint for fast, safe access to your account.",
    icon: ScanFace,
  },
  {
    title: "Advanced security",
    description: "Enjoy peace of mind with 3D Secure online payments and the ability to lock your card instantly.",
    icon: Lock,
  },
  {
    title: "Spaces sub-accounts",
    description: "Create up to 10 sub-accounts to organize your money for specific goals or expenses.",
    icon: PiggyBank,
  },
  {
    title: "Spending insights",
    description: "Track your spending habits with automatic categorization and monthly statistics.",
    icon: BarChart3,
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="n26-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Ulster Delt?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ulster Delt gives you everything you need to manage your money with confidence. Here are just a few of the features that make banking with Ulster Delt better.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-gray-200 transition-all hover:shadow-md hover:border-primary/30">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
