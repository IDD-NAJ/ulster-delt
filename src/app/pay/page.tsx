'use client';

import { Hero } from '@/components/ui/hero';
import { Button } from '@/components/ui/button';
import { 
  SendHorizontal, 
  CreditCard, 
  Repeat, 
  Globe, 
  QrCode,
  Receipt
} from 'lucide-react';
import Link from 'next/link';
import { Card } from "@/components/ui/card";

const paymentOptions = [
  {
    title: "Send Money",
    description: "Transfer money to friends and family instantly",
    icon: SendHorizontal,
    href: "/pay/send-money",
    color: "text-blue-500"
  },
  {
    title: "Card Payments",
    description: "Manage your card payments and limits",
    icon: CreditCard,
    href: "/pay/card-payments",
    color: "text-purple-500"
  },
  {
    title: "Standing Orders",
    description: "Set up regular payments",
    icon: Repeat,
    href: "/pay/standing-orders",
    color: "text-green-500"
  },
  {
    title: "International Transfers",
    description: "Send money worldwide with great exchange rates",
    icon: Globe,
    href: "/pay/international",
    color: "text-orange-500"
  },
  {
    title: "QR Payments",
    description: "Pay quickly using QR codes",
    icon: QrCode,
    href: "/pay/qr-payments",
    color: "text-pink-500"
  },
  {
    title: "Bills & Utilities",
    description: "Pay your bills and manage utilities",
    icon: Receipt,
    href: "/pay/bills",
    color: "text-yellow-500"
  }
];

export default function PayPage() {
  return (
    <div>
      <Hero
        title="Make a Payment"
        subtitle="Fast, secure, and convenient payment options for all your needs."
        imagePath="/hero-pay.jpg"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 max-w-4xl mx-auto mt-6 sm:mt-8 px-4 sm:px-6">
          {paymentOptions.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 h-auto text-xs sm:text-sm whitespace-normal text-center"
              asChild
            >
              <Link href={option.href}>
                <option.icon className="h-5 w-5 sm:h-6 sm:w-6 mb-1" />
                {option.title}
              </Link>
            </Button>
          ))}
        </div>
      </Hero>
      <div className="container mx-auto py-8 sm:py-12 px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">Payments & Transfers</h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600">Choose how you want to pay</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {paymentOptions.map((option) => (
            <Link href={option.href} key={option.title}>
              <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className={`${option.color}`}>
                      <option.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold">{option.title}</h2>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 flex-grow">{option.description}</p>
                  <Button className="w-full text-sm sm:text-base">
                    Get Started
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 