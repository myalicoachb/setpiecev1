'use client'
import { Button } from '@setpiece/ui'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export function EnrollButton({ courseId }: { courseId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const enroll = async () => {
    if (!session) { router.push('/login'); return }
    setLoading(true)
    const res = await fetch(`/api/courses/${courseId}/enroll`, { method: 'POST' })
    if (res.ok) { toast.success('تم التسجيل في الدورة'); router.refresh() }
    else toast.error('حدث خطأ')
    setLoading(false)
  }

  return (
    <Button onClick={enroll} disabled={loading} className="w-full">
      {loading ? 'جاري...' : session ? 'سجل في الدورة' : 'سجل الدخول للتسجيل'}
    </Button>
  )
}
