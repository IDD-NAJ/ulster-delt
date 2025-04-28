'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hero } from '@/components/ui/hero';
import { toast } from "@/components/ui/use-toast";
import { 
  User, 
  Bell, 
  Shield, 
  Key, 
  CreditCard, 
  FileText, 
  Mail,
  Upload,
  Loader2
} from 'lucide-react';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    dob: '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    biometric: false,
    loginAlerts: true,
  });

  const [documents, setDocuments] = useState({
    idVerification: null,
    proofOfAddress: null,
    additionalDocs: [],
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      await update(); // Update session data
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = async (key: string) => {
    setIsLoading(true);
    try {
      const newSettings = {
        ...notifications,
        [key]: !notifications[key as keyof typeof notifications],
      };
      
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) throw new Error('Failed to update notifications');
      
      setNotifications(newSettings);
      toast({
        title: "Success",
        description: "Notification preferences updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecurityChange = async (key: string) => {
    setIsLoading(true);
    try {
      const newSettings = {
        ...security,
        [key]: !security[key as keyof typeof security],
      };
      
      const response = await fetch('/api/user/security', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) throw new Error('Failed to update security settings');
      
      setSecurity(newSettings);
      toast({
        title: "Success",
        description: "Security settings updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update security settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async (type: string, file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/user/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload document');

      const data = await response.json();
      setDocuments(prev => ({
        ...prev,
        [type]: data.url,
      }));

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero
        title="Profile Settings"
        subtitle="Manage your account preferences and security settings"
        imagePath="/hero-profile.jpg"
      />

      <div className="container mx-auto py-12 px-4">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-4 bg-transparent">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-primary">
              <FileText className="mr-2 h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="p-6">
              <form onSubmit={handleProfileSubmit}>
                <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <Input 
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input 
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        type="email"
                        required 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input 
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        type="tel"
                        placeholder="+44" 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Date of Birth</label>
                      <Input 
                        value={profileData.dob}
                        onChange={(e) => setProfileData(prev => ({ ...prev, dob: e.target.value }))}
                        type="date" 
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive updates via email</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={() => handleNotificationChange('email')}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-gray-500">Get instant notifications</p>
                  </div>
                  <Switch 
                    checked={notifications.push}
                    onCheckedChange={() => handleNotificationChange('push')}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-gray-500">Receive text messages</p>
                  </div>
                  <Switch 
                    checked={notifications.sms}
                    onCheckedChange={() => handleNotificationChange('sms')}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Marketing Communications</h3>
                    <p className="text-sm text-gray-500">Receive promotional content</p>
                  </div>
                  <Switch 
                    checked={notifications.marketing}
                    onCheckedChange={() => handleNotificationChange('marketing')}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <Switch 
                    checked={security.twoFactor}
                    onCheckedChange={() => handleSecurityChange('twoFactor')}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Biometric Login</h3>
                    <p className="text-sm text-gray-500">Use fingerprint or face ID</p>
                  </div>
                  <Switch 
                    checked={security.biometric}
                    onCheckedChange={() => handleSecurityChange('biometric')}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Login Alerts</h3>
                    <p className="text-sm text-gray-500">Get notified of new logins</p>
                  </div>
                  <Switch 
                    checked={security.loginAlerts}
                    onCheckedChange={() => handleSecurityChange('loginAlerts')}
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {/* TODO: Implement password change flow */}}
                  disabled={isLoading}
                >
                  Change Password
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Documents</h2>
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">ID Verification</h3>
                  <p className="text-sm text-gray-500 mb-4">Upload a valid government-issued ID</p>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleDocumentUpload('idVerification', file);
                      }}
                      disabled={isLoading}
                    />
                    {documents.idVerification && (
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    )}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Proof of Address</h3>
                  <p className="text-sm text-gray-500 mb-4">Upload a recent utility bill or bank statement</p>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleDocumentUpload('proofOfAddress', file);
                      }}
                      disabled={isLoading}
                    />
                    {documents.proofOfAddress && (
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    )}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Additional Documents</h3>
                  <p className="text-sm text-gray-500 mb-4">Upload any additional required documents</p>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach(file => handleDocumentUpload('additionalDocs', file));
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  {documents.additionalDocs.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {documents.additionalDocs.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">Document {index + 1}</span>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 