import { AlertCircle, Mail, Phone, Clock } from "lucide-react";

export default function ComplaintPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <AlertCircle className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Submit a Complaint</h1>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-600 mb-6">
            We take all complaints seriously and are committed to resolving them fairly and promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">How to Submit a Complaint</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Online Form</h3>
                <p className="text-gray-600">
                  Complete our complaint form below for the fastest response.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-600">
                  Send your complaint to complaints@ulsterdelt.com
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-gray-600">
                  Call our complaints team at +44 (0) 800 123 4567
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Post</h3>
                <p className="text-gray-600">
                  Write to us at: Complaints Department, Ulster Delt, 123 Financial Street, London, EC1A 1AA
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Complaint Process</h2>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">1</span>
                <div>
                  <h3 className="font-semibold">Initial Response</h3>
                  <p className="text-gray-600">We'll acknowledge your complaint within 24 hours</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">2</span>
                <div>
                  <h3 className="font-semibold">Investigation</h3>
                  <p className="text-gray-600">We'll investigate your complaint thoroughly</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">3</span>
                <div>
                  <h3 className="font-semibold">Resolution</h3>
                  <p className="text-gray-600">We aim to resolve complaints within 8 weeks</p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-12">
          <h2 className="text-2xl font-semibold mb-6">Complaint Form</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" className="w-full px-4 py-2 border rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                <input type="text" className="w-full px-4 py-2 border rounded-md" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input type="email" className="w-full px-4 py-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input type="text" className="w-full px-4 py-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Complaint Details</label>
              <textarea className="w-full px-4 py-2 border rounded-md h-32" required></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Resolution</label>
              <textarea className="w-full px-4 py-2 border rounded-md h-24"></textarea>
            </div>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90">
              Submit Complaint
            </button>
          </form>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Financial Ombudsman Service</h2>
          <p className="text-gray-600 mb-4">
            If you're not satisfied with our response, you can refer your complaint to the Financial Ombudsman Service.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="text-gray-600">customerservices@ulsterdelt.it.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="text-gray-600">0800 023 4567</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="text-gray-600">Monday to Friday, 8am to 8pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 