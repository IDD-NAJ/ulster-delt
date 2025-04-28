import { Info } from "lucide-react";

export default function ImprintPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Info className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Imprint</h1>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Company Information</h2>
            <div className="space-y-2">
              <p><strong>Company Name:</strong> Ulster Delt Limited</p>
              <p><strong>Legal Form:</strong> Private Limited Company</p>
              <p><strong>Registration Number:</strong> [Company Registration Number]</p>
              <p><strong>VAT Number:</strong> [VAT Registration Number]</p>
              <p><strong>Registered Office:</strong></p>
              <p className="pl-4">
                Ulster Delt Headquarters<br />
                [Street Address]<br />
                London, [Postcode]<br />
                United Kingdom
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-2">
              <p><strong>Phone:</strong> +44 [Phone Number]</p>
              <p><strong>Email:</strong> info@ulsterdelt.com</p>
              <p><strong>Website:</strong> www.ulsterdelt.com</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Management</h2>
            <div className="space-y-4">
              <div>
                <p><strong>Chief Executive Officer:</strong> [CEO Name]</p>
                <p><strong>Chief Financial Officer:</strong> [CFO Name]</p>
                <p><strong>Chief Operating Officer:</strong> [COO Name]</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Regulatory Information</h2>
            <div className="space-y-2">
              <p>
                Ulster Delt Limited is authorized and regulated by the Financial Conduct 
                Authority (FCA) and the Prudential Regulation Authority (PRA).
              </p>
              <p><strong>FCA Firm Reference Number:</strong> [FCA Reference Number]</p>
              <p><strong>PRA Registration Number:</strong> [PRA Registration Number]</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Supervisory Authority</h2>
            <div className="space-y-2">
              <p>
                Financial Conduct Authority<br />
                12 Endeavour Square<br />
                London E20 1JN<br />
                United Kingdom<br />
                Website: www.fca.org.uk
              </p>
              <p>
                Prudential Regulation Authority<br />
                Bank of England<br />
                Threadneedle Street<br />
                London EC2R 8AH<br />
                United Kingdom<br />
                Website: www.bankofengland.co.uk/pra
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Legal Information</h2>
            <div className="space-y-2">
              <p>
                Ulster Delt Limited is registered in England and Wales. The company's 
                registration details can be found at Companies House.
              </p>
              <p>
                <strong>Companies House Registration Number:</strong> [Companies House Number]
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
            <p>
              The information provided on this website is for general informational purposes 
              only. While we strive to keep the information up to date and correct, we make 
              no representations or warranties of any kind, express or implied, about the 
              completeness, accuracy, reliability, suitability, or availability of the 
              website or the information, products, services, or related graphics contained 
              on the website for any purpose.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 