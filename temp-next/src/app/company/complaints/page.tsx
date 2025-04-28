'use client';

import { useState } from "react";
import { AlertCircle, ArrowRight } from "lucide-react";

export default function ComplaintsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    accountNumber: '',
    complaintType: '',
    description: '',
    preferredContact: 'email',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <AlertCircle className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">File a Complaint</h1>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Complaint Process</h2>
          <p className="text-gray-600 mb-6">
            We take all complaints seriously and are committed to resolving them fairly and promptly. 
            Here's how our complaint process works:
          </p>
          
          <ol className="space-y-4">
            <li>
              <h3 className="font-semibold">1. Submit Your Complaint</h3>
              <p className="text-gray-600">
                Fill out the form below with details of your complaint. We'll acknowledge receipt within 24 hours.
              </p>
            </li>
            <li>
              <h3 className="font-semibold">2. Investigation</h3>
              <p className="text-gray-600">
                Our dedicated complaints team will investigate your concerns thoroughly.
              </p>
            </li>
            <li>
              <h3 className="font-semibold">3. Resolution</h3>
              <p className="text-gray-600">
                We aim to resolve complaints within 15 business days. If we need more time, we'll keep you informed.
              </p>
            </li>
            <li>
              <h3 className="font-semibold">4. Final Response</h3>
              <p className="text-gray-600">
                You'll receive a final response detailing our findings and any actions taken.
              </p>
            </li>
          </ol>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Complaint Form</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Account Number (if applicable)
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="complaintType" className="block text-sm font-medium text-gray-700 mb-1">
                Type of Complaint
              </label>
              <select
                id="complaintType"
                name="complaintType"
                required
                value={formData.complaintType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a type</option>
                <option value="account">Account Issue</option>
                <option value="service">Service Quality</option>
                <option value="transaction">Transaction Problem</option>
                <option value="security">Security Concern</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description of Complaint
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Contact Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="email"
                    checked={formData.preferredContact === 'email'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Email
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="phone"
                    checked={formData.preferredContact === 'phone'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Phone
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              Submit Complaint
            </button>
          </form>
        </div>

        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Need Immediate Assistance?</h2>
          <p className="text-gray-600 mb-4">
            For urgent matters, please contact our customer service team:
          </p>
          <div className="space-y-2">
            <p><strong>Phone:</strong> +44 [Support Number]</p>
            <p><strong>Email:</strong> complaints@ulsterdelt.com</p>
          </div>
        </div>
      </div>
    </div>
  );
} 