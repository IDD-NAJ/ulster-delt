"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarIcon } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Digital Marketing Manager",
    text: "I've been using Ulster Delt for over 2 years now and I absolutely love it. The app is so intuitive and I can manage everything from my phone. The instant notifications are a game-changer!",
  },
  {
    name: "Michael T.",
    role: "Frequent Traveler",
    text: "Ulster Delt has made traveling so much easier. No foreign transaction fees and great exchange rates. I can withdraw cash anywhere in the world without worrying about excessive fees.",
  },
  {
    name: "Julie D.",
    location: "Paris, France",
    avatar: "/avatars/julie.jpg",
    rating: 4,
    text: "The Spaces feature has completely changed how I save money. I've created different sub-accounts for my travel fund, emergency savings, and rent. It's so easy to track my progress!",
  },
  {
    name: "Thomas H.",
    location: "Vienna, Austria",
    avatar: "/avatars/thomas.jpg",
    rating: 5,
    text: "Customer service is top-notch! I had an issue with a transaction and they resolved it within hours. The chat support is available 24/7 and they're always friendly and helpful.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="n26-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join over 8 million customers who trust Ulster Delt for their banking needs. Here's what some of them have to say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={`${testimonial.name}-${index}`} className="border-gray-200 h-full">
              <CardContent className="pt-6">
                {/* Rating */}
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={`star-${i}`}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-gray-700 mb-6">{testimonial.text}</p>

                {/* User info */}
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* App store ratings */}
        <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={`app-star-${i}`} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-gray-600">4.8/5 on App Store</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={`google-star-${i}`} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-gray-600">4.6/5 on Google Play</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={`trustpilot-star-${i}`} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-gray-600">4.4/5 on Trustpilot</p>
          </div>
        </div>
      </div>
    </section>
  );
}
