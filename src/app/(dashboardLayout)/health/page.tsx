// src\app\(dashboardLayout)\health\page.tsx
// src/app/(dashboardLayout)/health/page.tsx
'use client'

import { useGetSystemHealthQuery } from '@/redux/api/adminApi'
import {
  Loader2,
  Activity,
  Database,
  Server,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button';

export default function SystemHealthPage() {
  const { data, isLoading, refetch } = useGetSystemHealthQuery(undefined)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const health = data?.data

  const getStatusColor = (status: string) => {
    return status === 'healthy' ? 'text-green-600' : 'text-red-600'
  }

  const getStatusIcon = (status: string) => {
    return status === 'healthy' ? (
      <CheckCircle className="h-6 w-6 text-green-600" />
    ) : (
      <AlertTriangle className="h-6 w-6 text-red-600" />
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">System Health</h1>
          <p className="text-gray-500 mt-1">
            Monitor system status and performance
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              System Status
            </CardTitle>
            {getStatusIcon(health?.status)}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getStatusColor(health?.status)}`}
            >
              {health?.status === 'healthy' ? 'Healthy' : 'Degraded'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Uptime
            </CardTitle>
            <Server className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(health?.uptime / 3600)}h{' '}
              {Math.floor((health?.uptime % 3600) / 60)}m
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Database
            </CardTitle>
            <Database className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${health?.databaseStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}
            >
              {health?.databaseStatus === 'connected'
                ? 'Connected'
                : 'Disconnected'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Webhooks (5 min)
            </CardTitle>
            <Activity className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(health?.pendingWebhooks || 0) + (health?.failedWebhooks || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {health?.pendingWebhooks} pending, {health?.failedWebhooks} failed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Memory Usage */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Memory Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">RSS</span>
                <span className="text-sm font-medium">
                  {health?.memoryUsage?.rss || 0} MB
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(((health?.memoryUsage?.rss || 0) / 500) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Heap Used</span>
                <span className="text-sm font-medium">
                  {health?.memoryUsage?.heapUsed || 0} MB
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(((health?.memoryUsage?.heapUsed || 0) / 200) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Webhook */}
      {health?.lastWebhookReceived && (
        <Card>
          <CardHeader>
            <CardTitle>Last Webhook Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>
                {new Date(health.lastWebhookReceived).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
