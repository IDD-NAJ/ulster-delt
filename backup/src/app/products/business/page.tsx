import { Building2, CheckCircle2, ArrowRight } from "lucide-react";

export default function BusinessPage() {
  const features = [
    "Business current accounts",
    "Merchant services",
    "Business loans and credit",
    "International payments",
    "Payroll services",
    "Business credit cards",
    "Cash management",
    "Trade finance"
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Ulster Delt Business</h1>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-600 mb-6">
            Comprehensive banking solutions designed to help your business grow and succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Business Features</h2>
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
            <h2 className="text-2xl font-semibold mb-4">Business Benefits</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Financial Management</h3>
                <p className="text-gray-600">
                  Advanced tools for cash flow management and financial planning.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Global Reach</h3>
                <p className="text-gray-600">
                  International banking services and multi-currency accounts.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Dedicated Support</h3>
                <p className="text-gray-600">
                  Business relationship manager and priority customer service.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4">Business Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Startups</h3>
              <p className="text-gray-600">Specialized banking for new businesses</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">SMEs</h3>
              <p className="text-gray-600">Growth-focused solutions for small and medium enterprises</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Corporates</h3>
              <p className="text-gray-600">Enterprise-level banking and financial services</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <a href="/products/compare" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90">
            Compare Business Plans
          </a>
          <a href="/contact" className="border border-primary text-primary px-6 py-2 rounded-md hover:bg-primary/5">
            Speak to a Business Advisor
          </a>
        </div>
      </div>
    </div>
  );
} 