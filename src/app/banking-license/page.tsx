import { Building2 } from "lucide-react";

export default function BankingLicensePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Banking License</h1>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            Last updated: April 27, 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Regulatory Status</h2>
            <p>
              Ulster Delt is authorized and regulated by the Financial Conduct Authority (FCA) 
              and the Prudential Regulation Authority (PRA) in the United Kingdom. Our firm 
              reference number is [FCA Reference Number].
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Banking License</h2>
            <p>
              Ulster Delt operates under a full banking license granted by the Prudential 
              Regulation Authority (PRA) and is subject to the supervision of both the PRA and 
              the Financial Conduct Authority (FCA). This license allows us to provide a full 
              range of banking services to our customers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Deposit Protection</h2>
            <p>
              Ulster Delt is a member of the Financial Services Compensation Scheme (FSCS). 
              This means that eligible deposits with Ulster Delt are protected up to £85,000 
              per depositor. For joint accounts, the protection is £170,000.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Regulatory Compliance</h2>
            <p>
              We are committed to maintaining the highest standards of regulatory compliance. 
              Our operations are regularly reviewed by our regulators to ensure we meet all 
              required standards and maintain the necessary capital and liquidity requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. International Operations</h2>
            <p>
              Ulster Delt operates in multiple jurisdictions and complies with all relevant 
              local regulations. Our international operations are subject to the supervision 
              of local regulatory authorities in addition to our UK regulators.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Anti-Money Laundering</h2>
            <p>
              We maintain strict anti-money laundering (AML) and counter-terrorist financing 
              (CTF) controls in accordance with UK and international regulations. Our AML 
              policies and procedures are regularly reviewed and updated to ensure compliance 
              with the latest regulatory requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
            <p>
              For any questions regarding our regulatory status or banking license, please 
              contact our Compliance Department at:
              <br />
              Email: compliance@ulsterdelt.com
              <br />
              Address: Ulster Delt Headquarters, London, United Kingdom
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 