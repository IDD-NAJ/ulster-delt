import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  BookOpen, 
  Users, 
  AlertCircle,
  ArrowRight
} from "lucide-react";

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Support</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Help Center</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Find answers to common questions and learn how to use our services.
            </p>
            <div className="space-y-2">
              <a href="/help-center" className="flex items-center text-primary hover:underline">
                Visit Help Center <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <Phone className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Contact Us</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Get in touch with our support team through various channels.
            </p>
            <div className="space-y-2">
              <a href="/contact" className="flex items-center text-primary hover:underline">
                Contact Options <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <AlertCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">System Status</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Check the current status of our services and any ongoing issues.
            </p>
            <div className="space-y-2">
              <a href="/status" className="flex items-center text-primary hover:underline">
                View Status <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Community</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Connect with other customers and share experiences.
            </p>
            <div className="space-y-2">
              <a href="/community" className="flex items-center text-primary hover:underline">
                Join Community <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Account Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-primary hover:underline">Open an Account</a></li>
                <li><a href="#" className="text-primary hover:underline">Reset Password</a></li>
                <li><a href="#" className="text-primary hover:underline">Update Profile</a></li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Banking Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-primary hover:underline">Make a Transfer</a></li>
                <li><a href="#" className="text-primary hover:underline">Set Up Direct Debit</a></li>
                <li><a href="#" className="text-primary hover:underline">Report Lost Card</a></li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Security</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-primary hover:underline">Two-Factor Authentication</a></li>
                <li><a href="#" className="text-primary hover:underline">Security Tips</a></li>
                <li><a href="#" className="text-primary hover:underline">Report Fraud</a></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Support Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Documentation</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Access our comprehensive guides and documentation.
              </p>
              <a href="#" className="text-primary hover:underline">View Documentation →</a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <HelpCircle className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Video Tutorials</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Watch step-by-step guides for using our services.
              </p>
              <a href="#" className="text-primary hover:underline">Watch Tutorials →</a>
            </div>
          </div>
        </section>

        <div className="bg-primary/5 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Emergency Support</h2>
          <p className="text-gray-600 mb-4">
            For urgent matters outside of business hours, please contact our 24/7 emergency support:
          </p>
          <div className="space-y-2">
            <p><strong>Emergency Phone:</strong> +44 [Emergency Number]</p>
            <p><strong>Emergency Email:</strong> emergency@ulsterdelt.it.com</p>
          </div>
        </div>
      </div>
    </div>
  );
} 