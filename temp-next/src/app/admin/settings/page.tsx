"use client";

import { Card } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        <Card className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="p-3 bg-gray-100 rounded-full mb-2 sm:mb-0">
            <Settings className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">General Settings</h2>
            <p className="text-gray-600 text-sm">Manage your admin panel preferences and configurations here. (Coming soon)</p>
          </div>
        </Card>
        {/* General Settings Form */}
        <Card className="p-4 sm:p-6 w-full">
          <h3 className="text-lg font-semibold mb-4">General Settings</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Site Name</label>
              <input className="mt-1 block w-full border rounded p-2" placeholder="My Admin Panel" />
            </div>
            <div className="flex items-center">
              <label className="block text-sm font-medium text-gray-700 mr-2">Enable Notifications</label>
              <input type="checkbox" className="ml-2" />
            </div>
            <button type="submit" className="btn btn-primary mt-2">Save Settings</button>
          </form>
        </Card>
      </div>
    </div>
  );
} 