"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, KeyRound, User, Users } from 'lucide-react';
import Link from 'next/link';
import { Table } from '@/components/ui/table';

interface AdminInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        // Get token from cookies
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('adminToken='))
          ?.split('=')[1];

        if (!token) {
          toast.error('Please log in again');
          router.push('/admin/login');
          return;
        }

        const response = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch admin info');
        }

        const data = await response.json();
        setAdminInfo(data.admin);
      } catch (error) {
        console.error('Dashboard error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to load admin information');
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminInfo();
  }, [router]);

  const handleLogout = () => {
    try {
      document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  // Mock user data for dashboard summary
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'USER' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'USER' },
    // Add more mock users as needed
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {adminInfo && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Admin Profile</h3>
                    <p className="text-gray-600">{adminInfo.name}</p>
                    <p className="text-gray-600">{adminInfo.email}</p>
                    <p className="text-gray-600 text-sm mt-1">Role: {adminInfo.role}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <KeyRound className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Security</h3>
                    <Button
                      variant="link"
                      onClick={() => router.push('/admin/change-password')}
                      className="p-0 h-auto"
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </Card>

              {/* User Management Card */}
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">User Management</h3>
                    <p className="text-gray-600">Total Users: {users.length}</p>
                    <Link href="/admin/users" className="text-green-700 hover:underline mt-2 block">
                      Manage Users
                    </Link>
                  </div>
                </div>
              </Card>
            </div>

            {/* System Statistics Card */}
            <div className="mt-8 max-w-lg w-full">
              <Card className="p-4 sm:p-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">System Statistics</h3>
                  <div className="space-y-1">
                    <div>Total Users: {users.length}</div>
                    <div>Active Users: {users.length}</div>
                    <div>System Health: <span className="text-green-600 font-semibold">Operational</span></div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity Card */}
            <div className="mt-8 max-w-2xl w-full">
              <Card className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <ul className="space-y-2">
                  <li className="text-sm text-gray-700">
                    <span className="font-bold">Admin</span> changed password <span className="text-gray-400">2 hours ago</span>
                  </li>
                  <li className="text-sm text-gray-700">
                    <span className="font-bold">Jane Smith</span> added a new user <span className="text-gray-400">5 hours ago</span>
                  </li>
                  <li className="text-sm text-gray-700">
                    <span className="font-bold">John Doe</span> updated profile <span className="text-gray-400">1 day ago</span>
                  </li>
                </ul>
              </Card>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading transactions...</div>
            ) : (
              <Table>
                {/* ...table code... */}
              </Table>
            )}
          </>
        )}
      </div>
    </div>
  );
} 