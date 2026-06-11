'use client'
import { signIn } from 'next-auth/react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@setpiece/ui'
import { Chrome } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>إنشاء حساب</CardTitle>
          <CardDescription>انضم إلى منصة ست بيس وابدأ رحلة التعلم</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} variant="outline" className="w-full gap-2">
            <Chrome className="h-5 w-5" /> إنشاء حساب بـ Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-800" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-gray-900 px-2 text-gray-500">لديك حساب؟</span></div>
          </div>
          <Link href="/login"><Button variant="ghost" className="w-full">تسجيل الدخول</Button></Link>
        </CardContent>
      </Card>
    </div>
  )
}
