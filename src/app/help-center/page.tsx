import { HelpCircle } from "lucide-react";

export default function HelpCenterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Help Center</h1>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Account Management</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">How do I open an account?</h4>
                    <p className="text-gray-600">
                      You can open an account by visiting our website and clicking on the "Open Account" 
                      button. Follow the step-by-step process to complete your registration.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">How do I reset my password?</h4>
                    <p className="text-gray-600">
                      Click on "Forgot Password" on the login page and follow the instructions sent to 
                      your registered email address.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Banking Services</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">What are your banking hours?</h4>
                    <p className="text-gray-600">
                      Our digital banking services are available 24/7. For branch services, please check 
                      our branch locator for specific hours.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">How do I make a transfer?</h4>
                    <p className="text-gray-600">
                      Log in to your account, select "Transfers", and follow the instructions to complete 
                      your transfer. You can transfer between your accounts or to external accounts.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Security</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">How do I report suspicious activity?</h4>
                    <p className="text-gray-600">
                      If you notice any suspicious activity, please contact our security team immediately 
                      at security@ulsterdelt.com or call our 24/7 security hotline.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">What security measures do you have in place?</h4>
                    <p className="text-gray-600">
                      We use industry-standard encryption, two-factor authentication, and continuous 
                      monitoring to protect your account and transactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Support Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Video Tutorials</h3>
                <p className="text-gray-600 mb-4">
                  Watch step-by-step guides on how to use our services and features.
                </p>
                <a href="#" className="text-primary hover:underline">View Tutorials →</a>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-4">User Guides</h3>
                <p className="text-gray-600 mb-4">
                  Download comprehensive guides for all our services and features.
                </p>
                <a href="#" className="text-primary hover:underline">Download Guides →</a>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Still Need Help?</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-4">
                If you can't find the answer you're looking for, our support team is here to help.
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> support@ulsterdelt.com</p>
                <p><strong>Phone:</strong> +44 [Support Number]</p>
                <p><strong>Live Chat:</strong> Available 24/7 through our website</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 