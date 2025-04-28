'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  QrCode,
  Camera,
  Clock,
  AlertCircle,
  Copy,
  Download,
  Share2
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type QRPayment = {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  reference: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
};

const mockRecentPayments: QRPayment[] = [
  {
    id: '1',
    type: 'sent',
    amount: 25.00,
    reference: 'Lunch payment',
    date: '2024-04-10T12:30:00',
    status: 'completed'
  },
  {
    id: '2',
    type: 'received',
    amount: 15.50,
    reference: 'Coffee share',
    date: '2024-04-09T15:45:00',
    status: 'completed'
  },
  {
    id: '3',
    type: 'sent',
    amount: 50.00,
    reference: 'Movie tickets',
    date: '2024-04-08T19:20:00',
    status: 'completed'
  }
];

export default function QRPaymentsPage() {
  const [activeTab, setActiveTab] = useState('scan');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);

  const handleScan = () => {
    setShowScanner(true);
    // In a real implementation, this would activate the device camera
    // and handle QR code scanning
    alert('Camera access would be requested here');
  };

  const handleGenerate = () => {
    if (!amount) {
      alert('Please enter an amount');
      return;
    }
    setQrGenerated(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">QR Payments</h1>
          <p className="text-xl text-gray-600">Quick and easy payments using QR codes</p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="scan">Scan QR Code</TabsTrigger>
            <TabsTrigger value="generate">Generate QR Code</TabsTrigger>
          </TabsList>

          <TabsContent value="scan">
            <Card className="p-6">
              <div className="text-center space-y-6">
                {!showScanner ? (
                  <>
                    <div className="p-12 border-2 border-dashed rounded-lg">
                      <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">Position the QR code within the frame to scan</p>
                    </div>
                    <Button onClick={handleScan} className="w-full max-w-sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Open Camera
                    </Button>
                  </>
                ) : (
                  <div className="aspect-square max-w-sm mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Camera feed would appear here</p>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Recent QR Payments</h3>
                <div className="space-y-4">
                  {mockRecentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center">
                          <QrCode className="w-4 h-4 mr-2" />
                          <span className="font-medium">{payment.reference}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(payment.date).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {payment.type === 'sent' ? '-' : '+'}€{payment.amount.toFixed(2)}
                        </p>
                        <span className={`text-sm ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="generate">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    placeholder="€0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Reference (Optional)</Label>
                  <Input
                    placeholder="Add a reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleGenerate}
                  className="w-full"
                  disabled={!amount}
                >
                  Generate QR Code
                </Button>

                {qrGenerated && (
                  <div className="text-center space-y-6">
                    <div className="p-8 border rounded-lg">
                      <div className="aspect-square max-w-sm mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-gray-400" />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This QR code will expire in 15 minutes for security reasons.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 