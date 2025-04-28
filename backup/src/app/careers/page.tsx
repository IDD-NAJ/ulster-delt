'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Briefcase, Users, Award, Heart, ArrowRight } from "lucide-react";
import { CheckCircle2 } from "lucide-react";

export default function CareersPage() {
  const jobOpenings = [
    {
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "London, UK",
      type: "Full-time",
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Dublin, Ireland",
      type: "Full-time",
    },
    {
      title: "UX Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
    },
    {
      title: "Financial Analyst",
      department: "Finance",
      location: "Belfast, UK",
      type: "Full-time",
    },
  ];

  const benefits = [
    "Competitive salary and bonus structure",
    "Comprehensive health insurance",
    "Flexible working arrangements",
    "Professional development programs",
    "Generous vacation policy",
    "Retirement savings plan",
    "Wellness programs",
    "Employee assistance program"
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Briefcase className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Careers at Ulster Delt</h1>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-600 mb-6">
            Join our team and be part of a company that's transforming the future of banking. We're looking for talented individuals who share our vision and values.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Current Opportunities</h2>
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg">Senior Software Engineer</h3>
                <p className="text-gray-600 mb-2">London, UK</p>
                <a href="#" className="text-primary hover:underline flex items-center gap-2">
                  View Details <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg">Product Manager</h3>
                <p className="text-gray-600 mb-2">Remote</p>
                <a href="#" className="text-primary hover:underline flex items-center gap-2">
                  View Details <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg">Customer Support Specialist</h3>
                <p className="text-gray-600 mb-2">Belfast, UK</p>
                <a href="#" className="text-primary hover:underline flex items-center gap-2">
                  View Details <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Why Join Us</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Inclusive Culture</h3>
                  <p className="text-gray-600">We value diversity and create an environment where everyone can thrive</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Growth Opportunities</h3>
                  <p className="text-gray-600">Continuous learning and career development programs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Work-Life Balance</h3>
                  <p className="text-gray-600">Flexible working arrangements and wellness initiatives</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4">Employee Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                <span className="text-gray-600">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Application Process</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">1</span>
              <div>
                <h3 className="font-semibold">Submit Application</h3>
                <p className="text-gray-600">Complete our online application form</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">2</span>
              <div>
                <h3 className="font-semibold">Initial Screening</h3>
                <p className="text-gray-600">Phone interview with our recruitment team</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">3</span>
              <div>
                <h3 className="font-semibold">Interviews</h3>
                <p className="text-gray-600">Meet with the team and showcase your skills</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">4</span>
              <div>
                <h3 className="font-semibold">Offer</h3>
                <p className="text-gray-600">Welcome to the Ulster Delt team!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 