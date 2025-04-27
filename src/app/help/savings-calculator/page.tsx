'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calculator, HelpCircle, ArrowRight, BookOpen, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SavingsCalculatorHelpPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Savings Calculator Guide</h1>
          <p className="text-xl text-gray-600">Learn how to use the savings calculator effectively</p>
        </div>

        {/* Quick Navigation */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/tools/savings-calculator">
              <Button variant="outline" className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Open Calculator
              </Button>
            </Link>
            <Link href="/tools/savings-goals">
              <Button variant="outline" className="w-full">
                <ArrowRight className="w-4 h-4 mr-2" />
                Set Savings Goals
              </Button>
            </Link>
          </div>
        </Card>

        {/* Basic Usage */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">1. Initial Deposit</h3>
              <p className="text-gray-600">
                Enter the amount you're starting with. This can be zero if you're starting from scratch.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">2. Monthly Contribution</h3>
              <p className="text-gray-600">
                Input how much you plan to save each month. Regular contributions can significantly impact your savings growth.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">3. Interest Rate</h3>
              <p className="text-gray-600">
                Enter the annual interest rate as a percentage. For example, if your rate is 3.5%, enter "3.5".
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">4. Investment Term</h3>
              <p className="text-gray-600">
                Specify how long you plan to save, in years. The calculator will show you how your money could grow over this period.
              </p>
            </div>
          </div>
        </Card>

        {/* Understanding Results */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Understanding Your Results</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Total Savings</h3>
              <p className="text-gray-600">
                The final amount you'll have after the specified period, including your initial deposit, 
                all contributions, and compound interest.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Total Interest Earned</h3>
              <p className="text-gray-600">
                The amount earned from interest alone. This shows how your money works for you over time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Total Contributions</h3>
              <p className="text-gray-600">
                The sum of your initial deposit and all monthly contributions, not including interest earned.
              </p>
            </div>
          </div>
        </Card>

        {/* Tips and Best Practices */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Tips for Better Planning</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Be realistic with your monthly contribution amounts to ensure you can maintain them.</span>
            </li>
            <li className="flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Consider different scenarios by trying various interest rates and time periods.</span>
            </li>
            <li className="flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Remember that interest rates can change over time - consider this in your long-term planning.</span>
            </li>
            <li className="flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Use the calculator regularly to track your progress and adjust your savings strategy.</span>
            </li>
          </ul>
        </Card>

        {/* Important Notes */}
        <Alert className="mb-8">
          <HelpCircle className="h-4 w-4" />
          <AlertDescription>
            The calculator assumes a fixed interest rate and regular contributions. Actual returns may vary 
            based on market conditions and your specific financial product.
          </AlertDescription>
        </Alert>

        {/* Additional Resources */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/tools/rate-alerts">
              <Button variant="outline" className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Rate Alerts
              </Button>
            </Link>
            <Link href="/tools/auto-save">
              <Button variant="outline" className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Auto-Save Setup
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
} 