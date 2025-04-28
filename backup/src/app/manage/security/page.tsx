'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Smartphone,
  Lock,
  Key,
  AlertTriangle,
  Activity,
  Fingerprint,
  LogOut,
  Mail,
  Globe,
  Laptop,
  Trash2
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Device = {
  id: string;
  name: string;
  type: string;
  lastActive: string;
  location: string;
  isCurrent: boolean;
};

type ActivityLog = {
  id: string;
  action: string;
  date: string;
  device: string;
  location: string;
  status: 'success' | 'warning' | 'error';
};

const mockDevices: Device[] = [
  {
    id: '1',
    name: 'iPhone 13 Pro',
    type: 'Mobile',
    lastActive: '2024-04-10T15:30:00',
    location: 'Dublin, Ireland',
    isCurrent: true
  },
  {
    id: '2',
    name: 'MacBook Pro',
    type: 'Desktop',
    lastActive: '2024-04-10T14:45:00',
    location: 'Dublin, Ireland',
    isCurrent: false
  },
  {
    id: '3',
    name: 'iPad Air',
    type: 'Tablet',
    lastActive: '2024-04-09T18:20:00',
    location: 'Cork, Ireland',
    isCurrent: false
  }
];

const mockActivity: ActivityLog[] = [
  {
    id: '1',
    action: 'Login successful',
    date: '2024-04-10T15:30:00',
    device: 'iPhone 13 Pro',
    location: 'Dublin, Ireland',
    status: 'success'
  },
  {
    id: '2',
    action: 'Password changed',
    date: '2024-04-09T14:20:00',
    device: 'MacBook Pro',
    location: 'Dublin, Ireland',
    status: 'success'
  },
  {
    id: '3',
    action: 'Failed login attempt',
    date: '2024-04-08T10:15:00',
    device: 'Unknown Device',
    location: 'London, UK',
    status: 'error'
  }
];

export default function SecurityManagementPage() {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    biometric: false,
    loginNotifications: true,
    deviceVerification: true
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Security Settings</h1>
          <p className="text-xl text-gray-600">Manage your account security and privacy</p>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            {/* Security Settings */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-6">Security Options</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Key className="w-4 h-4 mr-2" />
                      <Label>Two-Factor Authentication</Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactor}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, twoFactor: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Fingerprint className="w-4 h-4 mr-2" />
                      <Label>Biometric Login</Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Use fingerprint or face recognition to log in
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.biometric}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, biometric: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <Label>Login Notifications</Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Get notified of new login attempts
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.loginNotifications}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, loginNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      <Label>Device Verification</Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Verify new devices before allowing access
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.deviceVerification}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, deviceVerification: checked })
                    }
                  />
                </div>
              </div>
            </Card>

            {/* Password Management */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Password Management</h2>
              <div className="space-y-4">
                <Button className="w-full" variant="outline">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button className="w-full" variant="outline">
                  <Key className="w-4 h-4 mr-2" />
                  Reset Security Questions
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="devices">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Connected Devices</h2>
              <div className="space-y-6">
                {mockDevices.map((device) => (
                  <div key={device.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex items-start">
                      {device.type === 'Mobile' ? (
                        <Smartphone className="w-8 h-8 mr-4" />
                      ) : device.type === 'Desktop' ? (
                        <Laptop className="w-8 h-8 mr-4" />
                      ) : (
                        <Globe className="w-8 h-8 mr-4" />
                      )}
                      <div>
                        <h3 className="font-medium">
                          {device.name}
                          {device.isCurrent && (
                            <span className="ml-2 text-sm text-green-600">(Current Device)</span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Last active: {new Date(device.lastActive).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">Location: {device.location}</p>
                      </div>
                    </div>
                    {!device.isCurrent && (
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <Button variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  View Full Log
                </Button>
              </div>

              <div className="space-y-4">
                {mockActivity.map((log) => (
                  <div key={log.id} className="flex items-start justify-between p-4 border-b">
                    <div>
                      <div className="flex items-center">
                        <span className={`mr-2 ${getStatusColor(log.status)}`}>
                          {log.status === 'success' ? '✓' : log.status === 'error' ? '✗' : '⚠'}
                        </span>
                        <h3 className="font-medium">{log.action}</h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(log.date).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {log.device} • {log.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Suspicious Activity Alert */}
            {mockActivity.some(log => log.status === 'error') && (
              <Alert className="mt-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  We detected some suspicious activity. Please review your recent logins and secure your account if needed.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 