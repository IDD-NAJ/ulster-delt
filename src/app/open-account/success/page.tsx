'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-12 max-w-md px-4">
      <Card className="p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">
          Application Submitted Successfully!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Thank you for choosing Ulster Delt. We have received your application and will process it within 2-3 business days.
          You will receive an email with further instructions.
        </p>

        <div className="space-y-4">
          <Button
            variant="default"
            className="w-full"
            onClick={() => router.push('/')}
          >
            Return to Home
          </Button>
        </div>
      </Card>
    </div>
  );
} 