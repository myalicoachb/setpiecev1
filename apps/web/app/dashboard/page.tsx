import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, Progress, Badge } from '@setpiece/ui'
import Link from 'next/link'
import { BookOpen, Video, Palette, Bookmark } from 'lucide-react'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const [enrollments, saved, drawings] = await Promise.all([
    prisma.enrollment.findMany({ where: { userId: session.user.id }, include: { course: true }, orderBy: { createdAt: 'desc' } }),
    prisma.savedContent.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' } }),
    prisma.drawing.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' } }),
  ])

  const completedCourses = enrollments.filter(e => e.completed).length
  const totalProgress = enrollments.reduce((acc, e) => acc + e.progress, 0)
  const avgProgress = enrollments.length ? Math.round(totalProgress / enrollments.length) : 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">لوحة التحكم</h1>
        <p className="text-gray-500">مرحباً، {session.user.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {[
          { icon: BookOpen, label: 'دورات مكتملة', value: completedCourses },
          { icon: Video, label: 'دورات مسجل فيها', value: enrollments.length },
          { icon: Bookmark, label: 'محتوى محفوظ', value: saved.length },
          { icon: Palette, label: 'رسومات تكتيكية', value: drawings.length },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10">
                <stat.icon className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>دوراتي</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {enrollments.length === 0 ? (
              <p className="text-sm text-gray-500">لم تسجل في أي دورة بعد. <Link href="/courses" className="text-blue-400 hover:underline">تصفح الدورات</Link></p>
            ) : enrollments.map(e => (
              <Link key={e.id} href={`/courses/${e.course.slug}`} className="flex items-center gap-4 rounded-lg bg-gray-800/30 p-3 transition-colors hover:bg-gray-800/50">
                <div className="h-12 w-16 flex-shrink-0 rounded-md bg-gray-700 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-gray-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{e.course.title}</p>
                  <Progress value={e.progress} className="mt-1 h-1.5" />
                </div>
                <span className="text-xs text-gray-500">{e.progress}%</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>رسوماتي التكتيكية</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {drawings.length === 0 ? (
              <p className="text-sm text-gray-500">لم تقم بإنشاء أي رسم تكتيكي بعد. <Link href="/pitch-editor" className="text-blue-400 hover:underline">ابدأ الآن</Link></p>
            ) : drawings.map(d => (
              <div key={d.id} className="flex items-center justify-between rounded-lg bg-gray-800/30 p-3">
                <div className="flex items-center gap-3">
                  <Palette className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-300">{d.title}</span>
                </div>
                <Badge variant={d.isPublic ? 'success' : 'default'}>{d.isPublic ? 'عام' : 'خاص'}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
