import { Shield, Lock, AlertCircle, Key, Fingerprint, Eye, Bell } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Security</h1>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-600 mb-6">
            At Ulster Delt, your security is our top priority. We employ industry-leading security measures to protect your accounts and personal information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Our Security Measures</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">End-to-End Encryption</h3>
                  <p className="text-gray-600">All data is encrypted in transit and at rest</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Fingerprint className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Multi-Factor Authentication</h3>
                  <p className="text-gray-600">Enhanced login security with multiple verification steps</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">24/7 Monitoring</h3>
                  <p className="text-gray-600">Continuous monitoring of all systems and transactions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Security Features</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Real-Time Alerts</h3>
                  <p className="text-gray-600">Instant notifications for suspicious activity</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Key className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Secure Password Management</h3>
                  <p className="text-gray-600">Tools to help you create and manage strong passwords</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Fraud Protection</h3>
                  <p className="text-gray-600">Advanced systems to detect and prevent fraud</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4">Security Best Practices</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Create Strong Passwords</h3>
                <p className="text-gray-600">Use a combination of letters, numbers, and special characters</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Enable Two-Factor Authentication</h3>
                <p className="text-gray-600">Add an extra layer of security to your account</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Regular Security Updates</h3>
                <p className="text-gray-600">Keep your devices and software up to date</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Monitor Account Activity</h3>
                <p className="text-gray-600">Regularly review your transactions and statements</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Report Security Issues</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              If you notice any suspicious activity or have security concerns, please contact our security team immediately.
            </p>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="text-gray-600">security@ulsterdelt.com</p>
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