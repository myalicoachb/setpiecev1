import { prisma } from '@/lib/db'
import { Badge, Progress } from '@setpiece/ui'
import { SET_PIECE_TYPES, LEVELS } from '@setpiece/config'
import Link from 'next/link'
import { BookOpen, Users } from 'lucide-react'

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { level?: string; category?: string }
}) {
  const where: any = {}
  if (searchParams.level && searchParams.level !== 'ALL') where.level = searchParams.level
  if (searchParams.category && searchParams.category !== 'ALL') where.category = searchParams.category

  const courses = await prisma.course.findMany({
    where,
    include: { modules: true, _count: { select: { enrollments: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">الدورات التدريبية</h1>
        <p className="text-gray-500">مسارات تعليمية متكاملة لتطوير مهاراتك في الكرات الثابتة</p>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        <Link href="/courses" className="rounded-full border border-gray-700 px-4 py-1.5 text-sm text-gray-400 hover:bg-gray-800 hover:text-white">الكل</Link>
        {LEVELS.map(l => (
          <Link key={l.id} href={`/courses?level=${l.id}`} className="rounded-full border border-gray-700 px-4 py-1.5 text-sm text-gray-400 hover:bg-gray-800 hover:text-white">{l.labelAr}</Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map(course => (
          <Link key={course.id} href={`/courses/${course.slug}`}
            className="group rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden transition-all hover:border-blue-500/50">
            <div className="aspect-video bg-gray-800 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-gray-600" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="info">{course.category}</Badge>
                <Badge>{course.level}</Badge>
                {course.isPremium && <Badge variant="warning">مميز</Badge>}
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400">{course.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-500">{course.description}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{course.modules.length} وحدات</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course._count.enrollments} مسجل</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
