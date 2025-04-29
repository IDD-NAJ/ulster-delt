import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettings from '@/components/settings/ProfileSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/settings');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      securityInfo: true,
      notificationPreferences: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <Card className="p-6">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileSettings user={user} />
            </TabsContent>

            <TabsContent value="security">
              <SecuritySettings securityInfo={user.securityInfo} />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationSettings 
                preferences={user.notificationPreferences} 
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
} 