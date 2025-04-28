"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminSecurityPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Security Settings</h1>
        <div className="space-y-6">
          <Card className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full mb-2 sm:mb-0">
              <KeyRound className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-semibold">Change Password</h2>
              <p className="text-gray-600 text-sm">Update your admin account password regularly to keep your account secure.</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/admin/change-password')}>Change</Button>
          </Card>

          <Card className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full mb-2 sm:mb-0">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-semibold">Two-Factor Authentication (2FA)</h2>
              <p className="text-gray-600 text-sm">Add an extra layer of security to your account. (Coming soon)</p>
            </div>
            <Button variant="outline" disabled>Enable</Button>
          </Card>
        </div>
      </div>
    </div>
  );
} 