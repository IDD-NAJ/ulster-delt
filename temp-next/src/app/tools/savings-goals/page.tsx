'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Pencil, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
};

const mockGoals: SavingsGoal[] = [
  {
    id: '1',
    name: 'New Car',
    targetAmount: 25000,
    currentAmount: 15000,
    deadline: '2024-12-31',
    category: 'Vehicle'
  },
  {
    id: '2',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 8500,
    deadline: '2024-08-01',
    category: 'Emergency'
  }
];

export default function SavingsGoalsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>(mockGoals);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: ''
  });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const goal: SavingsGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: Number(newGoal.currentAmount),
      deadline: newGoal.deadline,
      category: newGoal.category
    };
    setGoals([...goals, goal]);
    setShowAddGoal(false);
    setNewGoal({ name: '', targetAmount: '', currentAmount: '', deadline: '', category: '' });
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getRemainingDays = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Savings Goals</h1>
          <p className="text-xl text-gray-600">Track and achieve your financial goals</p>
        </div>

        <div className="flex justify-end mb-6">
          <Button onClick={() => setShowAddGoal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </div>

        {/* Goals List */}
        <div className="space-y-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{goal.name}</h3>
                  <p className="text-sm text-gray-500">{goal.category}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">Progress</span>
                    <span className="text-sm font-medium">
                      €{goal.currentAmount.toLocaleString()} / €{goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={calculateProgress(goal.currentAmount, goal.targetAmount)} />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {getRemainingDays(goal.deadline)} days remaining
                  </span>
                  <span className="text-gray-500">
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                </div>

                <Button className="w-full">Add Money</Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Add New Goal Form */}
        {showAddGoal && (
          <Card className="p-6 mt-6">
            <h2 className="text-xl font-semibold mb-6">Create New Goal</h2>
            <form onSubmit={handleAddGoal} className="space-y-6">
              <div>
                <Label htmlFor="name">Goal Name</Label>
                <Input
                  id="name"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="targetAmount">Target Amount (€)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="currentAmount">Current Amount (€)</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="deadline">Target Date</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  required
                />
              </div>

              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  Setting realistic goals and deadlines increases your chances of success.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddGoal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Goal
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
} 