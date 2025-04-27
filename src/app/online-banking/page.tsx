'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function OnlineBankingPage() {
  const router = useRouter();
  const { translations } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Here you would typically make an API call to authenticate
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 max-w-md px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{translations.onlineBanking}</h1>
        <p className="text-xl text-gray-600">{translations.signIn}</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="username">{translations.username}</Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder={translations.username}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">{translations.password}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={translations.password}
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="link"
              onClick={() => router.push('/forgot-password')}
            >
              {translations.forgotPassword}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => router.push('/register')}
            >
              {translations.register}
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? translations.signIn + '...' : translations.signIn}
          </Button>
        </form>
      </Card>

      <Card className="mt-8 p-6">
        <h2 className="text-xl font-semibold mb-4">Important Information</h2>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• Keep your login details secure and never share them with anyone.</p>
          <p>• We will never ask for your full password over the phone or email.</p>
          <p>• If you suspect any unauthorized access, please contact us immediately.</p>
          <p>• For security reasons, your session will timeout after 10 minutes of inactivity.</p>
        </div>
      </Card>
    </div>
  );
} 