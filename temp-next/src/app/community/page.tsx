import { Users, MessageSquare, BookOpen, Trophy } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Community</h1>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Welcome to Our Community</h2>
            <p className="text-gray-600 mb-6">
              Join our growing community of Ulster Delt customers. Share experiences, get help, 
              and connect with others who use our services.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Discussion Forums</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Join conversations about banking, personal finance, and more. Share your 
                experiences and learn from others.
              </p>
              <div className="space-y-2">
                <a href="#" className="block text-primary hover:underline">Personal Finance Tips</a>
                <a href="#" className="block text-primary hover:underline">Digital Banking</a>
                <a href="#" className="block text-primary hover:underline">Investment Strategies</a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Knowledge Base</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Access our community-created guides and tutorials. Learn from the experiences 
                of other customers.
              </p>
              <div className="space-y-2">
                <a href="#" className="block text-primary hover:underline">Getting Started Guide</a>
                <a href="#" className="block text-primary hover:underline">Security Best Practices</a>
                <a href="#" className="block text-primary hover:underline">Mobile Banking Tips</a>
              </div>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Community Events</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Financial Literacy Workshop</h3>
                    <p className="text-gray-600 mb-2">
                      Join our monthly workshop to learn about personal finance management, 
                      investment strategies, and more.
                    </p>
                    <p className="text-sm text-gray-500">Next session: May 15, 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Community Guidelines</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                To ensure a positive experience for all members, please follow these guidelines:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be respectful and considerate of others</li>
                <li>Share accurate and helpful information</li>
                <li>Keep discussions relevant to banking and finance</li>
                <li>Protect your personal information</li>
                <li>Report any inappropriate content</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Get Involved</h2>
            <div className="bg-primary/5 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                Want to contribute to our community? Here's how you can get involved:
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Share Your Knowledge</h3>
                  <p className="text-gray-600">
                    Write guides, answer questions, and share your experiences to help others.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Join Discussions</h3>
                  <p className="text-gray-600">
                    Participate in forum discussions and share your insights on various topics.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Provide Feedback</h3>
                  <p className="text-gray-600">
                    Help us improve our services by sharing your suggestions and feedback.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 