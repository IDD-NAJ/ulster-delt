"use client";

import { Card } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyComparisonProps {
  data: {
    month: string;
    currentYear: number;
    previousYear: number;
  }[];
}

export default function MonthlyComparison({ data }: MonthlyComparisonProps) {
  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "This Year",
        data: data.map((item) => item.currentYear),
        backgroundColor: "hsl(142, 76%, 22%)", // Dark green
        borderRadius: 4,
      },
      {
        label: "Last Year",
        data: data.map((item) => item.previousYear),
        backgroundColor: "hsl(142, 76%, 22%, 0.3)", // Light green
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: (value: number) => `£${value}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    barPercentage: 0.7,
    categoryPercentage: 0.8,
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Comparison</h3>
      <div className="h-[300px]">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
} 