// src\app\(dashboardLayout)\merchants\[id]\page.tsx
'use client'

import { useParams } from 'next/navigation'
import {
  useGetMerchantByIdQuery,
  useUpdateMerchantSubscriptionMutation,
  useSuspendMerchantMutation,
  useActivateMerchantMutation,
} from '@/redux/api/adminApi'
import {
  Loader2,
  Store,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
  MapPin,
  TrendingUp,
  DollarSign,
  FileText,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState } from 'react'
import toast from 'react-hot-toast'

// Types
interface User {
  id: string
  email: string
  fullName: string
  isEmailVerified: boolean
  createdAt: string
}

interface Subscription {
  id: string
  plan: string
  status: string
  currentPeriodEnd?: string
  cancelAtPeriodEnd: boolean
}

interface Integration {
  id: string
  type: string
  isActive: boolean
  createdAt: string
}

interface Transaction {
  id: string
  transactionDate: string
  amount: number
  taxAmountNumeral: number
  state: string
  source: string
}

interface Filing {
  id: string
  state: string
  dueDate: string
  amountOwed: number | null
  status: string
  filedAt: string | null
}

interface Alert {
  id: string
  alertType: string
  severity: string
  message: string
  state?: string
  createdAt: string
}

interface Stats {
  totalSales: number
  totalTax: number
  totalTransactions: number
  totalFilings: number
}

interface Merchant {
  id: string
  businessName: string
  primaryState: string
  createdAt: string
  users?: User[]
  subscription?: Subscription
  integrations?: Integration[]
  transactions?: Transaction[]
  filings?: Filing[]
  alerts?: Alert[]
  stats?: Stats
}

interface ApiError {
  data?: {
    message?: string
  }
  message?: string
}

export default function MerchantDetailPage(): React.ReactElement {
  const { id } = useParams()
  const { data, isLoading, refetch } = useGetMerchantByIdQuery(id as string)
  const [updateSubscription] = useUpdateMerchantSubscriptionMutation()
  const [suspendMerchant] = useSuspendMerchantMutation()
  const [activateMerchant] = useActivateMerchantMutation()

  const merchant: Merchant | undefined = data?.data
  const stats: Stats | undefined = merchant?.stats

  const [isUpdating, setIsUpdating] = useState<boolean>(false)

  const handlePlanChange = async (plan: string): Promise<void> => {
    setIsUpdating(true)
    try {
      await updateSubscription({ id: id as string, data: { plan } }).unwrap()
      toast.success(`Plan updated to ${plan.toUpperCase()}`)
      refetch()
    } catch (error: unknown) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || 'Failed to update plan')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSuspend = async (): Promise<void> => {
    const reason = prompt('Enter suspension reason:')
    if (reason) {
      try {
        await suspendMerchant({ id: id as string, reason }).unwrap()
        toast.success('Merchant suspended successfully')
        refetch()
      } catch (error: unknown) {
        const apiError = error as ApiError
        toast.error(apiError?.data?.message || 'Failed to suspend merchant')
      }
    }
  }

  const handleActivate = async (): Promise<void> => {
    try {
      await activateMerchant(id as string).unwrap()
      toast.success('Merchant activated successfully')
      refetch()
    } catch (error: unknown) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || 'Failed to activate merchant')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!merchant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Merchant not found</h2>
          <p className="text-gray-500 mt-2">
            The merchant you&rsquo;re looking for doesn&rsquo;t exist.
          </p>
        </div>
      </div>
    )
  }

  const StatusIcon =
    merchant.subscription?.status === 'active'
      ? CheckCircle
      : merchant.subscription?.status === 'past_due'
        ? AlertTriangle
        : XCircle
  const StatusColor =
    merchant.subscription?.status === 'active'
      ? 'text-green-600'
      : merchant.subscription?.status === 'past_due'
        ? 'text-yellow-600'
        : 'text-red-600'

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <Store className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">{merchant.businessName}</h1>
            <Badge
              className={
                merchant.subscription?.plan === 'pro'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800'
              }
            >
              {merchant.subscription?.plan === 'pro' ? 'Pro' : 'Basic'}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-2 text-gray-500">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{merchant.users?.[0]?.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{merchant.primaryState}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                Joined {new Date(merchant.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          {merchant.subscription?.status === 'active' ? (
            <Button variant="destructive" onClick={handleSuspend}>
              Suspend Account
            </Button>
          ) : (
            <Button variant="default" onClick={handleActivate}>
              Activate Account
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Sales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalSales?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Tax
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalTax?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Transactions
            </CardTitle>
            <RefreshCw className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalTransactions?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Filings
            </CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalFilings?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="filings">Filings</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Subscription Tab */}
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Plan</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-lg font-semibold capitalize">
                      {merchant.subscription?.plan}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePlanChange(
                          merchant.subscription?.plan === 'pro'
                            ? 'basic'
                            : 'pro',
                        )
                      }
                      disabled={isUpdating}
                    >
                      {isUpdating
                        ? 'Updating...'
                        : `Switch to ${merchant.subscription?.plan === 'pro' ? 'Basic' : 'Pro'}`}
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusIcon className={`h-5 w-5 ${StatusColor}`} />
                    <p className="text-lg font-semibold capitalize">
                      {merchant.subscription?.status}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Period End</p>
                  <p className="text-lg font-semibold">
                    {merchant.subscription?.currentPeriodEnd
                      ? new Date(
                          merchant.subscription.currentPeriodEnd,
                        ).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cancel at Period End</p>
                  <p className="text-lg font-semibold">
                    {merchant.subscription?.cancelAtPeriodEnd ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>POS Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {merchant.integrations?.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No integrations connected
                  </p>
                ) : (
                  merchant.integrations?.map((integration: Integration) => (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-semibold capitalize">
                          {integration.type}
                        </p>
                        <p className="text-sm text-gray-500">
                          Connected{' '}
                          {new Date(integration.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        className={
                          integration.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {integration.isActive ? 'Connected' : 'Disconnected'}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {merchant.transactions?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-500"
                      >
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    merchant.transactions?.map((tx: Transaction) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          {new Date(tx.transactionDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${Number(tx.amount).toFixed(2)}</TableCell>
                        <TableCell>
                          ${Number(tx.taxAmountNumeral || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>{tx.state}</TableCell>
                        <TableCell className="capitalize">
                          {tx.source}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Filings Tab */}
        <TabsContent value="filings">
          <Card>
            <CardHeader>
              <CardTitle>Filing History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Filed Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {merchant.filings?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-500"
                      >
                        No filings found
                      </TableCell>
                    </TableRow>
                  ) : (
                    merchant.filings?.map((filing: Filing) => (
                      <TableRow key={filing.id}>
                        <TableCell>{filing.state}</TableCell>
                        <TableCell>
                          {new Date(filing.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          ${Number(filing.amountOwed || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              filing.status === 'filed_paid'
                                ? 'bg-green-100 text-green-800'
                                : filing.status === 'filed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : filing.status === 'failed'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {filing.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {filing.filedAt
                            ? new Date(filing.filedAt).toLocaleDateString()
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {merchant.alerts?.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No active alerts
                  </p>
                ) : (
                  merchant.alerts?.map((alert: Alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        alert.severity === 'critical'
                          ? 'border-red-500 bg-red-50'
                          : alert.severity === 'warning'
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">
                            {alert.alertType.replace(/_/g, ' ').toUpperCase()}
                          </p>
                          <p className="text-sm mt-1">{alert.message}</p>
                          {alert.state && (
                            <p className="text-xs text-gray-500 mt-1">
                              State: {alert.state}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
