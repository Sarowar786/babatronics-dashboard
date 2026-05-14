// src/components/dashboard/PlanChart.tsx
'use client'

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { Card } from '@/components/ui/card'
import { useGetPlanDistributionQuery } from '@/redux/api/dashboardApi'
import { Loader2 } from 'lucide-react'

ChartJS.register(ArcElement, Tooltip, Legend)

// Types
interface PlanDistribution {
  basic: number
  pro: number
}

interface PlanDataResponse {
  data: PlanDistribution
}

export default function PlanChart(): React.ReactElement {
  const { data: planData, isLoading } = useGetPlanDistributionQuery(undefined)

  if (isLoading) {
    return (
      <Card className="p-6 rounded-2xl border-0 shadow-sm">
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Card>
    )
  }

  const distribution: PlanDistribution = (planData as PlanDataResponse)
    ?.data || { basic: 0, pro: 0 }
  const total: number = distribution.basic + distribution.pro

  // If no data, show placeholder
  if (total === 0) {
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
        <div className="h-48 flex items-center justify-center text-gray-500">
          No plan distribution data available
        </div>
      </Card>
    )
  }

  const chartData = {
    labels: ['Basic ($29)', 'Pro ($59)'],
    datasets: [
      {
        data: [distribution.basic, distribution.pro],
        backgroundColor: ['#94A3B8', '#10B981'],
        borderColor: ['#F5F5F5', '#F5F5F5'],
        borderWidth: 2,
      },
    ],
  }

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<'doughnut'>): string {
            const value = context.raw as number
            const percentage = ((value / total) * 100).toFixed(1)
            const price = context.label.includes('Pro') ? '$59' : '$29'
            return `${context.label}: ${value} merchants (${percentage}%) - ${price}/mo`
          },
        },
      },
    },
  }

  const basicPercent: string =
    total > 0 ? ((distribution.basic / total) * 100).toFixed(1) : '0'
  const proPercent: string =
    total > 0 ? ((distribution.pro / total) * 100).toFixed(1) : '0'

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
          <Doughnut data={chartData} options={options} />
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#94A3B8]"></div>
            <span className="text-sm text-gray-600">
              Basic: {basicPercent}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
            <span className="text-sm text-gray-600">Pro: {proPercent}%</span>
          </div>
          <div className="mt-2 pt-2 border-t text-xs text-gray-500">
            Total: {total} merchants
          </div>
        </div>
      </div>
    </Card>
  )
}
