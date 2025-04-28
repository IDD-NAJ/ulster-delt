'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Mail, Phone, MessageCircle } from 'lucide-react';
import { Hero } from '@/components/ui/hero';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I open a new account?",
    answer: "To open a new account, click on the 'Open Bank Account' button in the navigation menu. Follow the step-by-step process, providing the required information and documentation. Our team will review your application and contact you within 1-2 business days."
  },
  {
    question: "What are the different types of accounts available?",
    answer: "We offer several account types including Current Accounts, Savings Accounts, Student Accounts, and Business Accounts. Each account type comes with different features and benefits tailored to specific needs."
  },
  {
    question: "How can I reset my password?",
    answer: "If you've forgotten your password, click on the 'Forgot Password' link on the login page. Enter your registered email address, and we'll send you instructions to reset your password securely."
  },
  {
    question: "How do I set up online banking?",
    answer: "Once you have an account with us, you can set up online banking by clicking the 'Register for Online Banking' button and following the verification process. You'll need your account number and personal identification documents."
  },
  {
    question: "What should I do if I notice suspicious activity on my account?",
    answer: "If you notice any suspicious activity, immediately contact our 24/7 fraud prevention team at our emergency number. You can also freeze your cards instantly through the online banking portal or mobile app."
  }
];

const supportChannels = [
  {
    title: "Email Support",
    description: "Get help via email within 24 hours",
    icon: Mail,
    contact: "support@ulsterbank.com",
    action: "Send Email"
  },
  {
    title: "Phone Support",
    description: "Talk to our team directly",
    icon: Phone,
    contact: "1-800-ULSTER",
    action: "Call Now"
  },
  {
    title: "Live Chat",
    description: "Chat with our support team",
    icon: MessageCircle,
    contact: "Available 24/7",
    action: "Start Chat"
  }
];

export default function HelpPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero
        title="Help & Support"
        subtitle="Find answers to common questions and get the support you need"
        imagePath="/hero-help.jpg"
      />

      <div className="container mx-auto py-12 px-4">
        {/* Support Channels */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => (
              <Card key={index} className="p-6">
                <div className="flex flex-col items-center text-center">
                  <channel.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{channel.title}</h3>
                  <p className="text-gray-600 mb-4">{channel.description}</p>
                  <p className="text-primary font-medium mb-6">{channel.contact}</p>
                  <Button
                    className="w-full"
                    onClick={() => {
                      if (channel.title === 'Email Support') {
                        window.location.href = `mailto:${channel.contact}`;
                      } else if (channel.title === 'Phone Support') {
                        window.location.href = `tel:${channel.contact.replace(/[^\d+]/g, '')}`;
                      } else if (channel.title === 'Live Chat') {
                        // Replace with your live chat URL or widget trigger
                        window.location.href = '/live-chat';
                      }
                    }}
                  >
                    {channel.action}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="text-2xl font-semibold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  className="w-full text-left p-6 flex justify-between items-center"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="font-medium">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-6 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 