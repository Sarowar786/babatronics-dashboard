"use client";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function RevenueChart() {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 12,
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 50000,
        ticks: {
          callback: function (value: any) {
            return value / 1000 + "k";
          },
        },
      },
    },
  };
  const data = {
    labels: [
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
    ],
    datasets: [
      {
        data: [
          35000, 28000, 23000, 31000, 27000, 44000, 38000, 25000, 32000, 42000,
        ],
        backgroundColor: [
          "#D1D5DB",
          "#D1D5DB",
          "#D1D5DB",
          "#D1D5DB",
          "#000000", // highlight
          "#D1D5DB",
          "#D1D5DB",
          "#D1D5DB",
          "#D1D5DB",
          "#D1D5DB",
        ],
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-2xl border-0 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-lg text-gray-900">Revenue Breakdown</h3>
        </div>

        <Tabs defaultValue="monthly">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="daily" className="text-xs">
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="text-xs">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="yearly" className="text-xs">
              Yearly
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-75">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
