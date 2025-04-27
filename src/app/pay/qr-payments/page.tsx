'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Camera, Share2 } from "lucide-react";

export default function QRPaymentsPage() {
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const handleGenerateQR = () => {
    // Here you would typically generate a QR code
    alert('QR code generated!');
  };

  const handleScanQR = () => {
    // Here you would typically implement QR code scanning
    setShowScanner(true);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">QR Payments</h1>
          <p className="text-xl text-gray-600">Pay and get paid using QR codes</p>
        </div>

        <Tabs defaultValue="scan" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="scan">
              <Camera className="w-4 h-4 mr-2" />
              Scan QR Code
            </TabsTrigger>
            <TabsTrigger value="generate">
              <QrCode className="w-4 h-4 mr-2" />
              Generate QR Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan">
            <Card className="p-6">
              {!showScanner ? (
                <div className="text-center">
                  <div className="mb-6">
                    <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      Point your camera at a QR code to make a payment
                    </p>
                  </div>
                  <Button onClick={handleScanQR} className="w-full">
                    Open Camera
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="aspect-square bg-gray-100 mb-4 rounded-lg flex items-center justify-center">
                    {/* Camera feed would go here */}
                    <p className="text-gray-500">Camera feed placeholder</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowScanner(false)}
                    className="w-full"
                  >
                    Cancel Scan
                  </Button>
                </div>
              )}
            </Card>

            <Card className="mt-6 p-6">
              <h2 className="text-lg font-semibold mb-4">Recent QR Payments</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">Coffee Shop</p>
                    <p className="text-sm text-gray-500">Today, 10:30 AM</p>
                  </div>
                  <p className="font-medium">€4.50</p>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">Grocery Store</p>
                    <p className="text-sm text-gray-500">Yesterday, 3:15 PM</p>
                  </div>
                  <p className="font-medium">€32.80</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="generate">
            <Card className="p-6">
              <form className="space-y-6">
                <div>
                  <Label htmlFor="amount">Amount (€)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="reference">Reference (Optional)</Label>
                  <Input
                    id="reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g., Lunch payment"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleGenerateQR}
                    className="w-full"
                    disabled={!amount}
                  >
                    Generate QR Code
                  </Button>
                </div>
              </form>

              {/* QR Code Display Area */}
              <div className="mt-6 text-center">
                <div className="aspect-square bg-gray-100 max-w-[200px] mx-auto mb-4 rounded-lg flex items-center justify-center">
                  {/* QR code would be displayed here */}
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share QR Code
                </Button>
              </div>
            </Card>

            <Card className="mt-6 p-6">
              <h2 className="text-lg font-semibold mb-4">How It Works</h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>1. Enter the amount you want to receive</li>
                <li>2. Add an optional reference for the payment</li>
                <li>3. Generate a unique QR code</li>
                <li>4. Share the QR code with the payer</li>
                <li>5. The payer scans the code to complete the payment</li>
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 