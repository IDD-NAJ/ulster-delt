"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";

const cards = [
  {
    id: "standard",
    name: "Ulster Delt Standard",
    description: "A free bank account with a transparent Mastercard, 100% mobile.",
    price: "Free",
    color: "bg-white border border-gray-200 text-foreground",
    features: [
      "Free bank account",
      "Free card payments worldwide",
      "Free ATM withdrawals in euros",
      "Spaces sub-accounts",
      "Push notifications",
    ],
  },
  {
    id: "smart",
    name: "Ulster Delt Smart",
    description: "A bank account with a colored Mastercard and more Spaces.",
    price: "€4.90/month",
    color: "bg-primary text-white",
    features: [
      "Everything in Ulster Delt Standard",
      "Free ATM withdrawals worldwide",
      "Travel insurance",
      "Phone insurance",
      "Partner offers",
    ],
  },
  {
    id: "you",
    name: "Ulster Delt You",
    description: "A premium account with exclusive travel benefits.",
    price: "€9.90/month",
    color: "bg-blue-500 text-white",
    features: [
      "Everything in Ulster Delt Smart",
      "Metal card",
      "Allianz insurance package",
      "Priority support",
      "Exclusive partner offers",
    ],
  },
  {
    id: "metal",
    name: "Ulster Delt Metal",
    description: "Our most premium card crafted from stainless steel.",
    price: "€16.90/month",
    color: "bg-zinc-800 text-white",
    features: [
      "Everything in Ulster Delt You",
      "Premium metal card",
      "Lounge access",
      "Car rental insurance",
      "Exclusive events",
    ],
  },
];

export function CardShowcase() {
  const [activeCard, setActiveCard] = useState("standard");

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="n26-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose the card that suits you
          </h2>
          <p className="text-lg text-gray-600">
            From standard to premium, there's an Ulster Delt card for everyone. Compare our plans and find the one that fits your needs.
          </p>
        </div>

        <Tabs defaultValue="standard" value={activeCard} onValueChange={setActiveCard} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {cards.map((card) => (
                <TabsTrigger
                  key={card.id}
                  value={card.id}
                  className="text-sm py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {card.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {cards.map((card) => (
            <TabsContent key={card.id} value={card.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Card Display */}
                <div className="flex justify-center">
                  <div className={`w-80 h-48 rounded-xl ${card.color} shadow-lg flex flex-col justify-between p-6`}>
                    <div className="flex justify-between items-start">
                      <span className="text-lg font-semibold">{card.name}</span>
                      <span className="text-xl font-bold">Ulster Delt</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="mb-2 text-xs opacity-80">VALID THRU</div>
                        <div className="font-mono">12/28</div>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-8 h-8 rounded-full bg-red-500 opacity-80" />
                        <div className="w-8 h-8 rounded-full bg-yellow-500 opacity-80" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">{card.name}</h3>
                    <p className="text-gray-600 mb-4">{card.description}</p>
                    <div className="text-xl font-bold text-primary mb-6">{card.price}</div>
                  </div>

                  <ul className="space-y-3">
                    {card.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <span className="mr-2 mt-1 text-primary">
                          <Check className="h-4 w-4" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button size="lg" className="mt-4">
                    Get {card.name}
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
