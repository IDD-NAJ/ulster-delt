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
import { Sparkles, Clock, Wallet, PiggyBank, ArrowRight, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AutoSaveRule = {
  id: string;
  name: string;
  type: string;
  amount: number;
  frequency: string;
  targetAccount: string;
  active: boolean;
};

const mockRules: AutoSaveRule[] = [
  {
    id: '1',
    name: 'Monthly Savings',
    type: 'fixed',
    amount: 200,
    frequency: 'monthly',
    targetAccount: 'Savings Account',
    active: true
  },
  {
    id: '2',
    name: 'Round-up Savings',
    type: 'roundup',
    amount: 1,
    frequency: 'transaction',
    targetAccount: 'Investment Account',
    active: true
  }
];

export default function AutoSavePage() {
  const [rules, setRules] = useState<AutoSaveRule[]>(mockRules);
  const [showNewRule, setShowNewRule] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    type: 'fixed',
    amount: '',
    frequency: 'monthly',
    targetAccount: ''
  });

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    const rule: AutoSaveRule = {
      id: Date.now().toString(),
      name: newRule.name,
      type: newRule.type,
      amount: Number(newRule.amount),
      frequency: newRule.frequency,
      targetAccount: newRule.targetAccount,
      active: true
    };
    setRules([...rules, rule]);
    setShowNewRule(false);
    setNewRule({
      name: '',
      type: 'fixed',
      amount: '',
      frequency: 'monthly',
      targetAccount: ''
    });
  };

  const toggleRuleStatus = (id: string) => {
    setRules(rules.map(rule =>
      rule.id === id ? { ...rule, active: !rule.active } : rule
    ));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Auto-Save</h1>
          <p className="text-xl text-gray-600">Set up automatic savings rules</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex flex-col items-center">
              <Clock className="h-8 w-8 mb-2 text-blue-500" />
              <h3 className="text-lg font-semibold">Active Rules</h3>
              <p className="text-2xl font-bold">{rules.filter(r => r.active).length}</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-col items-center">
              <PiggyBank className="h-8 w-8 mb-2 text-green-500" />
              <h3 className="text-lg font-semibold">Total Saved</h3>
              <p className="text-2xl font-bold">€1,250.00</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-col items-center">
              <Sparkles className="h-8 w-8 mb-2 text-purple-500" />
              <h3 className="text-lg font-semibold">This Month</h3>
              <p className="text-2xl font-bold">€320.00</p>
            </div>
          </Card>
        </div>

        <div className="flex justify-end mb-6">
          <Button onClick={() => setShowNewRule(true)}>
            <PiggyBank className="w-4 h-4 mr-2" />
            New Rule
          </Button>
        </div>

        {/* Active Rules */}
        <div className="space-y-4 mb-8">
          {rules.map((rule) => (
            <Card key={rule.id} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{rule.name}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Wallet className="w-4 h-4 mr-1" />
                    <span>
                      {rule.type === 'fixed' ? `€${rule.amount}` : `Round up to €${rule.amount}`}
                    </span>
                    <ArrowRight className="w-4 h-4 mx-2" />
                    <span>{rule.targetAccount}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 capitalize">
                    {rule.frequency} savings
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Switch
                    checked={rule.active}
                    onCheckedChange={() => toggleRuleStatus(rule.id)}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => deleteRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* New Rule Form */}
        {showNewRule && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Create New Auto-Save Rule</h2>
            <form onSubmit={handleAddRule} className="space-y-6">
              <div>
                <Label htmlFor="name">Rule Name</Label>
                <Input
                  id="name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Saving Type</Label>
                <Select
                  value={newRule.type}
                  onValueChange={(value) => setNewRule({ ...newRule, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select saving type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="roundup">Round Up</SelectItem>
                    <SelectItem value="percentage">Percentage of Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">
                  {newRule.type === 'fixed' ? 'Amount (€)' :
                    newRule.type === 'roundup' ? 'Round up to nearest (€)' :
                    'Percentage (%)'}
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step={newRule.type === 'percentage' ? '1' : '0.01'}
                  min={newRule.type === 'percentage' ? '1' : '0.01'}
                  max={newRule.type === 'percentage' ? '100' : undefined}
                  value={newRule.amount}
                  onChange={(e) => setNewRule({ ...newRule, amount: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={newRule.frequency}
                  onValueChange={(value) => setNewRule({ ...newRule, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="transaction">Per Transaction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="targetAccount">Target Account</Label>
                <Select
                  value={newRule.targetAccount}
                  onValueChange={(value) => setNewRule({ ...newRule, targetAccount: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Savings Account">Savings Account</SelectItem>
                    <SelectItem value="Investment Account">Investment Account</SelectItem>
                    <SelectItem value="Emergency Fund">Emergency Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  Automatic savings help build consistent saving habits without thinking about it.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowNewRule(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Rule
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
} 