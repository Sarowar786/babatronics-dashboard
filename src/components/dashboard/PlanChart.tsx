"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Card } from "@/components/ui/card";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PlanChart() {
  const data = {
    labels: ["Basic ($29)", "Pro ($59)"],
    datasets: [
      {
        data: [24, 18],
        backgroundColor: ["#94A3B8", "#10B981"],
        borderColor: ["#F5F5F5", "#F5F5F5"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          font: {
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
    },
  };

  return (
    <Card className="p-6 rounded-2xl border-0 shadow-sm">
      <div>
        <h3 className="font-bold text-lg mb-1 text-gray-900">
          Plan Distribution
        </h3>
        <p className="text-xs text-gray-500 mb-6">
          Active subscription breakdown
        </p>
      </div>
      <div className="h-48 flex items-center justify-between">
        <div className="flex-1">
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </Card>
  );
}
