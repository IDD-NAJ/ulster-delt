import { Users, CheckCircle2, ArrowRight } from "lucide-react";

export default function SmartPage() {
  const features = [
    "Smart budgeting tools and spending insights",
    "1% cashback on all purchases",
    "No foreign transaction fees",
    "Free ATM withdrawals worldwide",
    "Priority customer support",
    "Mobile banking with biometric login",
    "Customizable savings goals",
    "Monthly fee: £5"
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Ulster Delt Smart</h1>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-600 mb-6">
            Smart banking with intelligent features to help you manage your money better.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
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
            <h2 className="text-2xl font-semibold mb-4">Smart Benefits</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Smart Budgeting</h3>
                <p className="text-gray-600">
                  Our AI-powered tools analyze your spending patterns and help you create personalized budgets.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Cashback Rewards</h3>
                <p className="text-gray-600">
                  Earn 1% cashback on all your purchases, automatically credited to your account.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Global Access</h3>
                <p className="text-gray-600">
                  Use your card anywhere in the world with no foreign transaction fees.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4">How to Apply</h2>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">1</span>
              <div>
                <h3 className="font-semibold">Check Eligibility</h3>
                <p className="text-gray-600">Verify your eligibility in minutes</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">2</span>
              <div>
                <h3 className="font-semibold">Complete Application</h3>
                <p className="text-gray-600">Fill out our simple online application form</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">3</span>
              <div>
                <h3 className="font-semibold">Get Approved</h3>
                <p className="text-gray-600">Receive instant approval and start using your account</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="flex flex-wrap gap-4">
          <a href="/products/compare" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90">
            Compare Plans
          </a>
          <a href="/contact" className="border border-primary text-primary px-6 py-2 rounded-md hover:bg-primary/5">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
} 