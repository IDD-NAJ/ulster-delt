import { 
  Building2, 
  Briefcase, 
  Newspaper, 
  LineChart, 
  Shield,
  Users,
  AlertCircle,
  ArrowRight
} from "lucide-react";

export default function CompanyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Our Company</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <Building2 className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">About Us</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Learn about our mission, values, and the story behind Ulster Delt.
            </p>
            <a href="/company/about" className="flex items-center text-primary hover:underline">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <Briefcase className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Careers</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Join our team and be part of the future of banking.
            </p>
            <a href="/company/careers" className="flex items-center text-primary hover:underline">
              View Opportunities <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <Newspaper className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Press</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Latest news, press releases, and media resources.
            </p>
            <a href="/company/press" className="flex items-center text-primary hover:underline">
              View Press Center <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <LineChart className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Investor Relations</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Financial information and updates for our investors.
            </p>
            <a href="/company/investors" className="flex items-center text-primary hover:underline">
              Investor Information <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Corporate Governance</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Our commitment to ethical business practices and transparency.
            </p>
            <a href="/company/governance" className="flex items-center text-primary hover:underline">
              View Governance <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Security</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Our commitment to protecting your data and assets.
            </p>
            <a href="/company/security" className="flex items-center text-primary hover:underline">
              Security Center <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <AlertCircle className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">File a Complaint</h2>
          </div>
          <p className="text-gray-600 mb-4">
            We take all complaints seriously. Learn how to file a complaint and our resolution process.
          </p>
          <a href="/company/complaints" className="flex items-center text-primary hover:underline">
            Complaint Process <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
} 