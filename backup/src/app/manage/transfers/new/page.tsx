'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function NewTransferPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);

  const [formData, setFormData] = useState({
    fromAccount: '',
    amount: '',
    recipientName: '',
    recipientAccountNumber: '',
    recipientSortCode: '',
    transferType: '',
    reference: '',
    description: '',
    saveAsBeneficiary: false,
    isScheduled: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    if (!formData.fromAccount) {
      setError('Please select a source account');
      return false;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    if (!formData.recipientName) {
      setError('Please enter recipient name');
      return false;
    }
    if (!formData.recipientAccountNumber || formData.recipientAccountNumber.length !== 8) {
      setError('Please enter a valid 8-digit account number');
      return false;
    }
    if (!formData.recipientSortCode || !/^\d{2}-\d{2}-\d{2}$/.test(formData.recipientSortCode)) {
      setError('Please enter a valid sort code (XX-XX-XX)');
      return false;
    }
    if (!formData.transferType) {
      setError('Please select a transfer type');
      return false;
    }
    if (formData.isScheduled && !scheduledDate) {
      setError('Please select a date for scheduled transfer');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically make an API call to process the transfer
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to transfers list on success
      router.push('/manage/transfers');
    } catch (err) {
      setError('Failed to process transfer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="fromAccount">From Account</Label>
        <Select
          value={formData.fromAccount}
          onValueChange={(value) => handleSelectChange('fromAccount', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current-account">Current Account (****1234)</SelectItem>
            <SelectItem value="savings-account">Savings Account (****5678)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="amount">Amount (£)</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.amount}
          onChange={handleInputChange}
          placeholder="0.00"
          required
        />
      </div>

      <div>
        <Label htmlFor="transferType">Transfer Type</Label>
        <Select
          value={formData.transferType}
          onValueChange={(value) => handleSelectChange('transferType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select transfer type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="faster-payment">Faster Payment</SelectItem>
            <SelectItem value="bacs">BACS</SelectItem>
            <SelectItem value="chaps">CHAPS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="recipientName">Recipient Name</Label>
        <Input
          id="recipientName"
          name="recipientName"
          value={formData.recipientName}
          onChange={handleInputChange}
          placeholder="Enter recipient's full name"
          required
        />
      </div>

      <div>
        <Label htmlFor="recipientAccountNumber">Account Number</Label>
        <Input
          id="recipientAccountNumber"
          name="recipientAccountNumber"
          value={formData.recipientAccountNumber}
          onChange={handleInputChange}
          placeholder="8 digits"
          pattern="\d{8}"
          maxLength={8}
          required
        />
      </div>

      <div>
        <Label htmlFor="recipientSortCode">Sort Code</Label>
        <Input
          id="recipientSortCode"
          name="recipientSortCode"
          value={formData.recipientSortCode}
          onChange={handleInputChange}
          placeholder="XX-XX-XX"
          pattern="\d{2}-\d{2}-\d{2}"
          maxLength={8}
          required
        />
      </div>

      <div>
        <Label htmlFor="reference">Payment Reference</Label>
        <Input
          id="reference"
          name="reference"
          value={formData.reference}
          onChange={handleInputChange}
          placeholder="Optional reference for the recipient"
          maxLength={18}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Optional description for your records"
          maxLength={140}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isScheduled"
          checked={formData.isScheduled}
          onCheckedChange={(checked) => handleCheckboxChange('isScheduled', checked as boolean)}
        />
        <Label htmlFor="isScheduled">Schedule this transfer</Label>
      </div>

      {formData.isScheduled && (
        <div>
          <Label>Schedule Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={scheduledDate}
                onSelect={setScheduledDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="saveAsBeneficiary"
          checked={formData.saveAsBeneficiary}
          onCheckedChange={(checked) => handleCheckboxChange('saveAsBeneficiary', checked as boolean)}
        />
        <Label htmlFor="saveAsBeneficiary">Save as Beneficiary</Label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Continue'}
        </Button>
      </div>
    </form>
  );

  const renderConfirmation = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Review Transfer</h2>
      
      <div className="space-y-4">
        <div>
          <Label>From Account</Label>
          <p className="text-lg">{formData.fromAccount === 'current-account' ? 'Current Account (****1234)' : 'Savings Account (****5678)'}</p>
        </div>

        <div>
          <Label>Amount</Label>
          <p className="text-2xl font-bold text-primary">£{parseFloat(formData.amount).toFixed(2)}</p>
        </div>

        <div>
          <Label>Transfer Type</Label>
          <p className="text-lg capitalize">{formData.transferType.replace('-', ' ')}</p>
        </div>

        <div>
          <Label>Recipient</Label>
          <p className="text-lg">{formData.recipientName}</p>
          <p className="text-sm text-gray-600">
            {formData.recipientAccountNumber} / {formData.recipientSortCode}
          </p>
        </div>

        {formData.reference && (
          <div>
            <Label>Reference</Label>
            <p className="text-lg">{formData.reference}</p>
          </div>
        )}

        {formData.description && (
          <div>
            <Label>Description</Label>
            <p className="text-lg">{formData.description}</p>
          </div>
        )}

        {formData.isScheduled && scheduledDate && (
          <div>
            <Label>Scheduled Date</Label>
            <p className="text-lg">{format(scheduledDate, "PPP")}</p>
          </div>
        )}

        {formData.saveAsBeneficiary && (
          <div>
            <Label>Save as Beneficiary</Label>
            <p className="text-lg">Yes</p>
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowConfirmation(false)}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Transfer'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-12 max-w-2xl px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">New Transfer</h1>
        <p className="text-xl text-gray-600">Send money to another account</p>
      </div>

      <Card className="p-6">
        {showConfirmation ? renderConfirmation() : renderForm()}
      </Card>

      <Card className="mt-8 p-6">
        <h2 className="text-xl font-semibold mb-4">Important Information</h2>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• Faster Payments are typically processed within 2 hours.</p>
          <p>• BACS transfers usually take 2-3 working days.</p>
          <p>• CHAPS transfers are processed same-day if submitted before 3pm.</p>
          <p>• Please ensure all recipient details are correct before confirming.</p>
          <p>• You can cancel a transfer before it's processed.</p>
          <p>• Scheduled transfers can be set up to 90 days in advance.</p>
          <p>• Beneficiaries are saved for future transfers.</p>
        </div>
      </Card>
    </div>
  );
} 