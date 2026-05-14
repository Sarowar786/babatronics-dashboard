// src\app\(dashboardLayout)\webhooks\page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useGetWebhookEventsQuery } from '@/redux/api/adminApi'
import { Loader2, CheckCircle, Clock, Eye } from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// Types
interface WebhookEvent {
  id: string
  source: string
  processed: boolean
  createdAt: string
  payload: Record<string, unknown>
}

interface WebhookEventResponse {
  events: WebhookEvent[]
  total: number
}

interface ApiResponse {
  success: boolean
  message: string
  data: WebhookEventResponse
}

interface QueryParams {
  page: number
  limit: number
  source?: string
  processed?: boolean
}

const SOURCE_BADGE_COLORS: Record<string, string> = {
  stripe: 'bg-purple-100 text-purple-800',
  square: 'bg-green-100 text-green-800',
  clover: 'bg-blue-100 text-blue-800',
  shopify: 'bg-orange-100 text-orange-800',
}

const getSourceBadge = (source: string): string => {
  return SOURCE_BADGE_COLORS[source] || 'bg-gray-100 text-gray-800'
}

interface StatusBadge {
  icon: React.ReactNode
  text: string
  className: string
}

const getStatusBadge = (processed: boolean): StatusBadge => {
  if (processed) {
    return {
      icon: <CheckCircle className="h-4 w-4" />,
      text: 'Processed',
      className: 'text-green-600',
    }
  }
  return {
    icon: <Clock className="h-4 w-4" />,
    text: 'Pending',
    className: 'text-yellow-600',
  }
}

export default function WebhooksPage(): React.ReactElement {
  const [source, setSource] = useState<string>('all')
  const [processed, setProcessed] = useState<string>('all')
  const [page, setPage] = useState<number>(1)
  const [selectedPayload, setSelectedPayload] = useState<Record<
    string,
    unknown
  > | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  // Debug: log filter values
  useEffect(() => {
    console.log('Current filters - source:', source, 'processed:', processed)
  }, [source, processed])

  // Build query params
  const queryParams: QueryParams = {
    page,
    limit: 20,
  }

  if (source !== 'all') {
    queryParams.source = source
  }

  // Handle processed filter correctly based on backend expectations
  if (processed !== 'all') {
    queryParams.processed = processed === 'true'
  }

  console.log('Query params being sent:', queryParams)

  const { data, isLoading, refetch } = useGetWebhookEventsQuery(queryParams)

  const apiResponse = data as ApiResponse | undefined
  const events: WebhookEvent[] = apiResponse?.data?.events || []
  const total: number = apiResponse?.data?.total || 0
  const totalPages: number = Math.ceil(total / 20)

  // Debug: log received data
  useEffect(() => {
    if (apiResponse?.data?.events) {
      console.log('Received events count:', events.length)
      console.log('Sample event:', events[0])
      console.log(
        'Processed values in data:',
        events.map((e: WebhookEvent) => ({ id: e.id, processed: e.processed })),
      )
    }
  }, [apiResponse, events])

  const handleViewPayload = (payload: Record<string, unknown>): void => {
    setSelectedPayload(payload)
    setIsDialogOpen(true)
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
        <h1 className="text-2xl font-bold">Webhook Events</h1>
        <p className="text-gray-500 mt-1">
          Monitor incoming webhook events from all sources
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="stripe">Stripe</SelectItem>
            <SelectItem value="square">Square</SelectItem>
            <SelectItem value="clover">Clover</SelectItem>
            <SelectItem value="shopify">Shopify</SelectItem>
          </SelectContent>
        </Select>

        <Select value={processed} onValueChange={setProcessed}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Processed</SelectItem>
            <SelectItem value="false">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={() => refetch()} className="ml-auto">
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Event ID</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  No webhook events found
                </TableCell>
              </TableRow>
            ) : (
              events.map((event: WebhookEvent) => {
                const status = getStatusBadge(event.processed)
                return (
                  <TableRow key={event.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">
                      {event.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Badge className={getSourceBadge(event.source)}>
                        {event.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`flex items-center gap-2 ${status.className}`}
                      >
                        {status.icon}
                        {status.text}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(event.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPayload(event.payload)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
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
            Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of{' '}
            {total} events
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

      {/* Payload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Webhook Payload</DialogTitle>
          </DialogHeader>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
            {JSON.stringify(selectedPayload, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  )
}
