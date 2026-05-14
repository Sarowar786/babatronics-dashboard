// src/app/(dashboardLayout)/dashboard/page.tsx
'use client'

import { useGetDashboardStatsQuery } from '@/redux/api/adminApi'
import PlanChart from '@/components/dashboard/PlanChart'
import PosChart from '@/components/dashboard/PosChart'
import RevenueChart from '@/components/dashboard/RevenueChart'
import StatCard from '@/components/dashboard/StatCard'
import TopMerchants from '@/components/dashboard/TopMerchants'
import { Users, TrendingUp, Zap, Wallet, Loader2 } from 'lucide-react'

// Types
interface DashboardStats {
  totalMerchants?: number
  monthlyRevenue?: number
  totalTransactions?: number
  totalTaxProcessed?: number
  planDistribution?: {
    basic: number
    pro: number
  }
  posDistribution?: {
    square: number
    clover: number
    shopify: number
  }
  topMerchants?: Array<{
    id: string
    businessName: string
    totalAmount: number
    transactionCount: number
    plan: string
  }>
}

export default function DashboardPage(): React.ReactElement {
  const { data: stats, isLoading } = useGetDashboardStatsQuery(undefined)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const dashboardStats: DashboardStats = stats?.data || {}

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Merchants"
          value={dashboardStats.totalMerchants?.toLocaleString() || '0'}
          icon={<Users size={24} className="text-yellow-600" />}
          iconBg="bg-yellow-100"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${dashboardStats.monthlyRevenue?.toLocaleString() || '0'}`}
          icon={<Wallet size={24} className="text-teal-600" />}
          iconBg="bg-teal-100"
        />
        <StatCard
          title="Total Transactions"
          value={dashboardStats.totalTransactions?.toLocaleString() || '0'}
          icon={<TrendingUp size={24} className="text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Total Tax Processed"
          value={`$${dashboardStats.totalTaxProcessed?.toLocaleString() || '0'}`}
          icon={<Zap size={24} className="text-cyan-600" />}
          iconBg="bg-cyan-100"
        />
      </div>

      {/* MIDDLE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RevenueChart />
        </div>
        <TopMerchants merchants={dashboardStats.topMerchants || []} />
      </div>

      {/* BOTTOM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlanChart />
        <PosChart />
      </div>
    </div>
  )
}
