import { LineChart, FileText, Calendar, Mail, Download, Phone } from "lucide-react";

export default function InvestorRelationsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <LineChart className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Investor Relations</h1>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-600 mb-6">
            Welcome to Ulster Delt's Investor Relations page. Here you'll find comprehensive information about our financial performance and corporate governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Financial Reports</h2>
            <div className="space-y-6">
              <div className="border-b pb-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Q1 2024</span>
                </div>
                <h3 className="font-semibold text-lg">Quarterly Financial Report</h3>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  <a href="#" className="text-primary hover:underline">Download PDF</a>
                </div>
              </div>
              <div className="border-b pb-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>2023</span>
                </div>
                <h3 className="font-semibold text-lg">Annual Report</h3>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  <a href="#" className="text-primary hover:underline">Download PDF</a>
                </div>
              </div>
              <div className="border-b pb-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>2023</span>
                </div>
                <h3 className="font-semibold text-lg">Sustainability Report</h3>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  <a href="#" className="text-primary hover:underline">Download PDF</a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Stock Information</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Current Share Price</h3>
                <p className="text-2xl font-bold text-primary">£45.67</p>
                <p className="text-gray-600">As of April 27, 2024</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Market Capitalization</h3>
                <p className="text-2xl font-bold text-primary">£2.5B</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Trading Information</h3>
                <p className="text-gray-600">LSE: UDLT</p>
                <p className="text-gray-600">ISIN: GB00B1234567</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Q2 2024 Earnings Call</h3>
                <p className="text-gray-600">July 15, 2024 at 9:00 AM GMT</p>
                <a href="#" className="text-primary hover:underline">Register to Attend</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Annual General Meeting</h3>
                <p className="text-gray-600">June 10, 2024 at 2:00 PM GMT</p>
                <a href="#" className="text-primary hover:underline">View Details</a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-12">
          <h2 className="text-2xl font-semibold mb-4">Investor Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <FileText className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold mb-2">Financial Calendar</h3>
              <p className="text-gray-600 mb-2">View upcoming financial events and reporting dates</p>
              <a href="#" className="text-primary hover:underline">View Calendar</a>
            </div>
            <div className="p-4 border rounded-lg">
              <FileText className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold mb-2">Corporate Governance</h3>
              <p className="text-gray-600 mb-2">Learn about our governance structure and policies</p>
              <a href="#" className="text-primary hover:underline">View Details</a>
            </div>
            <div className="p-4 border rounded-lg">
              <FileText className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold mb-2">Shareholder Services</h3>
              <p className="text-gray-600 mb-2">Access shareholder information and services</p>
              <a href="#" className="text-primary hover:underline">View Services</a>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Contact Investor Relations</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="text-gray-600">investors@ulsterdelt.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="text-gray-600">+44 (0) 800 123 4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 