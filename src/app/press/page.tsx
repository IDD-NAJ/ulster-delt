import { Newspaper, Download, Mail, Calendar } from "lucide-react";

export default function PressPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Newspaper className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Press</h1>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-600 mb-6">
            Welcome to the Ulster Delt Press Center. Here you'll find our latest news, press releases, and media resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Press Releases</h2>
            <div className="space-y-6">
              <div className="border-b pb-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>April 15, 2024</span>
                </div>
                <h3 className="font-semibold text-lg">Ulster Delt Announces New Digital Banking Platform</h3>
                <p className="text-gray-600 mb-2">Revolutionary new features and enhanced security measures</p>
                <a href="#" className="text-primary hover:underline">Read More</a>
              </div>
              <div className="border-b pb-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>March 28, 2024</span>
                </div>
                <h3 className="font-semibold text-lg">Partnership with Leading Fintech Company</h3>
                <p className="text-gray-600 mb-2">Expanding our service offerings through strategic collaboration</p>
                <a href="#" className="text-primary hover:underline">Read More</a>
              </div>
              <div className="border-b pb-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>March 10, 2024</span>
                </div>
                <h3 className="font-semibold text-lg">Record Growth in Customer Base</h3>
                <p className="text-gray-600 mb-2">Achieving 1 million customers milestone</p>
                <a href="#" className="text-primary hover:underline">Read More</a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Media Resources</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Company Logo</h3>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  <a href="#" className="text-primary hover:underline">Download PNG</a>
                  <a href="#" className="text-primary hover:underline">Download SVG</a>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Brand Guidelines</h3>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  <a href="#" className="text-primary hover:underline">Download PDF</a>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Press Kit</h3>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  <a href="#" className="text-primary hover:underline">Download ZIP</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4">Media Contact</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="text-gray-600">press@ulsterdelt.com</p>
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

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">In the News</h2>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg">Financial Times</h3>
              <p className="text-gray-600 mb-2">"Ulster Delt's innovative approach to digital banking"</p>
              <a href="#" className="text-primary hover:underline">Read Article</a>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg">The Guardian</h3>
              <p className="text-gray-600 mb-2">"How Ulster Delt is reshaping the future of finance"</p>
              <a href="#" className="text-primary hover:underline">Read Article</a>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg">TechCrunch</h3>
              <p className="text-gray-600 mb-2">"Ulster Delt's new platform sets industry standards"</p>
              <a href="#" className="text-primary hover:underline">Read Article</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 