import { prisma } from '@/lib/db'
import { Badge } from '@setpiece/ui'
import Link from 'next/link'
import { Clock } from 'lucide-react'

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">المقالات</h1>
      <p className="text-gray-500 mb-8">تحليلات متعمقة وتكتيكات متقدمة في الكرات الثابتة</p>
      <div className="grid gap-6 md:grid-cols-2">
        {articles.map(a => (
          <Link key={a.id} href={`/articles/${a.slug}`}
            className="group rounded-xl border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-blue-500/50">
            <Badge variant="info">{a.category}</Badge>
            <h2 className="mt-2 text-xl font-semibold text-white group-hover:text-blue-400">{a.title}</h2>
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{a.excerpt}</p>
            <div className="mt-4 flex items-center gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{a.readTime} دقائق</span>
              {a.publishedAt && <span>{new Date(a.publishedAt).toLocaleDateString('ar')}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
