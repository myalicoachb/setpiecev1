'use client'
import { signIn } from 'next-auth/react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@setpiece/ui'
import { useState } from 'react'
import { Chrome, Mail } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn('resend', { email, redirect: false })
    setSent(true)
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>تسجيل الدخول</CardTitle>
          <CardDescription>اختر طريقة تسجيل الدخول المفضلة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} variant="outline" className="w-full gap-2">
            <Chrome className="h-5 w-5" /> تسجيل الدخول بـ Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-800" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-gray-900 px-2 text-gray-500">أو</span></div>
          </div>
          {sent ? (
            <p className="text-center text-sm text-emerald-400">تم إرسال رابط التسجيل إلى بريدك الإلكتروني</p>
          ) : (
            <form onSubmit={sendMagicLink} className="space-y-3">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني" required
                className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <Button type="submit" className="w-full gap-2"><Mail className="h-4 w-4" /> إرسال رابط التسجيل</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
