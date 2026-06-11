import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Providers } from '@/lib/providers'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: { default: 'ست بيس | منصة الكرات الثابتة', template: '%s | ست بيس' },
  description: 'أول منصة تخصصية في الكرات الثابتة لكرة القدم الحديثة',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="min-h-screen bg-black text-gray-100">
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
