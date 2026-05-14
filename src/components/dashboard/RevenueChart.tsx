// src/components/dashboard/RevenueChart.tsx
'use client'

import { useState } from 'react'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  TooltipItem,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGetRevenueDataQuery } from '@/redux/api/dashboardApi'
import { Loader2 } from 'lucide-react'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)

// Types
interface RevenueItem {
  label?: string
  month?: string
  revenue?: number
  amount?: number
}

interface RevenueDataResponse {
  data: RevenueItem[]
}

export default function RevenueChart(): React.ReactElement {
  const [period, setPeriod] = useState<string>('monthly')
  const { data: revenueData, isLoading } = useGetRevenueDataQuery(period)

  const handlePeriodChange = (value: string): void => {
    setPeriod(value)
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border-0 shadow-sm">
        <div className="flex justify-center items-center h-75">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  const revenue: RevenueItem[] =
    (revenueData as RevenueDataResponse)?.data || []

  // If no data, show placeholder
  if (revenue.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border-0 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              Revenue Breakdown
            </h3>
          </div>
          <Tabs defaultValue="monthly" onValueChange={handlePeriodChange}>
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
        <div className="h-75 flex items-center justify-center text-gray-500">
          No revenue data available
        </div>
      </div>
    )
  }

  const labels: string[] = revenue.map(
    (item: RevenueItem) => item.label || item.month || '',
  )
  const values: number[] = revenue.map(
    (item: RevenueItem) => item.revenue || item.amount || 0,
  )

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        callbacks: {
          label: function (context: TooltipItem<'bar'>): string {
            return `$${(context.raw as number).toLocaleString()}`
          },
        },
      },
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (tickValue: string | number): string {
            // Convert string to number if needed
            const value =
              typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue
            return '$' + (value / 1000).toFixed(0) + 'k'
          },
        },
      },
    },
  }

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: values.map((_: number, index: number) =>
          index === values.length - 1 ? '#000000' : '#D1D5DB',
        ),
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  }

  return (
    <div className="bg-white p-6 rounded-2xl border-0 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-lg text-gray-900">Revenue Breakdown</h3>
        </div>

        <Tabs defaultValue="monthly" onValueChange={handlePeriodChange}>
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
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}
