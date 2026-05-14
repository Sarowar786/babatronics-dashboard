// src/app/(dashboardLayout)/merchants/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  useGetMerchantsQuery,
  useSuspendMerchantMutation,
  useActivateMerchantMutation,
} from '@/redux/api/adminApi'
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreVertical,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import toast from 'react-hot-toast'

// Types
interface IntegrationStatus {
  square: boolean
  clover: boolean
  shopify: boolean
}

interface Merchant {
  id: string
  businessName: string
  email: string
  primaryState: string
  plan: string
  subscriptionStatus: string
  integrationStatus: IntegrationStatus
  totalTransactions: number
  createdAt: string
}

interface MerchantsResponse {
  data: {
    merchants: Merchant[]
    total: number
    totalPages: number
  }
}

interface ApiError {
  data?: {
    message?: string
  }
  message?: string
}

function StatusBadge({ status }: { status: string }): React.ReactElement {
  const styles: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    past_due: 'bg-red-100 text-red-800',
    canceled: 'bg-gray-100 text-gray-800',
    incomplete: 'bg-yellow-100 text-yellow-800',
  }

  const displayStatus =
    status === 'active'
      ? 'Active'
      : status === 'past_due'
        ? 'Past Due'
        : status === 'canceled'
          ? 'Canceled'
          : status === 'incomplete'
            ? 'Incomplete'
            : 'Inactive'

  return (
    <Badge className={`${styles[status] || styles.inactive} font-normal`}>
      {displayStatus}
    </Badge>
  )
}

function PlanBadge({ plan }: { plan: string }): React.ReactElement {
  return (
    <Badge
      className={
        plan === 'pro'
          ? 'bg-purple-100 text-purple-800'
          : 'bg-gray-100 text-gray-800'
      }
    >
      {plan === 'pro' ? 'Pro' : 'Basic'}
    </Badge>
  )
}

export default function MerchantsPage(): React.ReactElement {
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [searchInput, setSearchInput] = useState<string>('')
  const [planFilter, setPlanFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const { data, isLoading, refetch } = useGetMerchantsQuery({
    page,
    limit: 15,
    search: search || undefined,
    plan: planFilter || undefined,
    subscriptionStatus: statusFilter || undefined,
  })

  const [suspendMerchant] = useSuspendMerchantMutation()
  const [activateMerchant] = useActivateMerchantMutation()

  const merchants: Merchant[] =
    (data as MerchantsResponse)?.data?.merchants || []
  const total: number = (data as MerchantsResponse)?.data?.total || 0
  const totalPages: number = (data as MerchantsResponse)?.data?.totalPages || 1

  const handleSearch = (): void => {
    setSearch(searchInput)
    setPage(1)
  }

  const handleSuspend = async (id: string, name: string): Promise<void> => {
    const reason = prompt(`Enter suspension reason for ${name}:`)
    if (reason) {
      try {
        await suspendMerchant({ id, reason }).unwrap()
        toast.success(`${name} suspended successfully`)
        refetch()
      } catch (error: unknown) {
        const apiError = error as ApiError
        toast.error(apiError?.data?.message || 'Failed to suspend merchant')
      }
    }
  }

  const handleActivate = async (id: string, name: string): Promise<void> => {
    if (confirm(`Are you sure you want to activate ${name}?`)) {
      try {
        await activateMerchant(id).unwrap()
        toast.success(`${name} activated successfully`)
        refetch()
      } catch (error: unknown) {
        const apiError = error as ApiError
        toast.error(apiError?.data?.message || 'Failed to activate merchant')
      }
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
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Merchants Management</h1>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by business or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Search
            </Button>
            <select
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value)
                setPage(1)
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">All Plans</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="past_due">Past Due</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>
      </header>

      {/* Table Section */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Merchant</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Integrations</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {merchants.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  No merchants found
                </TableCell>
              </TableRow>
            ) : (
              merchants.map((merchant: Merchant) => (
                <TableRow key={merchant.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div>
                      <div>{merchant.businessName}</div>
                      <div className="text-xs text-gray-500">
                        {merchant.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <PlanBadge plan={merchant.plan} />
                  </TableCell>
                  <TableCell>{merchant.primaryState}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {merchant.integrationStatus?.square && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                          Square
                        </span>
                      )}
                      {merchant.integrationStatus?.clover && (
                        <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded">
                          Clover
                        </span>
                      )}
                      {merchant.integrationStatus?.shopify && (
                        <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded">
                          Shopify
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {merchant.totalTransactions?.toLocaleString() || 0}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={merchant.subscriptionStatus} />
                  </TableCell>
                  <TableCell>
                    {new Date(merchant.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/merchants/${merchant.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {merchant.subscriptionStatus === 'active' ? (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() =>
                              handleSuspend(merchant.id, merchant.businessName)
                            }
                          >
                            Suspend
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-green-600"
                            onClick={() =>
                              handleActivate(merchant.id, merchant.businessName)
                            }
                          >
                            Activate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <footer className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * 15 + 1} to {Math.min(page * 15, total)} of{' '}
            {total} merchants
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p: number) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setPage((p: number) => Math.min(totalPages, p + 1))
              }
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </footer>
      )}
    </div>
  )
}
