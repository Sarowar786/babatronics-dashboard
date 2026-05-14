// src\app\(dashboardLayout)\billing\page.tsx
'use client'

import { useGetDashboardStatsQuery } from '@/redux/api/adminApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  Download,
} from 'lucide-react'

export default function BillingPage() {
  const { data: stats, isLoading } = useGetDashboardStatsQuery(undefined)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const dashboardStats = stats?.data || {}

  // Mock subscription data (replace with real API data)
  const subscriptions = [
    {
      id: 1,
      merchant: 'TechShop Online',
      plan: 'Pro',
      amount: 59,
      status: 'active',
      billingDate: '2026-05-15',
    },
    {
      id: 2,
      merchant: "Maria's Restaurant",
      plan: 'Pro',
      amount: 59,
      status: 'active',
      billingDate: '2026-05-14',
    },
    {
      id: 3,
      merchant: "Joe's Corner Store",
      plan: 'Basic',
      amount: 29,
      status: 'active',
      billingDate: '2026-05-13',
    },
    {
      id: 4,
      merchant: 'Urban Threads',
      plan: 'Pro',
      amount: 59,
      status: 'past_due',
      billingDate: '2026-05-10',
    },
    {
      id: 5,
      merchant: 'ABC Store',
      plan: 'Basic',
      amount: 29,
      status: 'active',
      billingDate: '2026-05-09',
    },
  ]

  const totalMonthlyRevenue = dashboardStats.monthlyRevenue || 0
  const activeSubscriptions = dashboardStats.activeSubscriptions || 0
  const averageRevenuePerMerchant =
    activeSubscriptions > 0 ? totalMonthlyRevenue / activeSubscriptions : 0

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Billing Overview</h1>
        <p className="text-gray-500 mt-1">Manage subscriptions and revenue</p>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalMonthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">From subscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Subscriptions
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-gray-500 mt-1">Active merchants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Avg. Revenue/Merchant
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${averageRevenuePerMerchant.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Monthly average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pro %
            </CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.planDistribution?.pro > 0
                ? (
                    (dashboardStats.planDistribution.pro /
                      (dashboardStats.planDistribution.basic +
                        dashboardStats.planDistribution.pro)) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </div>
            <p className="text-xs text-gray-500 mt-1">Pro plan adoption</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Subscriptions</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Billing Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.merchant}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        sub.plan === 'Pro'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {sub.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>${sub.amount}/mo</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        sub.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : sub.status === 'past_due'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(sub.billingDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
