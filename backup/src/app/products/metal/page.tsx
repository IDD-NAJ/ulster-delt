import { Shield, CheckCircle2, ArrowRight } from "lucide-react";

export default function MetalPage() {
  const features = [
    "Premium metal card design",
    "Exclusive airport lounge access",
    "Priority customer service",
    "Higher cashback rates",
    "Travel insurance coverage",
    "Concierge service",
    "Investment advisory",
    "Exclusive event invitations"
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Ulster Delt Metal</h1>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-600 mb-6">
            Our most exclusive banking experience. Premium benefits, exceptional service, and unparalleled rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Premium Features</h2>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Exclusive Benefits</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Travel Perks</h3>
                <p className="text-gray-600">
                  Access to over 1,000 airport lounges worldwide and comprehensive travel insurance.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Lifestyle Services</h3>
                <p className="text-gray-600">
                  24/7 concierge service for travel, dining, and entertainment bookings.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Investment Support</h3>
                <p className="text-gray-600">
                  Dedicated investment advisor and exclusive investment opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4">Eligibility Requirements</h2>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">1</span>
              <div>
                <h3 className="font-semibold">Minimum Income</h3>
                <p className="text-gray-600">Annual income of £100,000 or more</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">2</span>
              <div>
                <h3 className="font-semibold">Credit Score</h3>
                <p className="text-gray-600">Excellent credit history required</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">3</span>
              <div>
                <h3 className="font-semibold">Relationship</h3>
                <p className="text-gray-600">Existing Ulster Delt customer for at least 6 months</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="flex flex-wrap gap-4">
          <a href="/products/compare" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90">
            Compare Plans
          </a>
          <a href="/contact" className="border border-primary text-primary px-6 py-2 rounded-md hover:bg-primary/5">
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
} 