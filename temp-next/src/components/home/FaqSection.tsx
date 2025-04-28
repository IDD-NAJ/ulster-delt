"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const faqs = [
  {
    question: "What do I need to open an Ulster Delt bank account?",
    answer:
      "To open an Ulster Delt account, you'll need a smartphone, a valid ID or passport, and an address in one of our supported European countries. You must be at least 18 years old. The account opening process is completely digital and takes just a few minutes.",
  },
  {
    question: "How do I verify my identity when opening an account?",
    answer:
      "During the sign-up process, you'll verify your identity through a quick video call or by taking photos of your ID and a selfie. This process is secure, fully digital, and takes just a few minutes. You'll receive immediate confirmation once your identity is verified.",
  },
  {
    question: "Is Ulster Delt a real bank?",
    answer:
      "Yes, Ulster Delt is a fully licensed bank. We operate under a German banking license and are supervised by the European Central Bank. Your deposits are protected up to €100,000 through the German Deposit Protection Scheme, in accordance with EU regulations.",
  },
  {
    question: "How much does Ulster Delt cost?",
    answer:
      "Ulster Delt offers a range of accounts to suit different needs. Our Ulster Delt Standard account is completely free with no monthly fees. Our premium accounts, Ulster Delt Smart, Ulster Delt You, and Ulster Delt Metal, offer additional features and benefits for a monthly fee ranging from €4.90 to €16.90.",
  },
  {
    question: "Can I use my Ulster Delt card abroad?",
    answer:
      "Yes, you can use your Ulster Delt card anywhere Mastercard is accepted worldwide. With our Standard account, you get free payments in any currency. ATM withdrawals in foreign currencies may incur a 1.7% fee, but are free with our premium accounts. We also offer great exchange rates for international transactions.",
  },
  {
    question: "How do I contact Ulster Delt customer support?",
    answer:
      "All Ulster Delt customers can contact our support team through the in-app chat function. Premium customers (Ulster Delt Smart, You, and Metal) also have access to phone support. Our customer service team is available in multiple languages including English, German, French, Italian, and Spanish.",
  },
];

export function FaqSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="n26-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to the most common questions about Ulster Delt and our banking services.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="text-left font-medium text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="mb-4 text-gray-600">
              Still have questions? We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <Link href="/support">Visit Help Center</Link>
              </Button>
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
