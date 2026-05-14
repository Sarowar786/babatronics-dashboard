// src/app/(dashboardLayout)/api-logs/page.tsx
'use client'

import { useState } from 'react'
import { useGetApiLogsQuery } from '@/redux/api/adminApi'
import { Loader2, Terminal, CheckCircle, XCircle } from 'lucide-react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Types
interface ApiLog {
  id: string
  service: string
  endpoint: string
  statusCode: number
  createdAt: string
  request: Record<string, unknown>
  response: Record<string, unknown>
}

interface ApiLogsResponse {
  data: {
    logs: ApiLog[]
    total: number
  }
}

interface StatusBadgeInfo {
  color: string
  icon: typeof CheckCircle | typeof XCircle
}

export default function ApiLogsPage(): React.ReactElement {
  const [service, setService] = useState<string>('')
  const [page, setPage] = useState<number>(1)

  const { data, isLoading } = useGetApiLogsQuery({
    service: service === 'all' ? undefined : service,
    page,
    limit: 30,
  })

  const logs: ApiLog[] = (data as ApiLogsResponse)?.data?.logs || []
  const total: number = (data as ApiLogsResponse)?.data?.total || 0
  const totalPages: number = Math.ceil(total / 30)

  const getStatusBadge = (statusCode: number): StatusBadgeInfo => {
    if (statusCode >= 200 && statusCode < 300) {
      return { color: 'bg-green-100 text-green-800', icon: CheckCircle }
    } else {
      return { color: 'bg-red-100 text-red-800', icon: XCircle }
    }
  }

  const handleViewDetails = (log: ApiLog): void => {
    const details = `Request: ${JSON.stringify(log.request, null, 2)}\n\nResponse: ${JSON.stringify(log.response, null, 2)}`
    navigator.clipboard.writeText(details)
    alert('Details copied to clipboard')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">API Logs</h1>
        <p className="text-gray-500 mt-1">Monitor all external API calls</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={service} onValueChange={setService}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="stripe">Stripe</SelectItem>
            <SelectItem value="square">Square</SelectItem>
            <SelectItem value="clover">Clover</SelectItem>
            <SelectItem value="shopify">Shopify</SelectItem>
            <SelectItem value="numeral">Numeral (Tax)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  No API logs found
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log: ApiLog) => {
                const status = getStatusBadge(log.statusCode)
                const StatusIcon = status.icon
                return (
                  <TableRow key={log.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-gray-400" />
                        <span className="font-medium capitalize">
                          {log.service}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.endpoint}
                    </TableCell>
                    <TableCell>
                      <Badge className={status.color}>
                        <StatusIcon className="h-3 w-3 mr-1 inline" />
                        {log.statusCode}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(log)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <footer className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * 30 + 1} to {Math.min(page * 30, total)} of{' '}
            {total} logs
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p: number) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((p: number) => Math.min(totalPages, p + 1))
              }
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </footer>
      )}
    </div>
  )
}
