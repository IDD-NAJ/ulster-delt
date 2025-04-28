import { Building2, CheckCircle2, ArrowRight } from "lucide-react";

export default function YouPage() {
  const features = [
    "Fully customizable banking experience",
    "Choose your own benefits package",
    "Personalized card design",
    "Flexible fee structure",
    "Dedicated relationship manager",
    "Priority service access",
    "Custom investment options",
    "Tailored rewards program"
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Ulster Delt You</h1>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-600 mb-6">
            A banking experience designed just for you. Choose the features and benefits that matter most to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Customizable Features</h2>
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
            <h2 className="text-2xl font-semibold mb-4">Personalization Options</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Card Design</h3>
                <p className="text-gray-600">
                  Create your own card design or choose from our premium collection.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Rewards Program</h3>
                <p className="text-gray-600">
                  Select rewards categories that match your lifestyle and spending habits.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Service Level</h3>
                <p className="text-gray-600">
                  Choose your preferred level of service and support.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">1</span>
              <div>
                <h3 className="font-semibold">Consultation</h3>
                <p className="text-gray-600">Meet with our personal banking advisor</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">2</span>
              <div>
                <h3 className="font-semibold">Customization</h3>
                <p className="text-gray-600">Select your preferred features and benefits</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">3</span>
              <div>
                <h3 className="font-semibold">Activation</h3>
                <p className="text-gray-600">Start using your personalized banking solution</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="flex flex-wrap gap-4">
          <a href="/products/compare" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90">
            Compare Plans
          </a>
          <a href="/contact" className="border border-primary text-primary px-6 py-2 rounded-md hover:bg-primary/5">
            Book a Consultation
          </a>
        </div>
      </div>
    </div>
  );
} 