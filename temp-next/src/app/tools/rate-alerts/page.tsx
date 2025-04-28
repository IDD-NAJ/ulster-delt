'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, Trash2, BellRing, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type RateAlert = {
  id: string;
  type: string;
  threshold: number;
  condition: 'above' | 'below';
  notificationMethod: string;
  active: boolean;
};

const mockAlerts: RateAlert[] = [
  {
    id: '1',
    type: 'savings',
    threshold: 3.5,
    condition: 'above',
    notificationMethod: 'email',
    active: true
  },
  {
    id: '2',
    type: 'mortgage',
    threshold: 4.0,
    condition: 'below',
    notificationMethod: 'push',
    active: true
  }
];

export default function RateAlertsPage() {
  const [alerts, setAlerts] = useState<RateAlert[]>(mockAlerts);
  const [showNewAlert, setShowNewAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    type: 'savings',
    threshold: '',
    condition: 'above',
    notificationMethod: 'email'
  });

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const alert: RateAlert = {
      id: Date.now().toString(),
      type: newAlert.type,
      threshold: Number(newAlert.threshold),
      condition: newAlert.condition as 'above' | 'below',
      notificationMethod: newAlert.notificationMethod,
      active: true
    };
    setAlerts([...alerts, alert]);
    setShowNewAlert(false);
    setNewAlert({
      type: 'savings',
      threshold: '',
      condition: 'above',
      notificationMethod: 'email'
    });
  };

  const toggleAlertStatus = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, active: !alert.active } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Rate Alerts</h1>
          <p className="text-xl text-gray-600">Stay informed about interest rate changes</p>
        </div>

        <div className="flex justify-end mb-6">
          <Button onClick={() => setShowNewAlert(true)}>
            <Bell className="w-4 h-4 mr-2" />
            New Alert
          </Button>
        </div>

        {/* Active Alerts */}
        <div className="space-y-4 mb-8">
          {alerts.map((alert) => (
            <Card key={alert.id} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold capitalize">{alert.type} Rate Alert</h3>
                  <p className="text-gray-600">
                    Alert when rate goes {alert.condition} {alert.threshold}%
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    {alert.notificationMethod === 'email' ? (
                      <Mail className="w-4 h-4 mr-1" />
                    ) : (
                      <BellRing className="w-4 h-4 mr-1" />
                    )}
                    <span className="capitalize">{alert.notificationMethod} notifications</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Switch
                    checked={alert.active}
                    onCheckedChange={() => toggleAlertStatus(alert.id)}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => deleteAlert(alert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* New Alert Form */}
        {showNewAlert && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Create New Alert</h2>
            <form onSubmit={handleAddAlert} className="space-y-6">
              <div>
                <Label htmlFor="type">Rate Type</Label>
                <Select
                  value={newAlert.type}
                  onValueChange={(value) => setNewAlert({ ...newAlert, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rate type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings Rate</SelectItem>
                    <SelectItem value="mortgage">Mortgage Rate</SelectItem>
                    <SelectItem value="loan">Loan Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="threshold">Rate Threshold (%)</Label>
                <Input
                  id="threshold"
                  type="number"
                  step="0.1"
                  value={newAlert.threshold}
                  onChange={(e) => setNewAlert({ ...newAlert, threshold: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="condition">Alert Condition</Label>
                <Select
                  value={newAlert.condition}
                  onValueChange={(value) => setNewAlert({ ...newAlert, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Goes Above</SelectItem>
                    <SelectItem value="below">Goes Below</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notificationMethod">Notification Method</Label>
                <Select
                  value={newAlert.notificationMethod}
                  onValueChange={(value) => setNewAlert({ ...newAlert, notificationMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select notification method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <BellRing className="h-4 w-4" />
                <AlertDescription>
                  You will receive notifications when your selected rate crosses the threshold.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowNewAlert(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Alert
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
} 