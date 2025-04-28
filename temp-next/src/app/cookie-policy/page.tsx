import { Cookie } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Cookie className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Cookie Policy</h1>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            Last updated: April 27, 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              This Cookie Policy explains how Ulster Delt uses cookies and similar technologies 
              to recognize you when you visit our website and use our services. It explains what 
              these technologies are and why we use them, as well as your rights to control our 
              use of them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. What Are Cookies?</h2>
            <p>
              Cookies are small data files that are placed on your computer or mobile device 
              when you visit a website. Cookies are widely used by website owners to make their 
              websites work, or to work more efficiently, as well as to provide reporting 
              information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Essential Cookies</h3>
                <p>
                  These cookies are strictly necessary to provide you with services available 
                  through our website and to use some of its features, such as access to secure 
                  areas.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Performance Cookies</h3>
                <p>
                  These cookies are used to enhance the performance and functionality of our 
                  website but are non-essential to their use. However, without these cookies, 
                  certain functionality may become unavailable.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Analytics Cookies</h3>
                <p>
                  These cookies help us understand how visitors interact with our website by 
                  collecting and reporting information anonymously.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Functionality Cookies</h3>
                <p>
                  These cookies allow our website to remember choices you have made in the past, 
                  such as your preferred language or region.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. How to Control Cookies</h2>
            <p>
              You can control and/or delete cookies as you wish. You can delete all cookies that 
              are already on your computer and you can set most browsers to prevent them from 
              being placed. If you do this, however, you may have to manually adjust some 
              preferences every time you visit our website and some services and functionalities 
              may not work.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Third-Party Cookies</h2>
            <p>
              In some special cases, we also use cookies provided by trusted third parties. The 
              following section details which third party cookies you might encounter through 
              this site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes to the 
              cookies we use or for other operational, legal, or regulatory reasons. Please 
              therefore revisit this Cookie Policy regularly to stay informed about our use of 
              cookies and related technologies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or other technologies, please 
              contact us at:
              <br />
              Email: privacy@ulsterdelt.com
              <br />
              Address: Ulster Delt Headquarters, London, United Kingdom
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 