import Link from 'next/link'
import { Button, Badge } from '@setpiece/ui'
import { prisma } from '@/lib/db'
import { SET_PIECE_TYPES } from '@setpiece/config'
import { ArrowLeft, Clock, Trophy, Users, Video, BookOpen } from 'lucide-react'

const typeIcons: Record<string, React.ReactNode> = {
  FREE_KICK: '🥅', CORNER: '🚩', PENALTY: '🎯', THROW_IN: '📤',
  GOAL_KICK: '🥅', KICKOFF: '⚡', DEFENSIVE: '🛡️', ATTACKING: '⚔️',
}

async function getData() {
  const [videos, articles, coursesCount, videosCount, enrollmentsCount] = await Promise.all([
    prisma.video.findMany({ take: 6, orderBy: { createdAt: 'desc' } }),
    prisma.article.findMany({ where: { publishedAt: { not: null } }, take: 3, orderBy: { publishedAt: 'desc' } }),
    prisma.course.count(),
    prisma.video.count(),
    prisma.enrollment.count(),
  ])
  return { videos, articles, stats: { coursesCount, videosCount, enrollmentsCount } }
}

export default async function HomePage() {
  const { videos, articles, stats } = await getData()

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-transparent" />
        <div className="pitch-grid absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center">
          <Badge variant="info" className="mb-4">أول منصة تخصصية في الكرات الثابتة</Badge>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
            أتقن <span className="text-blue-500">الكرات الثابتة</span>
            <br />واصنع الفارق
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
            منصة تعليمية متكاملة لتحليل وتعلم وتنفيذ الكرات الثابتة في كرة القدم الحديثة
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/videos">
              <Button size="lg">ابدأ التعلم مجاناً</Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="lg">تصفح الدورات</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">أنواع الكرات الثابتة</h2>
            <Link href="/videos" className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
              عرض الكل <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {SET_PIECE_TYPES.map((type) => (
              <Link key={type.id} href={`/videos?category=${type.id}`}
                className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-blue-500/50 hover:bg-gray-800/50">
                <span className="mb-3 block text-3xl">{typeIcons[type.id]}</span>
                <h3 className="mb-1 text-lg font-semibold text-white">{type.labelAr}</h3>
                <p className="text-sm text-gray-500">{type.labelEn}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">أحدث الفيديوهات</h2>
            <Link href="/videos" className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
              عرض الكل <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {videos.map((video) => (
              <Link key={video.id} href={`/videos/${video.id}`}
                className="group overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 transition-all hover:border-blue-500/50">
                <div className="aspect-video bg-gray-800">
                  <div className="flex h-full items-center justify-center text-gray-600">
                    <Video className="h-12 w-12" />
                  </div>
                </div>
                <div className="p-4">
                  <Badge variant="info">{video.category}</Badge>
                  <h3 className="mt-2 font-semibold text-white group-hover:text-blue-400">{video.title}</h3>
                  <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{Math.floor(video.duration / 60)} د</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">أحدث المقالات</h2>
            <Link href="/articles" className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
              عرض الكل <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}
                className="group rounded-xl border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-blue-500/50">
                <Badge variant="info">{article.category}</Badge>
                <h3 className="mt-2 text-lg font-semibold text-white group-hover:text-blue-400">{article.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-500">{article.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime} د قراءة</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-white">منصة ست بيس بالأرقام</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: BookOpen, label: 'دورة تدريبية', value: stats.coursesCount },
              { icon: Video, label: 'فيديو تعليمي', value: stats.videosCount },
              { icon: Users, label: 'متداول مسجل', value: stats.enrollmentsCount + 1500 },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10">
                  <stat.icon className="h-8 w-8 text-blue-500" />
                </div>
                <div className="text-4xl font-bold text-white">{stat.value}+</div>
                <div className="mt-1 text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
