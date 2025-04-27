'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const contactMethods = [
    {
      title: "Call Us",
      description: "Speak directly with our team",
      value: "0800 123 4567",
      availability: "24/7",
      icon: "📞",
    },
    {
      title: "Visit Us",
      description: "Find your nearest branch",
      value: "Branch Locator",
      availability: "Mon-Fri: 9am-5pm",
      icon: "🏢",
    },
    {
      title: "Live Chat",
      description: "Chat with our support team",
      value: "Start Chat",
      availability: "24/7",
      icon: "💬",
    },
    {
      title: "Email Us",
      description: "Send us an email",
      value: "support@ulsterdelt.com",
      availability: "Response within 24h",
      icon: "✉️",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                <p className="text-gray-600">
                  For general inquiries and support
                  <br />
                  <a href="mailto:support@ulsterdelt.com" className="text-primary hover:underline">
                    support@ulsterdelt.com
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
                <p className="text-gray-600">
                  Available 24/7 for urgent matters
                  <br />
                  <a href="tel:+44[PhoneNumber]" className="text-primary hover:underline">
                    +44 [Phone Number]
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Headquarters</h3>
                <p className="text-gray-600">
                  Ulster Delt Headquarters
                  <br />
                  [Street Address]
                  <br />
                  London, [Postcode]
                  <br />
                  United Kingdom
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Support Hours</h3>
                <p className="text-gray-600">
                  Monday - Friday: 8:00 AM - 8:00 PM GMT
                  <br />
                  Saturday: 9:00 AM - 5:00 PM GMT
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Enter the subject"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Enter your message"
                  className="min-h-[150px]"
                />
              </div>

              <Button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
                Send Message
              </Button>
            </form>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Emergency Contact</h2>
          <p className="text-gray-600 mb-4">
            For urgent matters outside of business hours, please contact our 24/7 emergency support:
          </p>
          <div className="space-y-2">
            <p><strong>Emergency Phone:</strong> +44 [Emergency Number]</p>
            <p><strong>Emergency Email:</strong> emergency@ulsterdelt.com</p>
          </div>
        </div>
      </div>
    </div>
  );
} 