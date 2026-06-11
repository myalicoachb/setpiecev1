import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Badge, Progress, Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button } from '@setpiece/ui'
import { auth } from '@/lib/auth'
import { BookOpen, Clock, CheckCircle, Play } from 'lucide-react'
import { EnrollButton } from './enroll-button'

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: { modules: { orderBy: { order: 'asc' }, include: { lessons: { orderBy: { order: 'asc' } } } }, _count: { select: { enrollments: true } } },
  })
  if (!course) notFound()

  const session = await auth()
  const enrollment = session?.user?.id
    ? await prisma.enrollment.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId: course.id } } })
    : null

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const typeIcons: Record<string, React.ReactNode> = { VIDEO: <Play className="h-3 w-3" />, ARTICLE: <BookOpen className="h-3 w-3" />, QUIZ: <CheckCircle className="h-3 w-3" /> }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="aspect-video rounded-xl bg-gray-800 flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-gray-600" />
          </div>
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="info">{course.category}</Badge>
              <Badge>{course.level}</Badge>
              {course.isPremium && <Badge variant="warning">مميز</Badge>}
            </div>
            <h1 className="text-3xl font-bold text-white">{course.title}</h1>
            <p className="mt-4 text-gray-400 leading-relaxed">{course.description}</p>
            <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" />{course.modules.length} وحدات</span>
              <span className="flex items-center gap-1"><Play className="h-4 w-4" />{totalLessons} درس</span>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            {enrollment ? (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-gray-400">التقدم</span>
                  <span className="text-sm font-medium text-white">{enrollment.progress}%</span>
                </div>
                <Progress value={enrollment.progress} />
                <Button className="mt-4 w-full">متابعة التعلم</Button>
              </div>
            ) : (
              <EnrollButton courseId={course.id} />
            )}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold text-white">محتوى الدورة</h2>
        <Accordion type="multiple" className="w-full">
          {course.modules.map((module, idx) => (
            <AccordionItem key={module.id} value={module.id}>
              <AccordionTrigger>
                <div className="flex items-center gap-3 text-right">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600/20 text-xs text-blue-400">{idx + 1}</span>
                  <div>
                    <span className="font-medium text-white">{module.title}</span>
                    <span className="mr-2 text-xs text-gray-500">{module.lessons.length} دروس</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pr-10">
                  {module.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between rounded-lg bg-gray-800/30 p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">{typeIcons[lesson.type] || '•'}</span>
                        <span className="text-sm text-gray-300">{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {lesson.duration && <span className="text-xs text-gray-600">{Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')}</span>}
                        <Badge variant="default" className="text-[10px]">{lesson.type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
