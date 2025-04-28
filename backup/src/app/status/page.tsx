import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function StatusPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">System Status</h1>
        
        <div className="mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <h2 className="text-2xl font-semibold">All Systems Operational</h2>
            </div>
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Core Services</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Online Banking</span>
                </div>
                <span className="text-green-500">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Mobile App</span>
                </div>
                <span className="text-green-500">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Payment Processing</span>
                </div>
                <span className="text-green-500">Operational</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Support Services</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Customer Support</span>
                </div>
                <span className="text-green-500">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Live Chat</span>
                </div>
                <span className="text-green-500">Operational</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Scheduled Maintenance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span>System Update</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">May 15, 2024</p>
                  <p className="text-sm text-gray-600">2:00 AM - 4:00 AM GMT</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Status History</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>All systems operational</span>
              </div>
              <span className="text-gray-600">April 27, 2024</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span>Partial service disruption</span>
              </div>
              <span className="text-gray-600">April 20, 2024</span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            For real-time updates, follow us on Twitter: 
            <a href="#" className="text-primary hover:underline ml-1">@UlsterDeltStatus</a>
          </p>
        </div>
      </div>
    </div>
  );
} 