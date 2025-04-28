'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building2, Users, Award, Heart, Clock, Target, Shield } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { number: "10M+", label: "Customers" },
    { number: "50+", label: "Countries" },
    { number: "24/7", label: "Support" },
    { number: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">About Ulster Delt</h1>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-600 mb-6">
            Ulster Delt is a modern financial institution committed to providing innovative banking solutions and exceptional service to our customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Founded in 2020</h3>
                  <p className="text-gray-600">Established with a vision to revolutionize digital banking</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Our Mission</h3>
                  <p className="text-gray-600">To make banking more accessible, secure, and customer-focused</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Our Vision</h3>
                  <p className="text-gray-600">To be the most trusted and innovative financial partner</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Customer Focus</h3>
                  <p className="text-gray-600">Putting our customers at the heart of everything we do</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Innovation</h3>
                  <p className="text-gray-600">Continuously improving and embracing new technologies</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Integrity</h3>
                  <p className="text-gray-600">Operating with honesty, transparency, and ethical standards</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4">Key Milestones</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">2020</div>
              <div>
                <h3 className="font-semibold">Company Founded</h3>
                <p className="text-gray-600">Launched with a mission to transform digital banking</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">2021</div>
              <div>
                <h3 className="font-semibold">Digital Platform Launch</h3>
                <p className="text-gray-600">Introduced our innovative banking platform</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">2022</div>
              <div>
                <h3 className="font-semibold">Expansion</h3>
                <p className="text-gray-600">Expanded services to new markets</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">2023</div>
              <div>
                <h3 className="font-semibold">1 Million Customers</h3>
                <p className="text-gray-600">Reached a significant milestone in customer base</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold">John Smith</h3>
              <p className="text-gray-600">CEO & Founder</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold">Sarah Johnson</h3>
              <p className="text-gray-600">Chief Technology Officer</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold">Michael Brown</h3>
              <p className="text-gray-600">Chief Financial Officer</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Join Our Journey</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Be part of the banking revolution. Experience the future of finance with Ulster Delt.
        </p>
        <Button asChild>
          <Link href="/register">Open an Account</Link>
        </Button>
      </div>
    </div>
  );
} 