import { Building2, Users, FileText, Shield, Award, Mail, Phone } from "lucide-react";

export default function CorporateGovernancePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Corporate Governance</h1>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-600 mb-6">
            Ulster Delt is committed to maintaining the highest standards of corporate governance, ensuring transparency, accountability, and ethical business practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Governance Structure</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Board of Directors</h3>
                  <p className="text-gray-600">Overseeing strategic direction and corporate governance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Audit Committee</h3>
                  <p className="text-gray-600">Ensuring financial integrity and compliance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Risk Committee</h3>
                  <p className="text-gray-600">Managing enterprise-wide risks</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Governance Policies</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Code of Conduct</h3>
                  <p className="text-gray-600">Ethical standards and business practices</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Risk Management</h3>
                  <p className="text-gray-600">Framework for identifying and managing risks</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Compliance</h3>
                  <p className="text-gray-600">Regulatory and legal compliance policies</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4">Governance Documents</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Articles of Association</h3>
                <p className="text-gray-600">Company's constitution and rules</p>
                <a href="#" className="text-primary hover:underline">Download PDF</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Board Charter</h3>
                <p className="text-gray-600">Board's roles and responsibilities</p>
                <a href="#" className="text-primary hover:underline">Download PDF</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Committee Terms of Reference</h3>
                <p className="text-gray-600">Committee roles and responsibilities</p>
                <a href="#" className="text-primary hover:underline">Download PDF</a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Contact Governance Team</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              For governance-related inquiries, please contact our corporate governance team.
            </p>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="text-gray-600">governance@ulsterdelt.com</p>
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