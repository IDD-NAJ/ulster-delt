'use client';

import { useState } from 'react';
import { NotificationPreferences } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

interface NotificationSettingsProps {
  preferences: NotificationPreferences | null;
}

const defaultPreferences = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  marketingEmails: true,
  transactionAlerts: true,
  securityAlerts: true,
  balanceAlerts: true,
};

export default function NotificationSettings({ preferences }: NotificationSettingsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    emailNotifications: preferences?.emailNotifications ?? defaultPreferences.emailNotifications,
    smsNotifications: preferences?.smsNotifications ?? defaultPreferences.smsNotifications,
    pushNotifications: preferences?.pushNotifications ?? defaultPreferences.pushNotifications,
    marketingEmails: preferences?.marketingEmails ?? defaultPreferences.marketingEmails,
    transactionAlerts: preferences?.transactionAlerts ?? defaultPreferences.transactionAlerts,
    securityAlerts: preferences?.securityAlerts ?? defaultPreferences.securityAlerts,
    balanceAlerts: preferences?.balanceAlerts ?? defaultPreferences.balanceAlerts,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification settings');
      }

      toast({
        title: 'Preferences Updated',
        description: 'Your notification preferences have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notification preferences. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Channels</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-gray-500">
              Receive notifications via email
            </p>
          </div>
          <Switch
            checked={formData.emailNotifications}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, emailNotifications: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>SMS Notifications</Label>
            <p className="text-sm text-gray-500">
              Receive notifications via text message
            </p>
          </div>
          <Switch
            checked={formData.smsNotifications}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, smsNotifications: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Push Notifications</Label>
            <p className="text-sm text-gray-500">
              Receive notifications on your devices
            </p>
          </div>
          <Switch
            checked={formData.pushNotifications}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, pushNotifications: checked })
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Types</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Transaction Alerts</Label>
            <p className="text-sm text-gray-500">
              Get notified about account transactions
            </p>
          </div>
          <Switch
            checked={formData.transactionAlerts}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, transactionAlerts: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Security Alerts</Label>
            <p className="text-sm text-gray-500">
              Get notified about security-related events
            </p>
          </div>
          <Switch
            checked={formData.securityAlerts}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, securityAlerts: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Balance Alerts</Label>
            <p className="text-sm text-gray-500">
              Get notified about balance changes and thresholds
            </p>
          </div>
          <Switch
            checked={formData.balanceAlerts}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, balanceAlerts: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Marketing Emails</Label>
            <p className="text-sm text-gray-500">
              Receive updates about new features and offers
            </p>
          </div>
          <Switch
            checked={formData.marketingEmails}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, marketingEmails: checked })
            }
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Preferences'}
      </Button>
    </form>
  );
}