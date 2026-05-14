// src/app/(dashboardLayout)/layout.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { AppSidebar } from '@/components/Sidebar/AppSidebar'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

// Types
interface UserData {
  id: string
  email: string
  fullName: string
  role: string
  merchant?: {
    id: string
    businessName: string
    plan: string | null
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const getHeaderTitle = () => {
    const path = pathname
    if (path === '/dashboard') {
      return { 
        title: 'Welcome', 
        subtitle: (user as UserData)?.fullName || (user as UserData)?.email || 'User' 
      }
    }
    if (path === '/merchants') return { title: 'Merchants Management' }
    if (path === '/webhooks') return { title: 'Webhook Events' }
    if (path === '/api-logs') return { title: 'API Logs' }
    if (path === '/filings/failed') return { title: 'Failed Filings' }
    if (path === '/health') return { title: 'System Health' }
    if (path === '/reports') return { title: 'Reports' }
    if (path === '/analytics') return { title: 'Analytics' }
    if (path === '/billing') return { title: 'Billing' }
    if (path === '/settings') return { title: 'Settings' }
    return { title: 'Overview' }
  }

  const header = getHeaderTitle()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-20 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          {pathname === '/dashboard' ? (
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">{header.title}</h1>
              <p className="text-sm text-muted-foreground">{header.subtitle}</p>
            </div>
          ) : (
            <h1 className="text-xl font-bold">{header.title}</h1>
          )}
        </header>
        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}