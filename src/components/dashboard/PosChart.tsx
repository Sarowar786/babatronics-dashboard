// src/components/dashboard/PosChart.tsx
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
import { useGetPosDistributionQuery } from '@/redux/api/dashboardApi'
import { Loader2 } from 'lucide-react'

ChartJS.register(ArcElement, Tooltip, Legend)

// Types
interface PosDistribution {
  square: number
  clover: number
  shopify: number
}

interface PosDataResponse {
  data: PosDistribution
}

export default function PosChart(): React.ReactElement {
  const { data: posData, isLoading } = useGetPosDistributionQuery(undefined)

  if (isLoading) {
    return (
      <Card className="p-6 rounded-2xl border-0 shadow-sm">
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Card>
    )
  }

  const distribution: PosDistribution = (posData as PosDataResponse)?.data || {
    square: 0,
    clover: 0,
    shopify: 0,
  }
  const total: number =
    distribution.square + distribution.clover + distribution.shopify

  // If no data, show placeholder
  if (total === 0) {
    return (
      <Card className="p-6 rounded-2xl border-0 shadow-sm">
        <div>
          <h3 className="font-bold text-lg mb-1 text-gray-900">
            POS Integrations
          </h3>
          <p className="text-xs text-gray-500 mb-6">Connected POS systems</p>
        </div>
        <div className="h-48 flex items-center justify-center text-gray-500">
          No POS integrations data available
        </div>
      </Card>
    )
  }

  const chartData = {
    labels: ['Square', 'Clover', 'Shopify'],
    datasets: [
      {
        data: [distribution.square, distribution.clover, distribution.shopify],
        backgroundColor: ['#3B82F6', '#F59E0B', '#EF4444'],
        borderColor: ['#F5F5F5', '#F5F5F5', '#F5F5F5'],
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
            return `${context.label}: ${value} (${percentage}%)`
          },
        },
      },
    },
  }

  const squarePercent: string =
    total > 0 ? ((distribution.square / total) * 100).toFixed(1) : '0'
  const cloverPercent: string =
    total > 0 ? ((distribution.clover / total) * 100).toFixed(1) : '0'
  const shopifyPercent: string =
    total > 0 ? ((distribution.shopify / total) * 100).toFixed(1) : '0'

  return (
    <Card className="p-6 rounded-2xl border-0 shadow-sm">
      <div>
        <h3 className="font-bold text-lg mb-1 text-gray-900">
          POS Integrations
        </h3>
        <p className="text-xs text-gray-500 mb-6">Connected POS systems</p>
      </div>
      <div className="h-48 flex items-center justify-between">
        <div className="flex-1">
          <Doughnut data={chartData} options={options} />
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
            <span className="text-sm text-gray-600">
              Square: {squarePercent}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
            <span className="text-sm text-gray-600">
              Clover: {cloverPercent}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
            <span className="text-sm text-gray-600">
              Shopify: {shopifyPercent}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
