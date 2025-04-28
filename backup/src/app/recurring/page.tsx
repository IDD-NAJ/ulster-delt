"use client";

import React from 'react';
import Link from 'next/link';

export default function RecurringPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-green-700 hover:underline font-medium">&larr; Back to Dashboard</Link>
      </div>
      <h1 className="text-3xl font-bold mb-4">Recurring Payments</h1>
      <p className="text-gray-600 mb-8">
        Manage your recurring payments here. You can view, add, or cancel subscriptions and scheduled payments.
      </p>
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Your Recurring Payments</h2>
        <p className="text-gray-500">No recurring payments found. This section will list all your active and past recurring payments.</p>
        {/* Future: Add table/list of recurring payments here */}
      </div>
    </div>
  );
} 