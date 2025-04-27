"use client";

import { Card } from "@/components/ui/card";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryBreakdownProps {
  data: {
    category: string;
    amount: number;
    color: string;
  }[];
}

export default function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.amount),
        backgroundColor: data.map((item) => item.color),
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `£${value.toLocaleString()}`;
          },
        },
      },
    },
    cutout: "70%",
  };

  const totalSpending = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
      <div className="h-[300px] relative">
        <Doughnut data={chartData} options={options} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-sm text-gray-500">Total Spending</div>
          <div className="text-xl font-bold">£{totalSpending.toLocaleString()}</div>
        </div>
      </div>
    </Card>
  );
} 