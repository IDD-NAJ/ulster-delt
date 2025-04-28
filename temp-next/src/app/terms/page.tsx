import { ScrollText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <ScrollText className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Terms & Conditions</h1>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            Last updated: April 27, 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to Ulster Delt. These Terms and Conditions govern your use of our services, 
              including our website, mobile applications, and banking services. By accessing or using 
              our services, you agree to be bound by these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Account Registration</h2>
            <p>
              To use our services, you must register for an account. You agree to provide accurate 
              and complete information during registration and to keep this information updated.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Use of Services</h2>
            <p>
              You agree to use our services only for lawful purposes and in accordance with these 
              Terms. You are responsible for maintaining the confidentiality of your account 
              credentials and for all activities that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Fees and Charges</h2>
            <p>
              We may charge fees for certain services. All fees will be clearly displayed before 
              you use a service. You are responsible for paying all fees associated with your 
              use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand how 
              we collect, use, and protect your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p>
              All content, trademarks, and other intellectual property on our services are owned 
              by or licensed to Ulster Delt. You may not use, reproduce, or distribute any content 
              without our prior written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Ulster Delt shall not be liable for any 
              indirect, incidental, special, consequential, or punitive damages resulting from 
              your use of or inability to use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. We will notify you of any material changes 
              through our services or by email. Your continued use of our services after such 
              changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the 
              United Kingdom, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <br />
              Email: legal@ulsterdelt.com
              <br />
              Address: Ulster Delt Headquarters, London, United Kingdom
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 