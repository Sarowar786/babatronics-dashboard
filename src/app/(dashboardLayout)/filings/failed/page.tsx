// src/app/(dashboardLayout)/filings/failed/page.tsx
'use client'

import { useState } from 'react'
import {
  useGetFailedFilingsQuery,
  useRetryFilingMutation,
} from '@/redux/api/adminApi'
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react'
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
import toast from 'react-hot-toast'

// Types
interface FailedFiling {
  id: string
  merchantId: string
  businessName: string
  state: string
  amount: number
  filedAt: string | null
  status: string
}

interface FailedFilingsResponse {
  data: FailedFiling[]
}

interface ApiError {
  data?: {
    message?: string
  }
  message?: string
}

export default function FailedFilingsPage(): React.ReactElement {
  const { data, isLoading, refetch } = useGetFailedFilingsQuery(undefined)
  const [retryFiling, { isLoading: isRetrying }] = useRetryFilingMutation()
  const [retryingId, setRetryingId] = useState<string | null>(null)

  const filings: FailedFiling[] = (data as FailedFilingsResponse)?.data || []

  const handleRetry = async (
    id: string,
    businessName: string,
    state: string,
  ): Promise<void> => {
    setRetryingId(id)
    try {
      await retryFiling(id).unwrap()
      toast.success(`Retrying filing for ${businessName} (${state})`)
      refetch()
    } catch (error: unknown) {
      const apiError = error as ApiError
      toast.error(
        apiError?.data?.message ||
          apiError?.message ||
          'Failed to retry filing',
      )
    } finally {
      setRetryingId(null)
    }
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
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <div>
            <h1 className="text-2xl font-bold">Failed Filings</h1>
            <p className="text-gray-500 mt-1">
              Review and retry failed tax filings
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-red-700">Total Failed Filings</p>
            <p className="text-2xl font-bold text-red-700">{filings.length}</p>
          </div>
          <AlertTriangle className="h-10 w-10 text-red-500 opacity-50" />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Merchant</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  No failed filings found
                </TableCell>
              </TableRow>
            ) : (
              filings.map((filing: FailedFiling) => (
                <TableRow key={filing.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{filing.businessName}</div>
                      <div className="text-xs text-gray-500">
                        {filing.merchantId?.slice(0, 8)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{filing.state}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${filing.amount?.toLocaleString() || 0}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {filing.filedAt
                      ? new Date(filing.filedAt).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-red-100 text-red-800">Failed</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleRetry(
                            filing.id,
                            filing.businessName,
                            filing.state,
                          )
                        }
                        disabled={isRetrying && retryingId === filing.id}
                      >
                        <RefreshCw
                          className={`h-4 w-4 mr-1 ${isRetrying && retryingId === filing.id ? 'animate-spin' : ''}`}
                        />
                        Retry
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
