'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { TooltipProvider } from '@setpiece/ui'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: { background: '#1f2937', color: '#f3f4f6', border: '1px solid #374151' },
            }}
          />
        </TooltipProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
