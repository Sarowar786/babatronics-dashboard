// src\app\(dashboardLayout)\analytics\page.tsx
'use client'

import { useState } from 'react'
import { useGetDashboardStatsQuery } from '@/redux/api/adminApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingBag,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Types
interface RevenueDataPoint {
  month: string
  revenue: number
  transactions: number
}

interface PlanDataPoint {
  name: string
  value: number
}

interface PosDataPoint {
  name: string
  value: number
}

interface DashboardStats {
  activeSubscriptions?: number
  totalMerchants?: number
  planDistribution?: {
    basic: number
    pro: number
  }
  posDistribution?: {
    square: number
    clover: number
    shopify: number
  }
}

interface DashboardStatsResponse {
  data: DashboardStats
}

export default function AnalyticsPage(): React.ReactElement {
  const [period, setPeriod] = useState<string>('monthly')
  const { data: stats, isLoading } = useGetDashboardStatsQuery(undefined)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const dashboardStats: DashboardStats =
    (stats as DashboardStatsResponse)?.data || {}

  // Mock data for charts (replace with real API data)
  const revenueData: RevenueDataPoint[] = [
    { month: 'Jan', revenue: 12500, transactions: 342 },
    { month: 'Feb', revenue: 15200, transactions: 421 },
    { month: 'Mar', revenue: 18900, transactions: 512 },
    { month: 'Apr', revenue: 22100, transactions: 634 },
    { month: 'May', revenue: 25800, transactions: 789 },
    { month: 'Jun', revenue: 29800, transactions: 901 },
  ]

  const planData: PlanDataPoint[] = [
    { name: 'Basic', value: dashboardStats.planDistribution?.basic || 0 },
    { name: 'Pro', value: dashboardStats.planDistribution?.pro || 0 },
  ]

  const posData: PosDataPoint[] = [
    { name: 'Square', value: dashboardStats.posDistribution?.square || 0 },
    { name: 'Clover', value: dashboardStats.posDistribution?.clover || 0 },
    { name: 'Shopify', value: dashboardStats.posDistribution?.shopify || 0 },
  ]

  const COLORS: string[] = [
    '#94A3B8',
    '#10B981',
    '#3B82F6',
    '#F59E0B',
    '#EF4444',
  ]

  const totalRevenue: number = revenueData.reduce(
    (sum, d) => sum + d.revenue,
    0,
  )
  const totalTransactions: number = revenueData.reduce(
    (sum, d) => sum + d.transactions,
    0,
  )
  const growth: number =
    ((revenueData[revenueData.length - 1]?.revenue - revenueData[0]?.revenue) /
      revenueData[0]?.revenue) *
    100

  // Custom label renderer for PieChart
  const renderCustomLabel = (entry: PlanDataPoint, percent: number): string => {
    return `${entry.name}: ${(percent * 100).toFixed(0)}%`
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-500 mt-1">
          Platform performance and growth metrics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-sm mt-1">
              {growth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(growth).toFixed(1)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Transactions
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTransactions.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500 mt-1">Total processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Merchants
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.activeSubscriptions?.toLocaleString() || 0}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Out of {dashboardStats.totalMerchants || 0} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Avg. Transaction
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {totalTransactions > 0
                ? (totalRevenue / totalTransactions).toFixed(2)
                : '0'}
            </div>
            <p className="text-sm text-gray-500 mt-1">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Revenue Overview</CardTitle>
          <Tabs defaultValue="monthly" value={period} onValueChange={setPeriod}>
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  name="Revenue ($)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="transactions"
                  stroke="#10B981"
                  name="Transactions"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      renderCustomLabel({ name } as PlanDataPoint, percent || 0)
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {planData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* POS Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>POS Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={posData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" name="Connections" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
